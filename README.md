# markdown-to-html

Experimental markdown renderer aiming at providing :

* a static side generator (converting .md to .html)
* a live server (serving rendered .md files)

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

