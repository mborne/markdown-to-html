# markdown-to-html

[![Node.js CI](https://github.com/mborne/markdown-to-html/actions/workflows/nodejs.yml/badge.svg)](https://github.com/mborne/markdown-to-html/actions/workflows/nodejs.yml) [![Coverage Status](https://coveralls.io/repos/github/mborne/markdown-to-html/badge.svg?branch=master)](https://coveralls.io/github/mborne/markdown-to-html?branch=master)

Markdown renderer aiming at providing :

* A static side generator (converting .md to .html)
* A live server (serving rendered .md files)

## Features

* Custom layout with assets management
* Table of content using `[[toc]]`
* HTML/JS views to bypass markdown limitation for some pages

## Samples

| Example                                                                                   | Source                                                                              | Layout                                                                                 |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [Classic example](https://mborne.github.io/markdown-to-html/demo/01-default-layout)       | [samples/01-default-layout/index.md](samples/01-default-layout/index.md)            | [layout/default/page.html](layout/default/page.html)                                   |
| [RemarkJS slideshow](https://mborne.github.io/markdown-to-html/demo/02-remarkjs)          | [samples/02-remarkjs/index.md](samples/01-default-layout/index.md)                  | [layout/remarkjs/page.html](layout/default/page.html)                                  |
| [GitHub pages generated mixing both](https://mborne.github.io/cours-patron-conception/#1) | [mborne/cours-patron-conception](https://github.com/mborne/cours-patron-conception) | see [build.js](https://github.com/mborne/cours-patron-conception/blob/master/build.js) |

## Setup

```bash
git clone https://github.com/mborne/markdown-to-html
cd markdown-to-html
sudo npm install -g
```

## Usage

### Generate static website

```bash
markdown-to-html -O output sample
```

### Serve markdown file

```bash
markdown-serve --mode serve sample
```

## Options

See `bin/markdown-to-html.js --help` to configure :

* layout
* output directory


## Credits

* [marked](https://www.npmjs.com/package/marked): Markdown parser
* [marked-custom-heading-id](https://github.com/markedjs/marked-custom-heading-id) : Support for custom links.
* [handlebars](https://www.npmjs.com/package/handlebars) : template engine
* [markdown-toc](https://www.npmjs.com/package/markdown-toc) : TOC generator
* [commander](https://www.npmjs.com/package/commander) : CLI options handling
* [shelljs](https://www.npmjs.com/package/shelljs) : list files, copy directory, etc.
* [express](https://www.npmjs.com/package/express) : Server mode

It is inspired from :

* [mixu/markdown-styles](https://github.com/mixu/markdown-styles)
* [hads](https://github.com/sinedied/hads)

## Alternatives

See [jamstack.org - Site Generators](https://jamstack.org/generators/) :

* [Docsify](https://docsify.js.org/#/)
* [MkDocs](https://www.mkdocs.org/)
* [Docusaurus](https://docusaurus.io/)
* [HADS - Hey it's Another Documentation Server!](https://github.com/sinedied/hads)
* ...
