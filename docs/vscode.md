# Debug with Visual Studio Code

Use the following config in `.vscode/launch.json` file to debug tests or server mode with [Visual Studio Code](https://code.visualstudio.com/) : 

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Run mocha",
            "runtimeExecutable": "mocha",
            "cwd": "${workspaceFolder}",
            "args": []
        }
    ]
}
```
