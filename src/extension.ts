"use strict";

import * as vscode from "vscode";
import { getKrautText } from "./kraut-loader";

export function activate(context: vscode.ExtensionContext) {
  let disposableEmmet = vscode.commands.registerCommand(
    "extension.insertKrautEmmet",
    () => {
      let editor = vscode.window.activeTextEditor;
      let currentPos = editor.selection.active;
      let line = editor.document.lineAt(currentPos.line).text;

      let parseResult = parseEmmet(line);
      let numParagraphs = parseResult.numberOfKrauts;
      numParagraphs = sanitizeResult(numParagraphs);

      if (numParagraphs === 0) {
        editor.edit(
          (editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(currentPos, "\t");
          },
          { undoStopBefore: true, undoStopAfter: true }
        );
        return;
      }

      let promiseArray: Promise<string>[] = [];
      for (let i = 0; i < numParagraphs; i++) {
        promiseArray.push(getKrautText());
      }

      Promise.all(promiseArray)
        .then((values: string[]) => {
          let insertText = values.join("\n\n");
          let currentPos = editor.selection.active;

          editor.edit(
            (editBuilder: vscode.TextEditorEdit) => {
              editBuilder.delete(
                new vscode.Range(
                  new vscode.Position(currentPos.line, parseResult.startPos),
                  new vscode.Position(currentPos.line, parseResult.endPos)
                )
              );
              editBuilder.insert(currentPos, insertText);
            },
            { undoStopBefore: true, undoStopAfter: true }
          );
        })
        .catch(err => {
          console.error("Error while fetching kraut from API", err);
        });
    }
  );

  let disposableMenu = vscode.commands.registerCommand(
    "extension.insertKrautMenu",
    () => {
      let editor = vscode.window.activeTextEditor;
      let currentPos = editor.selection.active;
      let line = editor.document.lineAt(currentPos.line).text;

      getKrautText().then(kraut => {
        let currentPos = editor.selection.active;
        editor.edit(
          (editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(currentPos, kraut);
          },
          { undoStopBefore: true, undoStopAfter: true }
        );
      });
    }
  );

  context.subscriptions.push(disposableEmmet);
  context.subscriptions.push(disposableMenu);
}

export function deactivate() {}

export function parseEmmet(text: string): ParseResult {
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

export function sanitizeResult(count: number) {
  if (count < 0) {
    count = 0;
  } else if (count > 5) {
    count = 5;
  }
  return count;
}

export type ParseResult = {
  numberOfKrauts: number;
  startPos: number;
  endPos: number;
};
