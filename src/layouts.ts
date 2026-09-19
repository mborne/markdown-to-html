/**
 * Names of the layouts embedded in the package (see the layout directory).
 */
export const LAYOUT_NAMES = ['default', 'github', 'remarkjs'] as const;

export type LayoutName = (typeof LAYOUT_NAMES)[number];
