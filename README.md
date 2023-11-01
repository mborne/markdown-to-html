# markdown-to-html

[![Node.js CI](https://github.com/mborne/markdown-to-html/actions/workflows/nodejs.yml/badge.svg)](https://github.com/mborne/markdown-to-html/actions/workflows/nodejs.yml) [![Coverage Status](https://coveralls.io/repos/github/mborne/markdown-to-html/badge.svg?branch=master)](https://coveralls.io/github/mborne/markdown-to-html?branch=master)

Markdown renderer aiming at providing :

* A static site generator (converting .md to .html)
* A live server (serving rendered .md files)

## Features

* Markdown files are rendered using the powerfull **[Marked](https://github.com/markedjs/marked#marked)** library.
* [Marked](https://github.com/markedjs/marked#marked) is extended with :
  * **Table of content generation** in markdown files (`[[toc]]` from [pandoc](https://pandoc.org/))
  * The support of custom heading links (`# This is the title {#custom-id}`)
  * The hability to rename `.md` to `.html` for relative links for static site generation.
* A **basic layout system** based on [handlebars](https://www.npmjs.com/package/handlebars) with some built-in layouts :
  * **default** to generate classic pages.
  * **remarkjs** to generate slideshows.
* [front-matter](https://www.npmjs.com/package/front-matter#front-matter) allows to **use YAML metadata** to :
  * Overwrite page title (default is file path)
  * Overwrite page lang (default is `"en"`)
* Partial HTML/JS views can be injected in the **layout** to bypass markdown limitation for some pages.


## Usage

### Install

```bash
npm install -g @mborne/markdown-to-html
# check version
markdown-to-html --version
# show help
markdown-to-html --help
# markdown-to-html [serve|convert|check] --help
```

### Generate static website

```bash
markdown-to-html convert samples/01-default-layout /tmp/output
```

### Serve markdown file

```bash
# with the default layout
markdown-to-html serve samples/01-default-layout
# with a custom layout
markdown-to-html serve samples/02-remarkjs --layout remarkjs
```

### Check markdown files

To check links between markdown files :

```bash
markdown-to-html check samples/01-default-layout
# to include HTTP test for remote URLs
markdown-to-html check samples/01-default-layout --check-external-links
```

## Credits

* [marked](https://www.npmjs.com/package/marked) provides the markdown parser.
* [handlebars](https://www.npmjs.com/package/handlebars) provides the template engine.
* [commander](https://www.npmjs.com/package/commander) allows CLI options handling.
* [shelljs](https://www.npmjs.com/package/shelljs) allows to list files, copy directory, etc.
* [front-matter](https://www.npmjs.com/package/front-matter#front-matter) allows YAML metadata parsing
* [marked-custom-heading-id](https://github.com/markedjs/marked-custom-heading-id) provided the solution to support custom heading id.
* [express](https://www.npmjs.com/package/express) provides the server mode.

It is inspired from :

* [mixu/markdown-styles](https://github.com/mixu/markdown-styles)
* [hads](https://github.com/sinedied/hads)


## Samples

| Example                                                                                   | Source                                                                              | Layout                                                                                 |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [Classic example](https://mborne.github.io/markdown-to-html/demo/01-default-layout)       | [samples/01-default-layout/index.md](samples/01-default-layout/index.md)            | [layout/default/page.html](layout/default/page.html)                                   |
| [RemarkJS slideshow](https://mborne.github.io/markdown-to-html/demo/02-remarkjs)          | [samples/02-remarkjs/index.md](samples/01-default-layout/index.md)                  | [layout/remarkjs/page.html](layout/default/page.html)                                  |
| [GitHub pages generated mixing both](https://mborne.github.io/cours-patron-conception/#1) | [mborne/cours-patron-conception](https://github.com/mborne/cours-patron-conception) | see [build.js](https://github.com/mborne/cours-patron-conception/blob/master/build.js) |


## License

[MIT](LICENSE)

## Alternatives

See [jamstack.org - Site Generators](https://jamstack.org/generators/) :

* [Jellyll](https://jekyllrb.com/)
* [MkDocs](https://www.mkdocs.org/), [Material for MkDocs](https://github.com/squidfunk/mkdocs-material#readme),...
* [Docsify](https://docsify.js.org/#/)
* [Docusaurus](https://docusaurus.io/)
* [HADS - Hey it's Another Documentation Server!](https://github.com/sinedied/hads)
* ...

## Docs

* [DEV - Debug with Visual Studio Code](docs/vscode.md)
