// Геретор строки со случайным набором цифр/латинских букв
export const genHash = (length: number = 4): string => Math.random().toString(36).substr(2, length);
