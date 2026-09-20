#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { program, Option } from 'commander';

import convert from '../command/convert.js';
import serve from '../command/serve.js';
import check from '../command/check.js';
import { LAYOUT_NAMES } from '../layouts.js';
import { LAYOUTS_DIR, PACKAGE_ROOT } from '../paths.js';

import type { RenderOptions } from '../types.js';
import type { CheckerOptions } from '../Checker.js';

const packageMetadata = JSON.parse(
    readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf-8')
) as { version: string };

const optionLang = new Option(
    '--language <language>',
    'Default value for HTML lang metadata if not overwritten by YAML metadata (lang)'
)
    .env('LANGUAGE')
    .default('en');

const optionLayout = new Option(
    '-l, --layout <layout>',
    'Name or path to the layout'
)
    .env('LAYOUT')
    .default('default');

/**
 * Get layout path by name (or by path for a custom layout).
 */
function getLayoutPath(layoutName: string): string {
    return LAYOUT_NAMES.includes(layoutName as (typeof LAYOUT_NAMES)[number])
        ? path.join(LAYOUTS_DIR, layoutName)
        : path.resolve(layoutName);
}

/**
 * Report an error and exit with a failure status.
 */
function fail(e: unknown): never {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
}

program.version(packageMetadata.version);

program
    .command('convert <sourceDir> <outputDir>')
    .description('generate static site from source')
    .addOption(optionLayout)
    .addOption(optionLang)
    .action(function (
        sourceDir: string,
        outputDir: string,
        options: RenderOptions & { layout: string }
    ) {
        try {
            convert(
                path.resolve(sourceDir),
                path.resolve(outputDir),
                getLayoutPath(options.layout),
                options
            );
        } catch (e) {
            fail(e);
        }
    });

program
    .command('serve <sourceDir>')
    .description('serve source directory')
    .addOption(optionLayout)
    .addOption(optionLang)
    .action(function (
        sourceDir: string,
        options: RenderOptions & { layout: string }
    ) {
        try {
            serve(
                path.resolve(sourceDir),
                getLayoutPath(options.layout),
                options
            );
        } catch (e) {
            fail(e);
        }
    });

program
    .command('check <sourceDir>')
    .description('check source directory')
    .option(
        '--check-external-links',
        'also check external links (performs HTTP requests)'
    )
    .action(async function (sourceDir: string, options: CheckerOptions) {
        try {
            await check(path.resolve(sourceDir), options);
        } catch (e) {
            fail(e);
        }
    });

if (process.argv.length <= 2) {
    program.outputHelp();
    process.exit(1);
}

program.parse(process.argv);
