import {IUserProfileShort} from '../../../../api/user/user.interface'

interface IActivityMeasureZones {
    code:string;
    spentTime?:number; // кол-во секунд, проведенных в этой зоне
    spentDistance?:number; // кол-во метров, проведенных в этой зоне
}

interface IActivityMeasure {
    code:string;
    value?:number; //TODO наверно и такой показатель для кого-то будет
    minValue?:number;
    avgValue?:number;
    maxValue?:number;
    zones?:Array<IActivityMeasureZones>;
}
// [W] - итоговый сводный фактический интервал по тренировке
interface IActivityIntervalW {
    type:string; //W
    actualDataIsImported:boolean; // признак загрузки фактических данных с устройства
    startTimestamp:number; // отсечки начала и окончания интервала
    endTimestamp:number;
    calcMeasures: {
        [measureCode: string]: IActivityMeasure;
    };
}
// [P] - плановый сегмент
interface IActivityIntervalP {
    type:string; //"P",
    code:string;
    isGroup:boolean; // - флаг того; что данный сегмент является группирующей сущностью для плановых сегментов
    parentGroupCode:string; // идентификатор родительской группы сегментов
    durationMeasure:string; //movingDuration/distance, каким показателем задается длительность планового сегмента
    movingDurationLength:number; // длительность интервала в секундах
    distanceLength:number; // длительность интервала в метрах дистанции
    keyInterval:boolean; // признак того, что плановый сегмент является ключевым
    intensityMeasure:string; //heartRate/speed/power, показатель, по которому задается интенсивность на данном интервале
    intensityLevelFrom:number; // начальное абсолютное значение интенсивности
    intensityByFtpFrom:number; // начальное относительное значение интенсивности
    intensityLevelTo:number; // конечное абсолютное значение интенсивности
    intensityByFtpTo:number; // конечное относительное значение интенсивности
    intensityDistribution:string; // [A] = любое значение по показателю интенсивности в заданном интервале. [I] = рост значенией показателя. [D] = снижение
    intensityFtpMax:number; // максимальная средняя интенсивность среди фактических данных , относящихся к разметке плановых сегментов. Пригодно к использованию только в рамках интервала с type = [P].
}
// [PG] - плановый сегмент группа
interface IActivityIntervalPG {
    type:string; //"P",
    code:string;
    isGroup:boolean; // - true
    repeatCount:number; // количество повторов сегментов. Только для групп.
    parentGroupCode:string;
}
// [L] - фактическая отсечка круга с устройства
interface  IActivityIntervalL {
    type:string; //"L",
    startTimestamp:number; // отсечки начала и окончания интервала
    endTimestamp:number;
}
// [pW] - итоговый плановый сегмент по тренировке
interface  IActivityIntervalPW {
    type:string; //"pW",
    code:string; //"total planned interval",
    isGroup:boolean; //false
    trainersPrescription:string // задание от тренера. Может находиться только в интервале с типом [pW]
}

interface IActivityInterval {
    type:string;   // [W] - итоговый сводный фактический интервал по тренировке
                   // [P] - плановый сегмент
                   // [L] - фактическая отсечка круга с устройства
                   // [pW] - итоговый плановый сегмент по тренировке

    // Поля сегмента типа W
    actualDataIsImported:boolean; // признак загрузки фактических данных с устройства
    startTimestamp:number; // отсечки начала и окончания интервала
    endTimestamp:number;
    calcMeasures: {
        [measureCode: string]: IActivityMeasure;
    };
}

export interface IActivityHeader {
    activityId:number;
    activityCode:string;
    revision:number;
    updated:Date;
    startTimestamp:Date;
    timezone:string; // Часовой пояс, в котором была тренировка

    activityCategory:{ // категория тренировки
        id:number;
        code:string;
    };
    activityType:{ //вид спорта
        id:number;
        code:string;
        typeBasic:string;
    };
    social:{
        isPublic:boolean; // Публичная ли это  тренировка (доступна всем по ее activityId)
        userLikesCount:number; // счетчик кол-ва лайков от пользователей
        trainerCommentsCount:number; // счетчик кол-ва сообщений в переписке с тренером
        userCommentsCount:number; // счетчик кол-ва сообщений в переписке с пользователями
    };
    intervals:Array<IActivityIntervalW | IActivityIntervalP | IActivityIntervalPG | IActivityIntervalL | IActivityIntervalPW>;

}

interface IActivityDetails {
    activityId:number;
    revision:number; // поле полностью соответствует calendarItem.revision
    social:{
        userLikes:Array<IUserProfileShort>;
        // Комментарии тренера
        trainerComments:[
            {
                userProfile:IUserProfileShort;
                timestamp:Date;
                comment:string;
            }
            ];
        // Комментарии пользователей
        userComments:[
            {
                userProfile:IUserProfileShort;
                timestamp:Date;
                comment:string
            }
            ]
    };
    // показатели, по которым имеются метрики в разрезе каждой временной отсечки на часах
    measures:{
        // название показателя находится в имени ключа объекта
        [measureCode: string]: {
            code: string; //"код показателя. Дубликат относительно measureCode",
            idx: number; // порядковый номер показателя в массиве metrics
            unit: string //"единицы измерения" //TODO а нам нужны единицы измерения? Можно хранить все в одной на сервере, без учета системы мер и пр.
        }
    };
    // значения показателей. Порядок значений соответствует порядку idx ключей объекта $.measures.<measureCode>.idx
    metrics: Array<Array<number>>;

}