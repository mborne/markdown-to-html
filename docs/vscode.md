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
            "program": "${workspaceFolder}/node_modules/.bin/vitest",
            "args": ["run"]
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Serve samples/01-default-layout",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/tsx",
            "program": "${workspaceFolder}/src/bin/main.ts",
            "args": ["serve","samples/01-default-layout", "-l","remarkjs"]
        }
    ]
}
```

Note that the TypeScript sources are run directly with [tsx](https://www.npmjs.com/package/tsx), so
there is no need to run `npm run build` before debugging.
