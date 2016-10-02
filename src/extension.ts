'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as http from 'http';
import { getKrautText } from './kraut-loader';

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
        let editor = vscode.window.activeTextEditor;
        let currentPos = editor.selection.active;
        let line = editor.document.lineAt(currentPos.line).text;

        let parseResult = parseEmmet(line);
        let numParagraphs = parseResult.numberOfKrauts;
        numParagraphs = sanitizeResult(numParagraphs);

        if (numParagraphs === 0) {
            editor.edit((editBuilder: vscode.TextEditorEdit) => {
                editBuilder.insert(currentPos, '\t');
            }, { undoStopBefore: true, undoStopAfter: true });
            return;
        }

        let promiseArray: Promise<string>[] = [];
        for (let i = 0; i < numParagraphs; i++) {
            promiseArray.push(getKrautText());
        }

        Promise.all(promiseArray)
            .then((values: string[]) => {
                let insertText = values.join('\n\n');
                let currentPos = editor.selection.active;

                editor.edit((editBuilder: vscode.TextEditorEdit) => {
                    editBuilder.delete(new vscode.Range(new vscode.Position(currentPos.line, parseResult.startPos), new vscode.Position(currentPos.line, parseResult.endPos)));
                    editBuilder.insert(currentPos, insertText);
                }, { undoStopBefore: true, undoStopAfter: true });
            });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}


function parseEmmet(text: string): ParseResult {
    const regexWithNum = /.*(kraut\*(\d+)).*/gi; // searches for 'foo bar kraut*2';
    const regexWithoutNum = /.*(kraut).*/gi; // searches for 'foo bar kraut';
    let result = regexWithNum.exec(text);
    let numberOfKrauts = 0;
    let startPos = 0;
    let endPos = 0;
    if (result) {
        numberOfKrauts = parseInt(result[2]);
        startPos = text.indexOf(result[1]);
        endPos = startPos + result[1].length;
    } else {
        result = regexWithoutNum.exec(text);
        if (result) {
            numberOfKrauts = 1;
            startPos = text.indexOf(result[1]);
            endPos = startPos + result[1].length;
        }
    }
    return { numberOfKrauts, startPos, endPos };
}

function sanitizeResult(count:number) {
    if (count < 0) {
        count = 0;
    } else if (count > 5) {
        count = 5;
    }
    return count;
}

type ParseResult = {
    numberOfKrauts: number;
    startPos: number;
    endPos: number;
}

