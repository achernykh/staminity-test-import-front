export const htmlToPlainText = () => (html: string): string => {
    return html ? String(html).replace(/<[^>]+>/gm, '') : '';
};