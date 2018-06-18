export const htmlToPlainText = () => (html: string): string => {
    return html ? String(html)
        .replace(/<p[^>]*>/g, '')
        .replace(/<li[^>]*>/g, '')
        .replace(/<\/p>/g, "\n")
        .replace(/<\/li>/g, "\n")
        .replace(/<[^>]+>/gm, "") : "";
};
