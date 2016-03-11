'use strict';

import * as vscode from 'vscode';
import * as cp from 'child_process';

class PHPCSFixer {

    private save: boolean;
    private executable: string;
    private level: string;
    private fixers: string;
    private command: vscode.Disposable;
    private saveCommand: vscode.Disposable;

    constructor() {
        let config = vscode.workspace.getConfiguration('phpcsfixer');
        this.save = config.get('onsave', false);
        this.executable = config.get('executablePath', 'php-cs-fixer');
        this.level = config.get('level', 'psr2');
        this.fixers = config.get('fixers', '');
    }

    dispose() {
        this.command.dispose();
        this.saveCommand.dispose();
	}

    activate(context: vscode.ExtensionContext) {

        if (this.save) {
            this.saveCommand = vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
                this.fix(document);
            });
		}

        this.command = vscode.commands.registerTextEditorCommand('phpcsfixer.fix', (textEditor: vscode.TextEditor) => {
            this.fix(textEditor.document);
        });

		context.subscriptions.push(this);
	}

    fix(document: vscode.TextDocument) {

        if (document.languageId !== 'php') {
            return;
        }

        let stdout = '';
        let args = ['fix', document.fileName];

        if (this.level) {
            args.push('--level=' + this.level);
        }
        if (this.fixers) {
            args.push('--fixers=' + this.fixers);
        }

        let exec = cp.spawn(this.executable, args);

        exec.stdout.on('data', (buffer: Buffer) => {
            stdout += buffer.toString();
        });

        exec.stderr.on('data', (buffer: Buffer) => {
            console.log(buffer.toString());
        });

        exec.on('close', (code: number) => {
            if (code <= 1) {
                vscode.window.activeTextEditor.hide();
                vscode.window.activeTextEditor.show();
                vscode.window.setStatusBarMessage('PHP CS Fixer: ' + stdout.match(/^Fixed.*/m)[0] + '.', 4000);
                return;
            }
            if (code === 16) {
                vscode.window.showErrorMessage('PHP CS Fixer: Configuration error of the application.');
                return;
            }
            if (code === 32) {
                vscode.window.showErrorMessage('PHP CS Fixer: Configuration error of a Fixer.');
                return;
            }
            vscode.window.showErrorMessage('PHP CS Fixer unknown error.');
        });
    }
}

export function activate(context: vscode.ExtensionContext) {
	let phpcsfixer = new PHPCSFixer();
	phpcsfixer.activate(context);
}
