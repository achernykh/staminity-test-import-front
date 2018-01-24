import {IComponentController, IComponentOptions} from "angular";
import {Loop, LoopMode} from "../structured-assignment/structured-assignment.component";
import "./structured-group.component.scss";

class StructuredGroupCtrl implements IComponentController {

    loop: Loop;
    hiddenPos: number = 0;

    private readonly box: {top: number, height: number} = {top: 21, height: 44}; //px
    static $inject = [];

    constructor() {

    }

    $onInit(): void {

    }

    height(): string {
        return `${this.box.height * (this.loop.length - 1)}px`;
    }

    top(): string {
        return `${(this.loop.start - this.hiddenPos - 1) * this.box.height + this.box.top}px`;
    }

    changeMode() {
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
