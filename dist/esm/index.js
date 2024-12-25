var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/logger.ts
import winston from "winston";
var LOG_LEVEL = process.env.LOG_LEVEL || "info";
var logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === "test" ? true : false
    })
  ]
});

// src/Checker.ts
import fs from "fs";
import url3 from "url";
import path3 from "path";

// src/markdown/render.ts
import fm from "front-matter";

// src/markdown/marked.ts
import { marked } from "marked";

// src/helpers/slugger.ts
import Slugger from "github-slugger";
var slugger = new Slugger();

// src/markdown/renderer/heading.ts
import { Parser } from "marked";
var headingIdRegex = /(?: +|^)\{#([a-z][\w-]*)\}(?: +|$)/i;
var headingParser = new Parser();
function getHeadingPartsFromLink({ text, href }) {
  return {
    id: href.startsWith("#") ? href.slice(1) : slugger.slug(text),
    title: text
  };
}
function getHeadingParts({ text, tokens, depth }) {
  if (tokens[0].type == "link") {
    return getHeadingPartsFromLink(tokens[0]);
  }
  const hasId = text.match(headingIdRegex);
  if (!hasId) {
    return {
      id: slugger.slug(text),
      title: text
    };
  }
  const textWithoutId = text.replace(headingIdRegex, "");
  return {
    id: hasId[1],
    title: textWithoutId
  };
}
function heading(token) {
  const depth = token.depth;
  const parts = getHeadingParts(token);
  return `<h${depth} id="${parts.id}">${parts.title}</h${depth}>`;
}

// src/markdown/toc.ts
function toc(markdownContent) {
  const lexer = new marked_default.Lexer();
  let tokens = lexer.lex(markdownContent);
  let headingTokens = tokens.filter(
    (token) => token.type == "heading" && token.depth != 1
  );
  slugger.reset();
  return headingTokens.map((headingToken) => {
    let parts = getHeadingParts(headingToken);
    let spaces = "";
    if (headingToken.depth > 2) {
      spaces = Array(2 * (headingToken.depth - 2)).fill("  ").join("");
    }
    return `${spaces}* [${parts.title}](#${parts.id})`;
  }).join("\n");
}

// src/markdown/renderer/link.ts
import url from "url";
function link({ href, title: title2, text }) {
  const parsed = url.parse(href);
  let target = null;
  if (parsed.protocol != null) {
    target = "_blank";
  }
  let out = '<a href="' + href + '"';
  if (title2) {
    out += ' title="' + title2 + '"';
  }
  if (target) {
    out += ' target="' + target + '"';
  }
  out += ">" + text + "</a>";
  return out;
}

// src/markdown/marked.ts
function preprocess(markdownContent) {
  markdownContent = markdownContent.replace("[[toc]]", toc(markdownContent));
  slugger.reset();
  return markdownContent;
}
marked.use({ hooks: { preprocess } });
var renderer = {
  heading,
  link
};
marked.use({ renderer });
var marked_default = marked;

// src/markdown/title.ts
function title(markdownContent) {
  const lexer = new marked_default.Lexer();
  let tokens = lexer.lex(markdownContent);
  for (const token of tokens) {
    if (token.type !== "heading") {
      continue;
    }
    if (token.depth == 1) {
      return token.text;
    }
  }
  return null;
}

// src/helpers/rewriteLinksToHtml.ts
import url2 from "url";
import path from "path";

// src/helpers/renamePathToHtml.ts
function renamePathToHtml(path8) {
  if (path8.endsWith(".md")) {
    return path8.slice(0, -3) + ".html";
  } else if (path8.endsWith(".phtml")) {
    return path8.slice(0, -6) + ".html";
  } else {
    return path8;
  }
}

// src/helpers/rewriteLinksToHtml.ts
function rewriteLinksToHtml(text) {
  return text.replace(/\[([^\[\]]*)\]\((.*?)\)/gm, function(link2) {
    let parts = link2.match(/\[([^\[\]]*)\]\((.*?)\)/);
    let title2 = parts[1];
    let href = parts[2];
    const parsed = url2.parse(href);
    if (!parsed.protocol) {
      const ext = path.extname(parsed.pathname || "");
      if (ext === ".md" || ext === ".phtml") {
        parsed.pathname = renamePathToHtml(parsed.pathname);
        href = url2.format(parsed);
      }
    }
    return `[${title2}](${href})`;
  });
}

// src/markdown/render.ts
function render(markdownContent, options) {
  const renameLinksToHtml = (options == null ? void 0 : options.renameLinksToHtml) || false;
  const metadata = /* @__PURE__ */ new Map();
  const markdownTitle = title(markdownContent);
  if (markdownTitle) {
    metadata["title"] = markdownTitle;
  }
  const { attributes, body } = fm(markdownContent);
  markdownContent = body;
  for (const key in attributes) {
    metadata[key] = attributes[key];
  }
  if (renameLinksToHtml) {
    markdownContent = rewriteLinksToHtml(markdownContent);
  }
  return {
    markdownContent,
    htmlContent: marked_default.parse(markdownContent),
    metadata
  };
}

// src/SourceFile.ts
import { lstatSync, readFileSync } from "fs";
import path2 from "path";
var FileType = /* @__PURE__ */ ((FileType2) => {
  FileType2["DIRECTORY"] = "directory";
  FileType2["MARKDOWN"] = "md";
  FileType2["PHTML"] = "phtml";
  FileType2["STATIC"] = "static";
  return FileType2;
})(FileType || {});
var SourceFile = class {
  /**
   * @param {SourceDir} sourceDir the source directory
   * @param {string} absolutePath the absolute path of the file
   */
  constructor(sourceDir, absolutePath) {
    this.sourceDir = sourceDir;
    this.absolutePath = absolutePath;
    /**
     * The type of the file
     */
    __publicField(this, "type");
    /**
     * The path of the file relative to the root directory
     */
    __publicField(this, "relativePath");
    this.type = "static" /* STATIC */;
    if (lstatSync(this.absolutePath).isDirectory()) {
      this.type = "directory" /* DIRECTORY */;
    } else if (this.absolutePath.match(/\.md$/)) {
      this.type = "md" /* MARKDOWN */;
    } else if (this.absolutePath.match(/\.phtml$/)) {
      this.type = "phtml" /* PHTML */;
    }
    this.relativePath = path2.relative(this.sourceDir.rootDir, this.absolutePath);
  }
  /**
   * Get content for the given file.
   */
  getContentRaw() {
    return readFileSync(this.absolutePath, "utf-8");
  }
};

// src/html/getMetadata.ts
import * as cheerio from "cheerio";
function getMetadata(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const metadata = {
    title: null,
    links: []
  };
  const h1s = $("h1").map((_, element) => {
    return $(element).html();
  });
  if (h1s.length > 0) {
    metadata.title = h1s[0];
  }
  $("a").each(function(i, element) {
    metadata.links.push({
      type: "a",
      targetUrl: $(element).attr("href")
    });
  });
  $("img").each(function(i, element) {
    metadata.links.push({
      type: "img",
      targetUrl: $(element).attr("src")
    });
  });
  return metadata;
}

// src/helpers/checkUrlExists.ts
import axios from "axios";
import http from "http";
import https from "https";
async function checkUrlExists(url6) {
  logger.info(`checkUrlExists('${url6}')...`);
  try {
    let response = await axios.get(url6, {
      responseType: "stream",
      timeout: 1e3,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false })
    });
    logger.info(`checkUrlExists('${url6}') : SUCCESS (${response.status})`);
    return true;
  } catch (error) {
    logger.info(`checkUrlExists('${url6}') : FAILURE (${error.message})`);
    return false;
  }
}

// src/Checker.ts
var ErrorLevel = /* @__PURE__ */ ((ErrorLevel2) => {
  ErrorLevel2["INFO"] = "INFO";
  ErrorLevel2["WARNING"] = "WARNING";
  ErrorLevel2["ERROR"] = "ERROR";
  return ErrorLevel2;
})(ErrorLevel || {});
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2["DEAD_LINK"] = "DEAD_LINK";
  return ErrorCode2;
})(ErrorCode || {});
var Checker = class {
  /**
   * @param {object} options
   * @param {boolean} options.checkExternalLinks
   */
  constructor(options) {
    __publicField(this, "checkExternalLinks");
    this.checkExternalLinks = options.checkExternalLinks || false;
  }
  /**
   * Check all files in a source directory
   */
  async checkSourceDir(sourceDir) {
    logger.info(`checkSourceDir('${sourceDir.rootDir}') ...`);
    let errors = [];
    const sourceFiles = sourceDir.findFiles();
    logger.info(`checkSourceDir(${sourceDir.rootDir}) : found ${sourceFiles.length} file(s)...`);
    for (const sourceFile of sourceFiles) {
      const newErrors = await this.checkSourceFile(sourceFile);
      errors = [...errors, ...newErrors];
    }
    return errors;
  }
  /**
   * Check a source file
   */
  async checkSourceFile(sourceFile) {
    logger.info(`checkSourceFile('${sourceFile.relativePath}') ...`);
    const errors = [];
    if (["directory" /* DIRECTORY */, "static" /* STATIC */].includes(sourceFile.type)) {
      logger.info(`checkSourceFile('${sourceFile.relativePath}') : SKIPPED (type=${sourceFile.type})`);
      return errors;
    }
    let htmlContent = sourceFile.getContentRaw();
    if ("md" /* MARKDOWN */ === sourceFile.type) {
      const result = render(htmlContent);
      htmlContent = result.htmlContent;
    }
    const { links } = getMetadata(htmlContent);
    if (links.length == 0) {
      logger.info(`checkSourceFile('${sourceFile.relativePath}') : SKIPPED (no links found)`);
      return errors;
    }
    logger.info(`checkSourceFile('${sourceFile.relativePath}') : ${links.length} link(s) found...`);
    for (const link2 of links) {
      let error = await this.checkLink(sourceFile, link2);
      if (error != null) {
        errors.push(error);
      }
    }
    return errors;
  }
  /**
   * Check links from sourceFile
   *
   * @param {SourceFile} sourceFile
   * @param {object} link
   * @return {Promise<object|null>}
   */
  async checkLink(sourceFile, link2) {
    const targetUrl = link2.targetUrl;
    logger.info(`checkLink('${sourceFile.relativePath}','${targetUrl}') ...`);
    if (targetUrl.startsWith("#")) {
      logger.info(`checkLink('${sourceFile.relativePath}','${targetUrl}') : SKIPPED (anchor link)`);
      return null;
    }
    const parsed = url3.parse(targetUrl);
    if (parsed.protocol !== null) {
      return this.checkExternalLink(sourceFile, targetUrl);
    }
    return this.checkInternalLink(sourceFile, targetUrl);
  }
  /**
   * Check targetUrl performing a GET request.
   */
  async checkExternalLink(sourceFile, targetUrl) {
    logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') ...`);
    if (!this.checkExternalLinks) {
      logger.info(
        `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SKIPPED (check external links disabled)`
      );
      return null;
    }
    const found = await checkUrlExists(targetUrl);
    if (found) {
      logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SUCCESS (found)`);
      return null;
    }
    logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : FAILURE (not found)`);
    return {
      level: "ERROR" /* ERROR */,
      code: "DEAD_LINK" /* DEAD_LINK */,
      message: `${sourceFile.relativePath} -> '${targetUrl}' : FAILURE (not found)`
    };
  }
  /**
   * Check internal link ensuring the target file exists.
   */
  checkInternalLink(sourceFile, targetUrl) {
    logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') ...`);
    const absoluteTargetPath = path3.resolve(path3.dirname(sourceFile.absolutePath), targetUrl);
    const found = fs.existsSync(absoluteTargetPath);
    const expectedPath = sourceFile.sourceDir.getRelativePath(absoluteTargetPath);
    if (found) {
      logger.info(
        `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SUCCESS ('${expectedPath}' found)`
      );
      return null;
    } else {
      logger.info(
        `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : FAILURE ('${expectedPath}' not found)`
      );
      return {
        level: "ERROR" /* ERROR */,
        code: "DEAD_LINK" /* DEAD_LINK */,
        message: `${sourceFile.relativePath} -> '${targetUrl}' : FAILURE ('${expectedPath}' not found)`
      };
    }
  }
};

// src/Layout.ts
import fs2 from "fs";
import handlebars3 from "handlebars";

// src/handlebars/asset.ts
import path4 from "path";
import handlebars from "handlebars";
function asset(context, options) {
  const parentDir = path4.resolve(options.data.root.path, "..");
  const relativePath = path4.relative(parentDir, options.data.root.rootDir + "/assets");
  let output = "";
  output += relativePath + "/";
  context = context.replace(/^\//, "");
  output += context;
  return new handlebars.SafeString(output);
}

// src/handlebars/url.ts
import path5 from "path";
import handlebars2 from "handlebars";
function url4(context, options) {
  const parentDir = path5.resolve(options.data.root.path, "..");
  const targetPath = path5.resolve(options.data.root.rootDir, context.replace(/^\//, ""));
  const relativeTargetPath = path5.relative(parentDir, targetPath);
  const relativeUrl = relativeTargetPath.endsWith("..") ? relativeTargetPath + "/" : relativeTargetPath;
  return new handlebars2.SafeString(relativeUrl);
}

// src/Layout.ts
handlebars3.registerHelper("asset", asset);
handlebars3.registerHelper("url", url4);
var Layout = class {
  /**
   * @param {string} layoutPath path to the directory containing page.html
   */
  constructor(layoutPath) {
    /**
     * @property {string} layoutPath path to the directory containing page.html
     */
    __publicField(this, "layoutPath");
    /**
     * @property {string} templatePath path to the page.html template file
     */
    __publicField(this, "templatePath");
    /**
     * @property {string} assetsPath path to the assets directory
     */
    __publicField(this, "assetsPath");
    this.layoutPath = layoutPath;
    if (!fs2.existsSync(this.layoutPath)) {
      throw new Error(`${this.layoutPath} doesn't exists`);
    }
    this.templatePath = this.layoutPath + "/page.html";
    if (!fs2.existsSync(this.templatePath)) {
      throw new Error(`${this.templatePath} doesn't exists`);
    }
    this.assetsPath = this.layoutPath + "/assets";
  }
  /**
   * @returns the path of the layout directory.
   */
  getPath() {
    return this.layoutPath;
  }
  /**
   * Check if the assets directory exists.
   */
  hasAssets() {
    return fs2.existsSync(this.assetsPath);
  }
  /**
   * Get handlebar's template.
   */
  getTemplate() {
    const templateSource = fs2.readFileSync(this.layoutPath + "/page.html", "utf8");
    return handlebars3.compile(templateSource);
  }
};

// src/Renderer.ts
import path6 from "path";
var Renderer = class {
  /**
   * @param {SourceDir} sourceDir
   * @param {Layout} layout
   *
   * @param {Object} options
   * @param {boolean} [options.renameLinksToHtml=false] convert .md or .phtml links to .html
   * @param {string} [options.language='en'] language for HTML pages defaulted to "en"
   */
  constructor(sourceDir, layout, options = {}) {
    __publicField(this, "sourceDir");
    __publicField(this, "layout");
    __publicField(this, "renameLinksToHtml");
    __publicField(this, "language");
    __publicField(this, "template");
    var _a, _b;
    this.sourceDir = sourceDir;
    this.layout = layout;
    this.renameLinksToHtml = (_a = options.renameLinksToHtml) != null ? _a : false;
    this.language = (_b = options.language) != null ? _b : "en";
    this.template = this.layout.getTemplate();
  }
  /**
   * Render a source file into a string. Supported file types are Markdown and HTML views.
   * @param {SourceFile} sourceFile - The source file to render.
   */
  render(sourceFile) {
    logger.info(`[Renderer] render('${sourceFile.relativePath}')...`);
    if (!["md" /* MARKDOWN */, "phtml" /* PHTML */].includes(sourceFile.type)) {
      throw new Error(`Unsupported file type: ${sourceFile.type}`);
    }
    const context = {
      // handlebars helpers requirements
      rootDir: this.sourceDir.rootDir,
      path: sourceFile.absolutePath,
      // in order to allow to produce edit link in custom template
      relativePath: sourceFile.relativePath.replaceAll("\\", "/"),
      // common HTML metadata
      title: path6.relative(this.sourceDir.rootDir, sourceFile.absolutePath),
      lang: this.language,
      // rendered content will be written to this field
      content: null,
      // markdown content will be saved into this field (for RemarkJS)
      markdownContent: null
    };
    if ("md" /* MARKDOWN */ == sourceFile.type) {
      const result = render(sourceFile.getContentRaw(), {
        renameLinksToHtml: this.renameLinksToHtml
      });
      context.content = result.htmlContent;
      context.markdownContent = result.markdownContent;
      for (const key in result.metadata) {
        context[key] = result.metadata[key];
      }
    } else {
      if (sourceFile.type == "phtml" /* PHTML */) {
        const { title: title2 } = getMetadata(sourceFile.getContentRaw());
        if (title2) {
          context.title = title2;
        }
      }
      context.content = sourceFile.getContentRaw();
    }
    return this.template(context);
  }
};

// src/SourceDir.ts
import assert from "assert";
import fs3, { readdirSync } from "fs";
import path7 from "path";

// src/SourceDirFilter.ts
var SourceDirFilter = class {
  constructor() {
    /**
     * Regexps that match the ignored files.
     */
    __publicField(this, "ignoredList");
    this.ignoredList = [/^\.git$/, /^node_modules$/];
  }
  /**
   * Test if a file is ignored
   *
   * @param {string} relativePath
   *
   * @returns {boolean}
   */
  isIgnored(relativePath) {
    const parts = relativePath.split("/");
    for (const part of parts) {
      for (const ignoredRegex of this.ignoredList) {
        if (part.match(ignoredRegex)) {
          return true;
        }
      }
    }
    return false;
  }
};

// src/SourceDir.ts
var SourceDir = class {
  constructor(rootDir) {
    /**
     * The directory containing sources
     */
    __publicField(this, "rootDir");
    /**
     * Filter files
     */
    __publicField(this, "filter");
    if (!fs3.existsSync(rootDir)) {
      throw new Error("Input file " + rootDir + " not found");
    }
    if (!fs3.lstatSync(rootDir).isDirectory()) {
      throw new Error("Input file " + rootDir + " is not a directory");
    }
    this.rootDir = path7.resolve(rootDir);
    this.filter = new SourceDirFilter();
  }
  /**
   * Get relative path for a given file.
   */
  getRelativePath(absolutePath) {
    return path7.relative(this.rootDir, absolutePath);
  }
  /**
   * Find files in root directory
   */
  findFiles() {
    const sourceFiles = [];
    const relativePaths = readdirSync(this.rootDir, {
      recursive: true
    });
    for (const relativePath of relativePaths) {
      if (this.filter.isIgnored(relativePath)) {
        continue;
      }
      const absolutePath = path7.resolve(this.rootDir, relativePath);
      sourceFiles.push(new SourceFile(this, absolutePath));
    }
    return sourceFiles;
  }
  /**
   * Locate file in rootDir according to relativePath
   */
  locateFile(relativePath) {
    const absolutePath = path7.resolve(this.rootDir, relativePath);
    if (!fs3.existsSync(absolutePath)) {
      if (relativePath.endsWith(".html")) {
        return this.locateRenderedFile(relativePath);
      } else {
        return null;
      }
    }
    if (!absolutePath.startsWith(this.rootDir)) {
      return null;
    }
    return new SourceFile(this, absolutePath);
  }
  /**
   * Locate file rendered to html in order to find .md or .phtml files
   * using .html in URLs.
   *
   * @private
   */
  locateRenderedFile(relativePath) {
    assert(relativePath.endsWith(".html"), `${relativePath} is not a .html path!`);
    for (const ext of [".md", ".phtml"]) {
      let candidatePath = relativePath.slice(0, -5) + ext;
      let sourceFile = this.locateFile(candidatePath);
      if (sourceFile != null) {
        return sourceFile;
      }
    }
    return null;
  }
  /**
   * Locate index files
   * @param {SourceFile} sourceFile a directory
   * @return {SourceFile}
   */
  locateIndex(sourceFile) {
    let candidates = ["index.md", "index.phtml", "index.html", "README.md", "readme.md"];
    for (let candidate of candidates) {
      const candidatePath = path7.resolve(sourceFile.absolutePath, candidate);
      if (!fs3.existsSync(candidatePath)) {
        continue;
      }
      return new SourceFile(this, candidatePath);
    }
    return null;
  }
};

// src/command/check.ts
async function check(sourceDirPath, options) {
  logger.info(`check('${sourceDirPath}',${JSON.stringify(options)}...)`);
  const sourceDir = new SourceDir(sourceDirPath);
  const checker = new Checker(options);
  const errors = await checker.checkSourceDir(sourceDir);
  if (errors.length != 0) {
    const details = errors.map((error, index) => {
      return `- ${index + 1}) ${error.message}`;
    }).join("\r\n");
    throw new Error(`Found ${errors.length} dead link(s) : \r
${details}`);
  } else {
    logger.info("SUCCESS : No dead link found");
  }
}

// src/command/convert.ts
import shell from "shelljs";
import fs4, { mkdirSync } from "fs";
function convert(sourceDirPath, outputDirPath, layoutPath, options) {
  logger.info("Check if outputDir exists...");
  if (fs4.existsSync(outputDirPath)) {
    if (options.force) {
      logger.info("Cleanup existing outputDir (--force)");
      shell.rm("-rf", `${outputDirPath}/*`);
    } else {
      throw new Error(outputDirPath + " already exists!");
    }
  }
  mkdirSync(outputDirPath, { recursive: true });
  shell.mkdir("-p", outputDirPath);
  const sourceDir = new SourceDir(sourceDirPath);
  const layout = new Layout(layoutPath);
  const rendererOptions = options;
  rendererOptions.renameLinksToHtml = true;
  const markdownRenderer = new Renderer(sourceDir, layout, rendererOptions);
  logger.info(`List files from source directory ...`);
  const sourceFiles = sourceDir.findFiles();
  logger.info(`Copy assets from layout ...`);
  if (layout.hasAssets()) {
    const assertsDir = outputDirPath + "/assets";
    shell.cp("-r", layoutPath + "/assets", assertsDir);
  }
  logger.info(`Create directories ...`);
  sourceFiles.filter(function(file) {
    return file.type === "directory" /* DIRECTORY */;
  }).forEach(function(file) {
    const outputPath = outputDirPath + "/" + file.relativePath;
    logger.info(`Create directory ${outputPath} ...`);
    shell.mkdir("-p", outputPath);
  });
  logger.info(`Copy static files ...`);
  sourceFiles.filter(function(file) {
    return file.type === "static" /* STATIC */;
  }).forEach(function(file) {
    const outputPath = outputDirPath + "/" + file.relativePath;
    logger.info(`Copy ${file.absolutePath} to ${outputPath} ...`);
    shell.cp(file.absolutePath, outputPath);
  });
  logger.info(`Render markdown files and html views ...`);
  sourceFiles.filter(function(file) {
    return file.type === "md" /* MARKDOWN */ || file.type === "phtml" /* PHTML */;
  }).forEach(function(file) {
    let outputPath = outputDirPath + "/" + file.relativePath;
    outputPath = renamePathToHtml(outputPath);
    logger.info(`Render ${file.absolutePath} to ${outputPath} ...`);
    const html = markdownRenderer.render(file);
    fs4.writeFileSync(outputPath, html);
  });
  logger.info(`Render completed`);
}

// src/server/expressApp.ts
import express from "express";
import morgan from "morgan";
import url5 from "url";
var morganMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms", {
  stream: {
    // Configure Morgan to use our custom logger with the http severity
    write: (message) => logger.info(message.trim())
  }
});
function expressApp(sourceDirPath, layoutPath, options) {
  const app = express();
  app.use(morganMiddleware);
  const sourceDir = new SourceDir(sourceDirPath);
  const layout = new Layout(layoutPath);
  options = options || {};
  options.renameLinksToHtml = false;
  const renderer2 = new Renderer(sourceDir, layout, options);
  if (layout.hasAssets()) {
    app.use("/assets", express.static(layout.getPath() + "/assets"));
  }
  app.get(/^\/(.*)/, function(req, res) {
    let relativePath = req.params[0];
    let sourceFile = sourceDir.locateFile(relativePath);
    if (sourceFile == null) {
      res.status(404).send("Not found");
      return;
    }
    if (sourceFile.type == "directory" /* DIRECTORY */) {
      if (relativePath != "" && relativePath != "/") {
        let parsed = url5.parse(relativePath);
        if (!parsed.path.endsWith("/")) {
          res.redirect(parsed.path + "/");
          return;
        }
      }
      let indexFile = sourceDir.locateIndex(sourceFile);
      if (indexFile == null) {
        res.status(404).send("Not found");
        return;
      }
      sourceFile = indexFile;
    }
    if (["md" /* MARKDOWN */, "phtml" /* PHTML */].includes(sourceFile.type)) {
      res.send(renderer2.render(sourceFile));
    } else {
      res.sendFile(sourceFile.absolutePath);
    }
  });
  return app;
}

// src/command/serve.ts
function serve(sourceDirPath, layoutPath, options) {
  const app = expressApp(sourceDirPath, layoutPath, options);
  const server = app.listen(3e3, function() {
    logger.info("Application started on http://localhost:3000");
  });
  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      logger.info("HTTP server closed");
    });
  });
}
export {
  Checker,
  ErrorCode,
  ErrorLevel,
  FileType,
  Layout,
  Renderer,
  SourceDir,
  SourceDirFilter,
  SourceFile,
  check,
  convert,
  render,
  serve
};
