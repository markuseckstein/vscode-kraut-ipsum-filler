# kraut-ipsum-filler

Fetches some traditional German filler text from http://www.krautipsum.com and inserts it at the current position in the current document.

## Features

### Command Palette

You can use the Command Palette to execute the command `Kraut einfügen` to insert a paragraph of Kraut Ipsum at the current position.

### Emmet style

It is also possible to just type `kraut` and hit `ctrl + tab` in the text editor to insert a paragraph of Kraut Ipsum at the current position.
To insert more paragraphs at once, use `kraut*3` and hit `ctrl + tab`. (Note: you can insert at most 5 paragraphs in one go). Currently it is not possible to use only `tab` as trigger, because
this would break the default emmet implementation of VSCode. If you know how to fix this, I would appreciate a pull request.

## Where is all the data from?

This extension gets its filler texts from the great Kraut Ipsum German Filler Text Generator at
<a href="http://www.krautipsum.com">http://www.krautipsum.com</a>.

<a href="https://github.com/nicokoenig/krautipsum">https://github.com/nicokoenig/krautipsum</a>

## Release Notes

### 1.0.0

Now shortcut (ctrl + tab) to trigger kraut generation.

### 1.1.0

Adapt to krautipsum.com URL and protocol changes. Add error logging.

### 1.1.1

Update dependencies.
