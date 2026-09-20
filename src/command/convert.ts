import createDebug from 'debug';
import fs from 'node:fs';
import shell from 'shelljs';

import Renderer from '../Renderer.js';
import SourceDir from '../SourceDir.js';
import Layout from '../Layout.js';
import FileType from '../FileType.js';
import renamePathToHtml from '../helpers/renamePathToHtml.js';

import type { RenderOptions } from '../types.js';

const debug = createDebug('markdown-to-html');

/**
 * Convert MD files in sourceDirPath to outputDirPath
 */
export default function convert(
    sourceDirPath: string,
    outputDirPath: string,
    layoutPath: string,
    options: RenderOptions = {}
): void {
    /* output directory */
    debug("Ensure that outputDir doesn't exists...");
    if (fs.existsSync(outputDirPath)) {
        throw new Error(outputDirPath + ' already exists!');
    }
    shell.mkdir('-p', outputDirPath);

    debug(`Create renderer ...`);
    const sourceDir = new SourceDir(sourceDirPath);
    const layout = new Layout(layoutPath);

    const markdownRenderer = new Renderer(sourceDir, layout, {
        ...options,
        // force renaming of links from .md to .html
        renameLinksToHtml: true,
    });

    debug(`List files from source directory ...`);
    const sourceFiles = sourceDir.findFiles();

    debug(`Copy assets from layout ...`);
    if (layout.hasAssets()) {
        shell.cp('-r', layout.assetsPath, outputDirPath + '/assets');
    }

    debug(`Create directories ...`);
    sourceFiles
        .filter((file) => file.type === FileType.DIRECTORY)
        .forEach((file) => {
            const outputPath = outputDirPath + '/' + file.relativePath;
            debug(`Create directory ${outputPath} ...`);
            shell.mkdir('-p', outputPath);
        });

    debug(`Copy static files ...`);
    sourceFiles
        .filter((file) => file.type === FileType.STATIC)
        .forEach((file) => {
            const outputPath = outputDirPath + '/' + file.relativePath;
            debug(`Copy ${file.absolutePath} to ${outputPath} ...`);
            shell.cp(file.absolutePath, outputPath);
        });

    debug(`Render markdown files and html views ...`);
    sourceFiles
        .filter(
            (file) =>
                file.type === FileType.MARKDOWN || file.type === FileType.PHTML
        )
        .forEach((file) => {
            const outputPath = renamePathToHtml(
                outputDirPath + '/' + file.relativePath
            );
            debug(`Render ${file.absolutePath} to ${outputPath} ...`);
            fs.writeFileSync(outputPath, markdownRenderer.render(file));
        });

    debug(`Render completed`);
}
