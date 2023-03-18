# Debug with Visual Studio Code

Use the following config in `.vscode/launch.json` file to debug tests or server mode with [Visual Studio Code](https://code.visualstudio.com/) : 

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Run test",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/node_modules/.bin/mocha"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Serve samples/01-default-layout",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/bin/main.js",
            "args": ["serve","samples/01-default-layout", "-l","remarkjs"]
        }
    ]
}
```
