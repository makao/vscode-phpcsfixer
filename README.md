# PHP CS Fixer for Visual Studio Code
This extension simply provides [PHP CS Fixer](http://cs.sensiolabs.org) command.

## Instalation
Open command palette <kbd>F1</kbd> and select `Extensions: Install Extension`, then search for PHP CS Fixer.

**Note**: PHP CS Fixer must be installed.

[Installation guide](http://cs.sensiolabs.org/#installation)

## Configuration
```JSON
{
    "phpcsfixer.executablePath": "php-cs-fixer",
    "phpcsfixer.onsave": false,
    "phpcsfixer.useConfigFile": false,
    "phpcsfixer.configFileName": ".php_cs",
    "phpcsfixer.level": "psr2",
    "phpcsfixer.fixers": ""
}
```

## Usage
<kbd>F1</kbd> -> `PHP CS Fixer: fix this file`

Additionally you can configure this extension to execute on save.

    "phpcsfixer.onsave": true

For more information please visit: http://cs.sensiolabs.org

## License
MIT