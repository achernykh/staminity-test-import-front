export interface IQuillConfig {
    toolbar: Object;
    toolbarFull: Object;
}

// https://github.com/KillerCodeMonkey/ng-quill
export const quillConfig: IQuillConfig = {

    toolbar: {
        toolbar: [
            //[{ header: [3, 4, false] }],
            [ "bold", "italic", { "color": [] }, { "background": [] } ],
            [ { "list": "ordered" }, { "list": "bullet" } ],
            [ "link", "image", "video" ],
        ],
    },

    toolbarFull: { // https://github.com/KillerCodeMonkey/ng-quill
        toolbar: [
            [ { header: [ 3, 4, false ] } ],
            [ "bold", "italic", "underline", "strike" ],
            [ { "list": "ordered" }, { "list": "bullet" } ],
            [ { "color": [] }, { "background": [] } ],
            [ "link", "image", "video" ],
        ],
    },

};
