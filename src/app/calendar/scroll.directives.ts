import { IDirective, IController, IScope, IAttributes } from 'angular';
import * as Rx from "rxjs/Rx";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/interval';

/* 
*   Находит элемент в видимиом положении скроллинга
*/
const findChildInViewport = (element: HTMLElement) : HTMLElement => {
    const { scrollTop, scrollHeight } = element;
    return (Array.from(element.children) as HTMLElement[])
    .find(({ offsetTop, offsetHeight }) => offsetTop >= scrollTop);
};

/* 
*   зацикленный requestAnimationFrame
*/
const loop = (f: Function) => {
    let stop = false;

    const frame = () => {
        if (!stop) {
            f();
            requestAnimationFrame(frame);
        }
    };

    frame();

    return () => { stop = true; };
};

const isChrome = () : boolean => !!window['chrome'];

interface IScrollState {
    scrollTop: number;
    scrollHeight: number;
    offsetHeight: number;
};

/* 
*   scrollings - события скроллинга
*   frames - поток частых регулярных событий
*/
class ScrollController {
    // бинд для директивы
    element: HTMLElement;

    scrollings = new Rx.Subject();
    frames = new Rx.Subject();

    getScrollState = () : IScrollState => { 
        const { scrollTop, scrollHeight, offsetHeight } = this.element;
        return { scrollTop, scrollHeight, offsetHeight };
    }
}

/* 
* Создаёт контроллер скроллинга, применяется к контейнеру.
*/
export const scrollContainer = () : IDirective => ({
    require: 'scrollContainer',

    controller: ScrollController,

    link (scope: IScope, element: HTMLElement[], attrs: IAttributes, scrollContainer: ScrollController) {
        scrollContainer.element = element[0];

        const scroll = Rx.Observable.fromEvent(element[0], 'scroll')
        .subscribe(scrollContainer.scrollings);

        const unsubscribe = {
            frames: loop(() => scrollContainer.frames.next()),
            scroll: () => scroll.unsubscribe()
        };

        scope.$on('$destroy', () => {
            for (const key in unsubscribe) {
                unsubscribe[key] ();
            }
        });
    }
});

/* 
* Обрабатывает скролл до упора вверх
*/
export const onScrollHitTop = () : IDirective  => ({
    require: '^scrollContainer',

    link (scope: IScope, element: HTMLElement[], attrs: IAttributes, scrollContainer: ScrollController) {
        scrollContainer.frames
        .throttleTime(200)
        .map(() => scrollContainer.getScrollState())
        .filter(({ scrollTop }) => scrollTop === 0)
        .subscribe(() => { 
            scope.$applyAsync(attrs['onScrollHitTop']);
        });
    }
});

/* 
* Обрабатывает скролл до упора вниз
*/
export const onScrollHitBottom = () : IDirective => ({
    require: '^scrollContainer',

    link (scope: IScope, element: HTMLElement[], attrs: IAttributes, scrollContainer: ScrollController) {
        let bottomPad = element[0].querySelector('.scroll__bottom-pad') as HTMLElement;
        scrollContainer.frames
        .map(() => scrollContainer.getScrollState())
        .filter(({ scrollTop, scrollHeight, offsetHeight }) => bottomPad.offsetTop - scrollTop <= offsetHeight)
        .subscribe(() => { 
            scope.$applyAsync(attrs['onScrollHitBottom']);
        });
    }
});

/*
* Пытается устранять прыжки видимого положения скроллинга, происходящие из-за изменения контента
*/
export const scrollKeepPosition = () : IDirective => ({
    require: 'scrollContainer',

    link (scope: IScope, element: HTMLElement[], attrs: IAttributes, scrollContainer: ScrollController) {
        let snapshot;

        const frame = () => {
            if (snapshot) {
                const offset = snapshot.child.offsetTop;

                if (offset !== snapshot.offset) {
                    if (isChrome() ? element[0].scrollTop === snapshot.scroll : true) {
                        const shift = offset - snapshot.offset;
                        element[0].scrollTop += shift;
                    }
                }
            }

            const selector = attrs['scrollKeepPosition'];
            const child = element[0].querySelector(selector) as HTMLElement;

            if (child) {
                snapshot = {
                    child,
                    offset: child.offsetTop,
                    scroll: element[0].scrollTop
                };
            }
        };

        scrollContainer.scrollings
        .merge(scrollContainer.frames)
        .subscribe(frame);
    }
});
