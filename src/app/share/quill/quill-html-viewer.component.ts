import {IComponentOptions, IComponentController} from 'angular';
class QuillHtmlViewerCtrl implements IComponentController {
    // bind
    data: any;
    // private
    private trustHTML: string = null;
    private readonly findHref = /<([^>]*)(\shref=\")(.+?)(\"(\s|))(.*?)>/gi;
    // inject
    static $inject = ['$sce'];
    constructor(private $sce: any) {}
    $onInit(): void {
        this.prepareData();
    }
    $onChanges (changes): void {
        this.prepareData();
    }

    private prepareData (): void {
        this.trustHTML = this.data && this.$sce.trustAsHtml(this.data.replace(this.findHref, '<$1 onclick="window.open(\'$3\',\'_system\', \'location=yes, closebuttoncaption=Done\')" $5$6>'));
    }
}

export const QuillHtmlViewerComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    controller: QuillHtmlViewerCtrl,
    template: `
    <div class="ql-snow">
        <div class="ql-editor" ng-bind-html="$ctrl.trustHTML"></div>
    </div>`
};