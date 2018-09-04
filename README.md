# markdown-to-html

## Description

Experimental markdown renderer aiming at providing :

* a static side generator (converting .md to .html)
* a live server (serving rendered .md files)

**DON'T USE IT FOR NOW!**

## Setup

```bash
git clone https://github.com/mborne/markdown-to-html
cd markdown-to-html
sudo npm install -g
```

## Usage

### Generate static side

```bash
markdown-to-html -o output sample
```

### Generate static side (TODO)

```bash
markdown-to-html --serve sample
```

## Credits

* marked: Markdown parser
* handlebars : template engine
* markdown-toc : TOC generator
* commander : CLI options handling
* shelljs : list files, copy directory, etc.

It is inspired from :

* [mixu/markdown-styles](https://github.com/mixu/markdown-styles)
* [hads](https://github.com/sinedied/hads)

