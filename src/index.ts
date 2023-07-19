import { remark } from 'remark';
import html from 'remark-html';
import { remarkShakuCodeAnnotate } from 'remark-shaku-code-annotate';
import * as shiki from 'shiki';
import withShiki from '@stefanprobst/remark-shiki';

function getProcessor() {
    return shiki
        .getHighlighter({
            theme: 'github-light',
            langs: ['javascript', 'css', 'jsx', 'html', 'typescript', 'tsx'],
            paths: {
                themes: './static/shiki/themes',
                wasm: './static/shiki/dist',
                languages: './static/shiki/languages',
            },
        })
        .then((highlighter) => {
            return remark()
                .use(remarkShakuCodeAnnotate, {
                    theme: 'github-light',
                    langs: ['javascript', 'css', 'jsx', 'html', 'typescript', 'tsx'],
                    paths: {
                        themes: './static/shiki/themes',
                        wasm: './static/shiki/dist',
                        languages: './static/shiki/languages',
                    },
                })
                .use(withShiki, { highlighter })
                .use(html, { sanitize: false });
        });
}

onmessage = (e) => {
    const code = e.data;

    getProcessor().then((processor) =>
        processor.process(code).then((data) => {
            postMessage(data.toString());
        })
    );
};
