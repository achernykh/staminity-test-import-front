import { ICalendarItem } from "../../../api/calendar";

export interface ICalendarWeek {
    sid: number; // номер недели, текущая неделя календаря = 0
    date: any; // дата начала недели
    anchor: string; // anchor просматриваемой недели добавляется в url
    changes: number; // счетчик изменений внутри недели
    toolbarDate: string; //дата недели в формате тулабара Год + Месяц date.format('YYYY MMMM'),
    selected: boolean; // индикатор выделения недели
    subItem: ICalendarDay[]; //дни недели
    week: string; //индикатор недели для поиска
    loading: Promise<any>;
    height: number;
};

export interface ICalendarDay {
    key: string; // формат дня в формате YYYY.MM.DD
    selected: boolean; // индикатор выбора дня
    date: string; // формат дня в формате GMT
    data: ICalendarDayData;
}

export interface ICalendarDayData {
    //pos: number; // позиция от первого дня плана
    title: string; // день в формате DD
    month: string; // месяц в формате MMM
    day: string; // день в формате dd
    date: string; // день в формате YYYY.MM.DD
    calendarItems: ICalendarItem[]; // записи календаря
}
