
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

suite("Kraut Filler Extension Tests", () => {

    test("Emmet parser leaves non-kraut text alone", () => {
        let result: myExtension.ParseResult = myExtension.parseEmmet('foo bar*5');
        assert.equal(0, result.numberOfKrauts);
        assert.equal(0, result.startPos);
        assert.equal(0, result.endPos);
    });


    test("Emmet parser single paragraph", () => {
        let result: myExtension.ParseResult = myExtension.parseEmmet('foo bar*5kraut');
        assert.equal(1, result.numberOfKrauts);
        assert.equal(9, result.startPos);
        assert.equal(14, result.endPos);
    });

    test("Emmet parser multi paragraph TC1", () => {
        let result: myExtension.ParseResult = myExtension.parseEmmet('foo bar*5kraut*1');
        assert.equal(1, result.numberOfKrauts);
        assert.equal(9, result.startPos);
        assert.equal(16, result.endPos);
    });

    test("Emmet parser multi paragraph TC2", () => {
        let result: myExtension.ParseResult = myExtension.parseEmmet('foo bar*5kraut*0');
        assert.equal(0, result.numberOfKrauts);
        assert.equal(9, result.startPos);
        assert.equal(16, result.endPos);
    });

    test("Emmet parser multi paragraph TC3", () => {
        let result: myExtension.ParseResult = myExtension.parseEmmet('foo bar*5kraut*6');
        assert.equal(6, result.numberOfKrauts);
        assert.equal(9, result.startPos);
        assert.equal(16, result.endPos);
    });

    test("Emmet parser multi paragraph TC4", () => {
        let result: myExtension.ParseResult = myExtension.parseEmmet('foo bar*5kraut*333');
        assert.equal(333, result.numberOfKrauts);
        assert.equal(9, result.startPos);
        assert.equal(18, result.endPos);
    });

    test("Sanitize negative number", () => {
        let result: number = myExtension.sanitizeResult(-17);
        assert.equal(0, result);
    });

    test("Sanitize number > 5", () => {
        let result: number = myExtension.sanitizeResult(6);
        assert.equal(5, result);
    });
});