export const htmlToPlainText = () => (html: string): string => {
    return html ? String(html)
        .replace(/<p[^>]*>/g, '')
        .replace(/<\/p>/g, "\n")
        .replace(/<[^>]+>/gm, "") : "";
};
