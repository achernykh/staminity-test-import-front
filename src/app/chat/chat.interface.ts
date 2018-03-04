export enum ChatFormView {
    Wide,
    Slim
};

export enum ChatState {
    List,
    Room
};

export interface ChatOptions {
    view: ChatFormView,
    hideBackButton: boolean
};



