import { IDirective, IController, IScope, IAttributes } from 'angular';
import { ImagesService } from '../../core/images.service';

export const stQuillPostImage = ['ImagesService', (imagesService: ImagesService) => ({
    require: 'ngQuillEditor',

    link (scope: IScope, element: HTMLElement[], attrs: IAttributes, ngQuillEditor: any) {
        const onEditorCreated = ngQuillEditor.onEditorCreated;

        ngQuillEditor.onEditorCreated = (options) => {
            const { editor } = options;

            editor.getModule('toolbar').addHandler('image', () => {
                new Promise((resolve, reject) => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.click();

                    input.onchange = () => {
                        const file = input.files[0];
                        debugger;
                        if (/^image\//.test(file.type)) {
                            resolve(file);
                        } else {
                            reject();
                        }
                    };
                })
                .then((picture) => imagesService.postImage(picture))
                .then((url) => {
                    const range = editor.getSelection();
                    editor.insertEmbed(range.index, 'image', url);
                }, (error) => {
                    this.message.toastError(error);
                });
            });

            if (onEditorCreated) {
                onEditorCreated.apply(ngQuillEditor, options);
            }
        };
    }
})];