'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as http from 'http';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "kraut-ipsum-filler" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.insertKraut', () => {
        // The code you place here will be executed every time your command is executed
        http.get({
            host: 'www.krautipsum.com',
            path: '/api/kraut'
        }, (response) => {
            let kraut = '';
            response.on('data', (data) => {
                console.log(data);
                kraut += data;
            });
            response.on('end', () => {
                let krautString = JSON.parse(kraut).kraut;
                console.log(krautString);
                let func = (editBuilder: vscode.TextEditorEdit) => {
                    insertKraut(editBuilder, krautString);
                };
                vscode.window.activeTextEditor.edit(func, { undoStopBefore: true, undoStopAfter: true });
            });
        })
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function insertKraut(editBuilder: vscode.TextEditorEdit, content: string): void {
    editBuilder.insert(new vscode.Position(0, 0), content);
}



