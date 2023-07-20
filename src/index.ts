import { remark } from 'remark';
import { remarkShakuCodeAnnotate } from 'remark-shaku-code-annotate';

const processor = remark().use(remarkShakuCodeAnnotate, {
    theme: 'github-light',
    langs: ['javascript', 'css', 'jsx', 'html', 'typescript', 'tsx'],
    paths: {
        themes: './static/shiki/themes',
        wasm: './static/shiki/dist',
        languages: './static/shiki/languages',
    },
});

onmessage = (e) => {
    const code = e.data;

    processor.process(code).then((data) => {
        postMessage(data.toString());
    });
};
