import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            // the CLI entry point is covered by the end-to-end usage, not by unit tests
            exclude: ['src/bin/**'],
            reporter: ['text', 'html', 'lcov', 'cobertura'],
        },
    },
});
