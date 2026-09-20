/**
 * Type of a file in a SourceDir.
 */
export const FileType = Object.freeze({
    DIRECTORY: 'directory',
    MARKDOWN: 'md',
    PHTML: 'phtml',
    STATIC: 'static',
} as const);

export type FileType = (typeof FileType)[keyof typeof FileType];

export default FileType;
