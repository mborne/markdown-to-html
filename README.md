# markdown-to-html

[![Node.js CI](https://github.com/mborne/markdown-to-html/actions/workflows/nodejs.yml/badge.svg)](https://github.com/mborne/markdown-to-html/actions/workflows/nodejs.yml) [![Coverage Status](https://coveralls.io/repos/github/mborne/markdown-to-html/badge.svg?branch=master)](https://coveralls.io/github/mborne/markdown-to-html?branch=master)

Experimental markdown renderer aiming at providing :

* a static side generator (converting .md to .html)
* a live server (serving rendered .md files)

## Features

* Custom layout with assets management
* Table of content using `[[toc]]`
* HTML/JS views to bypass markdown limitation for some pages

## Samples

| Source                                                                   | Layout                                                | Result                                                                                     |
|--------------------------------------------------------------------------|-------------------------------------------------------|--------------------------------------------------------------------------------------------|
| [samples/01-default-layout/index.md](samples/01-default-layout/index.md) | [layout/default/page.html](layout/default/page.html)  | [demo/01-default-layout](https://mborne.github.io/markdown-to-html/demo/01-default-layout) |
| [samples/02-remarkjs/index.md](samples/01-default-layout/index.md)       | [layout/remarkjs/page.html](layout/default/page.html) | [demo/02-remarkjs](https://mborne.github.io/markdown-to-html/demo/02-remarkjs)             |

## Setup

```bash
git clone https://github.com/mborne/markdown-to-html
cd markdown-to-html
sudo npm install -g
```

## Usage

### Generate static website (`--mode=convert`)

```bash
markdown-to-html -O output sample
```

### Serve markdown file (`--mode=serve`)

```bash
markdown-serve --mode serve sample
```

## Options

See `bin/markdown-to-html.js --help` to configure :

* layout
* output directory


## Credits

* [marked](https://www.npmjs.com/package/marked): Markdown parser
* [handlebars](https://www.npmjs.com/package/handlebars) : template engine
* [markdown-toc](https://www.npmjs.com/package/markdown-toc) : TOC generator
* [commander](https://www.npmjs.com/package/commander) : CLI options handling
* [shelljs](https://www.npmjs.com/package/shelljs) : list files, copy directory, etc.
* [express](https://www.npmjs.com/package/express) : Server mode

It is inspired from :

* [mixu/markdown-styles](https://github.com/mixu/markdown-styles)
* [hads](https://github.com/sinedied/hads)

## See also

* [dosify](https://docsify.js.org/#/)
* [MkDocs](https://www.mkdocs.org/)
* [HADS - Hey it's Another Documentation Server!](https://github.com/sinedied/hads)
* ...
