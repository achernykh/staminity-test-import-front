import {IComponentController, IComponentOptions} from "angular";
import {Loop, LoopMode} from "../structured-assignment/structured-assignment.component";
import "./structured-group.component.scss";

class StructuredGroupCtrl implements IComponentController {

    public loop: Loop;
    public hiddenPos: number = 0;

    private readonly box: {top: number, height: number} = {top: 21, height: 44}; //px
    public static $inject = [];

    constructor() {

    }

    public $onInit(): void {

    }

    public height(): number {
        return this.box.height * (this.loop.length - 1);
    }

    public top(): number {
        return (this.loop.start - this.hiddenPos - 1) * this.box.height + this.box.top;
    }

    public changeMode() {
        this.loop.mode === LoopMode.Group ? this.loop.mode = LoopMode.Input : this.loop.mode = LoopMode.Group;
    }
}

export const StructuredGroupComponent: IComponentOptions = {
    bindings: {
        loop: "<",
        hiddenPos: "<",
        onInput: "&",
    },
    require: {
        item: "^calendarItemActivity",
    },
    controller: StructuredGroupCtrl,
    template: require("./structured-group.component.html") as string,

};
