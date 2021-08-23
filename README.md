# markdown-to-html

Experimental markdown renderer aiming at providing :

* a static side generator (converting .md to .html)
* a live server (serving rendered .md files)

## Features

* Custom layout with assets management
* Table of content using `[[toc]]`
* HTML/JS views to bypass markdown limitation for some pages

## Samples

* Default layout with mathjax & mermaid : [layout/default/page.html](layout/default/page.html) + [sample/index.md](sample/index.md) -> https://mborne.github.io/markdown-to-html/

* HTML view : [layout/default/page.html](layout/default/page.html) + [sample/index.md](sample/demo/index.html) -> https://mborne.github.io/markdown-to-html/demo/index.html

* Custom [remarkjs layout](https://github.com/mborne/cours-patron-conception/blob/master/layout/slides/page.html) : https://github.com/mborne/cours-patron-conception -> http://mborne.github.io/cours-patron-conception/#1

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

