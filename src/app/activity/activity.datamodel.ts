import {
	IActivityHeader,
	IActivityDetails,
	IActivityIntervalW,
	IActivityIntervalL,
	IActivityIntervalP,
	IActivityMeasure,
	ICalcMeasures, IActivityIntervalPW, IActivityInterval, IActivityType
} from "../../../api/activity/activity.interface";
import {IActivityCategory} from '../../../api/reference/reference.interface';
import moment from 'moment/src/moment.js';
import {copy, merge} from 'angular';
import {CalendarItem} from "../calendar-item/calendar-item.datamodel";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {activityTypes, getType} from "./activity.constants";
import {IUserProfileShort} from "../../../api/user/user.interface";

export interface IRoute {
	lat:number;
	lng: number;
}

export enum ActivityStatus {

}

export class Interval implements IActivityInterval {
	trainersPrescription: string;
	durationMeasure: string; //movingDuration/distance, каким показателем задается длительность планового сегмента
	durationValue: number; // длительность интервала в ед.изм. показателя длительности
	keyInterval: boolean; // признак того, что плановый сегмент является ключевым
	intensityMeasure: string; //heartRate/speed/power, показатель, по которому задается интенсивность на данном интервале
	intensityLevelFrom: number; // начальное абсолютное значение интенсивности
	intensityByFtpFrom: number; // начальное относительное значение интенсивности
	intensityLevelTo: number; // конечное абсолютное значение интенсивности
	intensityByFtpTo: number; // конечное относительное значение интенсивности
	intensityDistribution: string; // [A] = любое значение по показателю интенсивности в заданном интервале. [I] = рост значенией показателя. [D] = снижение
	intensityFtpMax: number; // максимальная средняя интенсивность среди фактических данных , относящихся к разметке плановых сегментов. Пригодно к использованию только в рамках интервала с type = [P].
	intensityMaxZone: number; // максимальная зона интенсивности
	movingDurationLength: number; // времени
	distanceLength: number; // по дистанции
	actualDurationValue: number; // Указанная вручную пользователем длительность сегмента
	movingDurationApprox: boolean; // признак, что movingDuration определен приблизительно
	distanceApprox: boolean; // признак, что distance рассчитан приблизительно

	// Дополнительные поля для модели данных отображения сегмента pW | P
	movingDuration: Object = {durationValue: null};
	distance: Object = {durationValue: null};
	heartRate: Object = {};
	power: Object = {};
	speed: Object = {};

	public calcMeasures: ICalcMeasures;

	constructor(public type: string, obj?: {}){
		this.type = type;
		this.trainersPrescription = null;
		this.durationMeasure = null; //movingDuration/distance, каким показателем задается длительность планового сегмента
		this.durationValue = null; // длительность интервала в ед.изм. показателя длительности
		this.calcMeasures = {
			heartRate: { code: 'heartRate', value: null, minValue: null, avgValue: null, maxValue: null}, // пульсовая статистика по интервалу
			heartRateDistancePeaks: { code: 'heartRateDistancePeaks', value: null, minValue: null, avgValue: null, maxValue: null}, // данные по пульсовым пикам на разных дистанциях
			speed: { code: 'speed', value: null, minValue: null, avgValue: null, maxValue: null}, // статистика по скорости
			speedDistancePeaks: { code: 'speedDistancePeaks', value: null, minValue: null, avgValue: null, maxValue: null}, // пики по скорости на разных дистанциях
			duration: { code: 'duration', value: null, minValue: null, avgValue: null, maxValue: null}, // общее прошедшее время с начала тренировки
			movingDuration: { code: 'movingDuration', value: null, minValue: null, avgValue: null, maxValue: null}, // время в движении
			distance: { code: 'distance', value: null, minValue: null, avgValue: null, maxValue: null}, // пройденная дистанция
			cadence: { code: 'cadence', value: null, minValue: null, avgValue: null, maxValue: null}, // кол-во шагов
			strideLength: { code: 'strideLength', value: null, minValue: null, avgValue: null, maxValue: null}, // длина шага
			swolf: { code: 'swolf', value: null, minValue: null, avgValue: null, maxValue: null}, // кол-во гребков + время в секунда на преодоление одной длины бассейна
			calories: { code: 'calories', value: null, minValue: null, avgValue: null, maxValue: null}, // потраченные калории
			power: { code: 'power', value: null, minValue: null, avgValue: null, maxValue: null}, // статистика по мощности
			powerDistancePeaks: { code: 'powerDistancePeaks', value: null, minValue: null, avgValue: null, maxValue: null}, // пики по мощности на разных дистанциях
			adjustedPower: { code: 'adjustedPower', value: null, minValue: null, avgValue: null, maxValue: null}, // скорость с поправкой на градиент
			altitude: { code: 'altitude', value: null, minValue: null, avgValue: null, maxValue: null}, // высота над уровнем моря
			elevationGain: { code: 'elevationGain', value: null, minValue: null, avgValue: null, maxValue: null}, // набранная высота
			elevationLoss: { code: 'elevationLoss', value: null, minValue: null, avgValue: null, maxValue: null}, // кол-во метров спуска за интервал
			grade: { code: 'grade', value: null, minValue: null, avgValue: null, maxValue: null}, // градиент в наборе/потере высоты
			vam: { code: 'vam', value: null, minValue: null, avgValue: null, maxValue: null}, // вертикальная скорость
			vamPowerKg: { code: 'vamPowerKg', value: null, minValue: null, avgValue: null, maxValue: null}, // относительная мощность подъема
			temperature: { code: 'temperature', value: null, minValue: null, avgValue: null, maxValue: null}, // температура воздуха
			intensityLevel: { code: 'intensityLevel', value: null, minValue: null, avgValue: null, maxValue: null}, // уровень интенсивности
			variabilityIndex: { code: 'variabilityIndex', value: null, minValue: null, avgValue: null, maxValue: null}, // индекс изменений
			efficiencyFactor: { code: 'efficiencyFactor', value: null, minValue: null, avgValue: null, maxValue: null}, // фактор эффективности
			decouplingPower: { code: 'decouplingPower', value: null, minValue: null, avgValue: null, maxValue: null}, // кардиокомпенсация по мощности
			decouplingPace: { code: 'decouplingPace', value: null, minValue: null, avgValue: null, maxValue: null}, // кардиокомпенсация по скорости
			trainingLoad: { code: 'trainingLoad', value: null, minValue: null, avgValue: null, maxValue: null}, // тренировочная нагрузка
			completePercent: { code: 'completePercent', value: null, minValue: null, avgValue: null, maxValue: null}, // процент выполнения сегмента по отношению к плановым значениям
		};

		if (type === 'P' || type === 'pW') {
			this.durationMeasure = null;
			this.intensityMeasure = null;
			this.intensityLevelFrom = null;
			this.intensityByFtpTo = null;
			this.intensityByFtpFrom = null;
			this.intensityByFtpTo = null;
			this.intensityFtpMax = null;
			this.intensityMaxZone = null;
			this.movingDurationLength = null;
			this.distanceLength = null;
			this.movingDurationApprox = null;
			this.distanceApprox = null;
		}

		if(obj) { // дополнительные параметры для создания интервала
			Object.assign(this,obj);
		}
	}
}

class ActivityHeader implements IActivityHeader {

	public startTimestamp: Date;
	public activityCategory: IActivityCategory;
	public activityType: IActivityType;
	public intervals: Array<IActivityIntervalW | IActivityIntervalPW | IActivityIntervalL> = [];

	constructor(header?: IActivityHeader){
		this.startTimestamp = new Date();
		this.activityCategory = { // категория тренировки
			id: null,
			revision: null,
			code: null,
			activityTypeId: null,
			sortOrder: null
		};
		this.activityType = { //вид спорта
			id: null,
				code: null,
				typeBasic: null
		};
		merge(this, header);
		this.intervals.push(new Interval('pW'), new Interval('W'));
	}
}

export let toDay = (date):Date => {
	let result = new Date(date);
	result.setHours(0, 0, 0, 0);
	return result;
};

/**
 *
 */
export class Activity extends CalendarItem {

	public activityHeader: IActivityHeader;
	public header: IActivityHeader;
	public categoriesList: Array<IActivityCategory> = [];
	public intervalPW: IActivityIntervalPW;
	public intervalW: IActivityIntervalW;
	public intervalL: Array<IActivityIntervalL> = [];
	public intervalU: Array<IActivityIntervalL> = [];
	public intervalP: Array<IActivityIntervalP> = [];
	private route: Array<IRoute>;
	private isRouteExist: boolean = false;
	private hasDetails: boolean = false;
	public hasImportedData: boolean = false;
	private peaks: Array<any>;
	private readonly statusLimit: { warn: number, error: number} = { warn: 10, error: 20 };
	public details: IActivityDetails;
	public actualDataIsImported: boolean = false;
    private _startDate: Date;

	constructor(private item: ICalendarItem, private method: string = 'view'){
		super(item); // в родителе есть часть полей, которые будут использованы в форме, например даты
		this.prepare(method);
	}

	// Добавляем детальные данные по тренеровке
	completeDetails(details: IActivityDetails = null) {
		this.details = details;
		// Обработка детальных данных по тренировке
		this.hasDetails = !!details && details.metrics.length > 0;
		if(this.hasDetails) {
			this.route = this.getRouteData(details);
			this.isRouteExist = !!this.route;
		}

	}

	completeIntervals(intervals: Array<IActivityIntervalW | IActivityIntervalP | IActivityIntervalPW | IActivityIntervalL>) {
		this.header.intervals = [];
		this.header.intervals.push(...this.intervalP, this.intervalPW, ...intervals, this.intervalW);
		this.intervalL = <Array<IActivityIntervalL>>this.header.intervals.filter(i => i.type === "L");
		this.hasImportedData = this.intervalL.hasOwnProperty('length') && this.intervalL.length > 0;
	}

	completeInterval(interval: IActivityIntervalL | IActivityIntervalP) {
		//this.header.intervals.push(interval);
		switch (interval.type) {
			case 'U': {
				this.intervalU.push(interval); //= <Array<IActivityIntervalL>>this.header.intervals.filter(i => i.type === "U");
				break;
			}
			case 'P': {
				this.intervalP.push(<IActivityIntervalP>interval);// = <Array<IActivityIntervalP>>this.header.intervals.filter(i => i.type === "P");
				this.calculateInterval('pW');
			}
		}
	}

	calculateInterval(type: string) {
		switch (type) {
			case 'pW': {
				let intervalPW:Interval = new Interval('pW');
				this.intervalP.forEach(i => {

					intervalPW.durationMeasure = i.durationMeasure;
					intervalPW.intensityMeasure = i.intensityMeasure;
					intervalPW.durationValue += i.durationValue;
					intervalPW.movingDurationLength += i.movingDurationLength;
					intervalPW.distanceLength += i.distanceLength;
					intervalPW.intensityLevelFrom = (intervalPW.intensityLevelFrom >= i.intensityLevelFrom || intervalPW.intensityLevelFrom === null) ? i.intensityLevelFrom: intervalPW.intensityLevelFrom;
					intervalPW.intensityLevelTo = (intervalPW.intensityLevelTo <= i.intensityLevelTo || intervalPW.intensityLevelTo === null) ? i.intensityLevelTo: intervalPW.intensityLevelTo;
					intervalPW.intensityByFtpFrom = (intervalPW.intensityByFtpFrom >= i.intensityByFtpFrom || intervalPW.intensityByFtpFrom === null) ? i.intensityByFtpFrom: intervalPW.intensityByFtpFrom;
					intervalPW.intensityByFtpTo = (intervalPW.intensityByFtpTo <= i.intensityByFtpTo || intervalPW.intensityByFtpTo === null) ? i.intensityByFtpTo: intervalPW.intensityByFtpTo;

				});
				this.intervalPW = <IActivityIntervalPW>intervalPW;
				this.intervalPW.movingDurationApprox = this.intervalP.some(i => i.movingDurationApprox);
				this.intervalPW.distanceApprox = this.intervalP.some(i => i.distanceApprox);
				break;
			}
		}
	}

	spliceInterval(type: string, id: number) {
		switch (type) {
			case 'P': {
				this.intervalP.splice(id,1);
				//this.intervalP = <Array<IActivityIntervalP>>this.header.intervals.filter(i => i.type === type);
				this.calculateInterval('pW');
				break;
			}
		}
	}

	// Подготовка данных для модели отображения
	prepare(method: string) {
		super.prepare();
		// Если activityHeader не установлен, значит вызван режим создаения записи
		// необходимо создать пустые интервалы и обьявить обьекты
		if (method === 'post') {
			this.header = new ActivityHeader(this.item.activityHeader); //создаем пустую запись с интервалом pW, W
		} else {
			this.header = copy(this.item.activityHeader); // angular deep copy
			// Если итервала pW нет, то создаем его
			// Интервал pW необходим для вывода Задания и сравнения план/факт выполнения по неструктуриорванному заданию
			if (!this.header.intervals.some(i => i.type === 'pW')) {
				this.header.intervals.push(new Interval('pW'));
			}
			// Если интервала W нет, то создаем его
			if (!this.header.intervals.some(i => i.type === 'W')) {
				this.header.intervals.push(new Interval('W'));
			}
		}
		// Ссылки на интервалы для быстрого доступа
		this.intervalPW = <IActivityIntervalPW>this.header.intervals.filter(i => i.type === "pW")[0];
		this.intervalW = <IActivityIntervalW>this.header.intervals.filter(i => i.type === "W")[0];
		this.intervalP = <Array<IActivityIntervalP>>this.header.intervals.filter(i => i.type === "P").sort((a,b) => a['pos'] - b['pos']);
		this.actualDataIsImported = this.intervalW.actualDataIsImported;

        // Запоминаем, чтобы парсить только один раз
        this._startDate = toDay(moment(this.dateStart, 'YYYY-MM-DD').toDate());
        
		// Дополниельные данные для отображения плана на панелях
		Object.assign(this.intervalPW, {
			movingDuration: {
				order: 110,
				sourceMeasure: 'movingDuration',
				durationValue: ((this.intervalPW.durationMeasure === 'movingDuration' || (this.intervalPW.durationMeasure === 'duration')) && this.intervalPW.durationValue) || null
			},
			distance: {
				order: 120,
				sourceMeasure: 'distance',
				durationValue: (this.intervalPW.durationMeasure === 'distance' && this.intervalPW.durationValue) || null},
			heartRate: {
				order: 210,
				sourceMeasure: 'heartRate',
				intensityLevelFrom: (this.intervalPW.intensityMeasure === 'heartRate' && this.intervalPW.intensityLevelFrom) || null,
				intensityLevelTo: (this.intervalPW.intensityMeasure === 'heartRate' && this.intervalPW.intensityLevelTo) || null,
				intensityByFtpFrom: (this.intervalPW.intensityMeasure === 'heartRate' && this.intervalPW.intensityByFtpFrom) || null,
				intensityByFtpTo: (this.intervalPW.intensityMeasure === 'heartRate' && this.intervalPW.intensityByFtpTo) || null
			},
			speed: {
				order: 220,
				sourceMeasure: 'speed',
				intensityLevelFrom: (this.intervalPW.intensityMeasure === 'speed' && this.intervalPW.intensityLevelFrom) || null,
				intensityLevelTo: (this.intervalPW.intensityMeasure === 'speed' && this.intervalPW.intensityLevelTo) || null,
				intensityByFtpFrom: (this.intervalPW.intensityMeasure === 'speed' && this.intervalPW.intensityByFtpFrom) || null,
				intensityByFtpTo: (this.intervalPW.intensityMeasure === 'speed' && this.intervalPW.intensityByFtpTo) || null
			},
			power: {
				order: 230,
				sourceMeasure: 'power',
				intensityLevelFrom: (this.intervalPW.intensityMeasure === 'power' && this.intervalPW.intensityLevelFrom) || null,
				intensityLevelTo: (this.intervalPW.intensityMeasure === 'power' && this.intervalPW.intensityLevelTo) || null,
				intensityByFtpFrom: (this.intervalPW.intensityMeasure === 'power' && this.intervalPW.intensityByFtpFrom) || null,
				intensityByFtpTo: (this.intervalPW.intensityMeasure === 'power' && this.intervalPW.intensityByFtpTo) || null
			}
		});
	}

	// Подготовка данных для передачи в API
	build(userProfile?: IUserProfileShort) {
		super.package();
		this.dateEnd = this.dateStart;
		this.header.activityType = getType(Number(this.header.activityType.id));
		this.header.activityCategory = this.categoriesList.filter(c => c.id === this.category)[0] || null;
		this.header.intervals = [];
		debugger;
		this.header.intervals.push(...this.intervalP, this.intervalPW, this.intervalW); //, ...this.intervalL

		return {
			index: this.index,
			calendarItemId: this.calendarItemId,
			calendarItemType: this.calendarItemType, //activity/competition/event/measurement/...,
			revision: this.revision,
			dateStart: this.dateStart, // timestamp даты и времени начала
			dateEnd: this.dateEnd, // timestamp даты и времени окончания
			userProfileOwner: userProfile || this.userProfileOwner,
			userProfileCreator: this.userProfileCreator,
			//userProfileCreator: IUserProfileShort,
			activityHeader: this.header
		};
	}

	/**
	 * Получаем данные для построения маршрута тренировки
	 * @param details
	 * @returns {any}
	 */
	getRouteData(details: IActivityDetails):Array<IRoute> {

		if (!details.measures.hasOwnProperty('longitude') || !details.measures.hasOwnProperty('latitude')) {
			return null;
		}

		let lng = details.measures['longitude'].idx; // lng index in array
		let lat = details.measures['latitude'].idx; // lat index in array
		let timestamp = details.measures['timestamp'].idx; // timestamp index in array

		return details.metrics
			.filter(m => m[lng] > 0 || m[lat] > 0)
			.map(m => ({lng: m[lng],lat: m[lat], timestamp: m[timestamp]}));
	}

	/**
	 * Вид спорта
	 * @returns {String}
     */
	get sport() {
		return this.header.activityType.id;
	}

	set sport(id) {
		this.header.activityType = getType(Number(id));
	}

	/**
	 * Базовый вид спорта
	 * @returns {String}
     */
	get sportBasic(){
		return this.header.activityType.typeBasic;
	}

	/**
	 * Путь к иконке вида спорта (не базовый вид спорта)
	 * @returns {string}
	 */
	get sportUrl() {
		return `assets/icon/${this.header.activityType.code || 'default_sport'}.svg`;
	}

	get category():number {
		return (this.header.activityCategory && this.header.activityCategory.hasOwnProperty('id'))
			&& this.header.activityCategory.id;
	}

	set category(id: number) {
		this.header.activityCategory = this.categoriesList.filter(c => c.id === Number(id))[0];
	}

	get categoryCode():string {
		return (this.header.activityCategory && this.header.activityCategory.hasOwnProperty('code'))
			&& this.header.activityCategory.code;
	}

	/**
	 * Выполнена ли тренировка?
	 * Проверяем наличие интервала с типов W, а также наличие значений в показателях
	 * @returns {boolean}
     */
	get completed() {
		return (!!this.intervalW &&
			Object.keys(this.intervalW.calcMeasures).filter(m =>
				this.intervalW.calcMeasures[m]['value'] || this.intervalW.calcMeasures[m]['minValue'] ||
				this.intervalW.calcMeasures[m]['maxValue'] || this.intervalW.calcMeasures[m]['avgValue']).length > 0);
	}

	get structured() {
		return !!this.intervalP && this.intervalP.length > 0;
	}

	get isToday() {
		return this._startDate.getTime() === toDay(new Date()).getTime();
	}

	get coming() {
		return this._startDate.getTime() >= toDay(new Date()).getTime();
	}

	get dismiss() {
		return this.status === 'dismiss';
	}

	/**
	 * Тренировка имеет план?
	 * Проверяем наличие интервала с типом pW, а также наличие значения в показателях
	 * @returns {boolean}
     */
	get specified() {
		return (!!this.intervalP && this.intervalP.length > 0) ||
			(!!this.intervalPW && (this.intervalPW.durationValue > 0 || this.intervalPW.intensityLevelFrom > 0));
	}

	get bottomPanel() {
		return ((this.status === 'coming' && ((this.intervalPW.trainersPrescription && this.intervalPW.trainersPrescription.length > 0) || this.intervalPW.intensityMeasure )) && 'plan') ||
			(this.status === 'coming' && this.structured && 'segmentList') ||
			((this.completed && this.summaryAvg.length > 0) && 'data') || null;
	}

	/**
	 * Опредлеям нужно ли выводить дополнительную панель с информацией
	 * @returns {boolean}
	 */
	hasBottomData() {
		return !!this.bottomPanel;
	}

	get percent() {
		return ((this.intervalPW.hasOwnProperty('calcMeasures')
			&& this.intervalPW.calcMeasures.hasOwnProperty('completePercent'))
			&& this.intervalPW.calcMeasures.completePercent.value * 100) || null;
	}

	printPercent() {
		return ((this.percent && this.completed) && `${this.percent.toFixed(0)}%`);
	}

	get id(){
		return this.header.activityId;
	}

	/**
	 * Перечень статусов тренировки
	 * 1) Запланирована, в будущем - coming
	 * 2) Запланирована, пропущена - dismiss
	 * 3) Запланирована, выполнена - complete
	 * 4) Запланирована, выполнена с допущением - complete-warn
	 * 5) Запланирована, выполнена с нарушением - complete-error
	 * 6) Не запланирована, выполнена - not-specified
	 * @returns {string}
	 */
	get status() {
		return !this.isToday ?
			// приоритет статусов, если запись не сегодня
			(this.coming && 'coming')
				|| (!this.specified && 'not-specified')
				|| (!this.completed && 'dismiss')
				|| ((Math.abs(100-this.percent) <= this.statusLimit.warn && this.percent > 0) && 'complete')
				|| ((Math.abs(100-this.percent) <= this.statusLimit.error && this.percent > 0) && 'complete-warn')
				|| ((Math.abs(100-this.percent) > this.statusLimit.error && this.percent > 0)  && 'complete-error') :
			//приоритет статусов, если запись сегодня
			((Math.abs(100-this.percent) <= this.statusLimit.warn && this.percent > 0) && 'complete')
				|| ((Math.abs(100-this.percent) <= this.statusLimit.error && this.percent > 0)  && 'complete-warn')
				|| ((Math.abs(100-this.percent) > this.statusLimit.error && this.percent > 0)  && 'complete-error')
				|| (!this.specified && 'not-specified')
				|| (this.coming && 'coming');
	}

	get durationValue(){
		return (!!this.durationMeasure && this[this.durationMeasure]) || null;
	}

	get durationMeasure() {
		return this.intervalPW.durationMeasure
			|| (!!this.intervalW.calcMeasures.duration.maxValue && 'duration')
			|| (!!this.intervalW.calcMeasures.distance.maxValue && 'distance') || null;
	}

	get intensityValue() {
		return ((this.status === 'coming' || this.status === 'dismiss') && {from: this.intervalPW.intensityLevelFrom, to: this.intervalPW.intensityLevelTo}) ||
			(this.intensityMeasure &&  this.intervalW.calcMeasures.hasOwnProperty(this.intensityMeasure) && this.intervalW.calcMeasures[this.intensityMeasure].avgValue) || null;
	}

	get intensityMeasure() {
		return this.intervalPW.intensityMeasure || this.defaultIntensityMeasure;
	}

	get defaultIntensityMeasure() {
		return (this.intervalW.calcMeasures.hasOwnProperty('speed') &&  this.intervalW.calcMeasures.speed.hasOwnProperty('avgValue')  && this.intervalW.calcMeasures.speed.avgValue && 'speed')
			|| (this.intervalW.calcMeasures.hasOwnProperty('heartRate') &&  this.intervalW.calcMeasures.heartRate.hasOwnProperty('avgValue') && this.intervalW.calcMeasures.heartRate.avgValue && 'heartRate')
			|| (this.intervalW.calcMeasures.hasOwnProperty('power') &&  this.intervalW.calcMeasures.power.hasOwnProperty('avgValue') && this.intervalW.calcMeasures.power.avgValue && 'power') || null;
	}

	get movingDuration() {
		return (((this.status === 'coming' || this.status === 'dismiss') && this.intervalPW.durationMeasure === 'movingDuration')
			&& this.intervalPW.durationValue || this.intervalPW.movingDurationLength) || this.intervalW.calcMeasures.movingDuration.value;
	}

	get duration() {
		return (((this.status === 'coming' || this.status === 'dismiss') && this.intervalPW.durationMeasure === 'movingDuration')
			&& this.intervalPW.durationValue) || this.intervalW.calcMeasures.duration.value;
	}

	get distance() {
		return (((this.status === 'coming' || this.status === 'dismiss') && this.intervalPW.durationMeasure === 'distance')
            && this.intervalPW.durationValue || this.intervalPW.distanceLength) ||
            (this.intervalW.calcMeasures.hasOwnProperty('distance') && this.intervalW.calcMeasures.distance.value) || null;
	}

	// Формируем перечень показателей для панели data (bottomPanel)
	get summaryAvg() {
		let measures = ['speed','heartRate','power'];
		let calc = this.intervalW.calcMeasures;

		return measures
			.map((measure)=>{
				if(calc.hasOwnProperty(measure)){
					return ((calc[measure].hasOwnProperty('avgValue')) &&
						{ measure : measure, value: Number(calc[measure].avgValue)}) || {[measure]: null, value: null};
				}})
			.filter(measure => !!measure && !!measure.value);
	}

	prepareSegmentList(){

		let segmentList: Array<any> = [];
		let segment: any = {};

		if(this.structured && this.intervalP.length > 0) {
			this.intervalP.forEach(interval => {
				segment = interval;
				segment['show'] = true;
				segment['group'] = interval.type === 'G';
				if (segment['group']) { //если группа
					segment.subItem = []; // для записи членов группы
					segmentList.push(segment);
				} else { // отдельный интервал
					if (segment.hasOwnProperty('parentGroupCode') && segment['parentGroupCode']) { // входит в группу
						let gId = segmentList.findIndex(s => s['code'] === segment['parentGroupCode']);
						if (gId !== -1) {
							segmentList[gId].subItem.push(segment);
						}
					} else { // одиночный интервал, без группы
						segmentList.push(segment);
					}
				}
			});
		}

		return segmentList;
	}

	/**
	 * @description Сборка массива координат для мини-граифка
	 * Формат массива графика = [ '[start, интенсивность с], [finish, интенсивность по]',... ]
	 * @returns {any[]}
     */
	formChart(){
		let start: number = 0; //начало отсечки на графике
		let finish: number = 0; // конец отсечки на графике
		let maxFtp: number = 0;
		let data: Array<any> = [];

		this.intervalP.map( interval => {
			start = finish;
			finish = start + interval.movingDurationLength;
			maxFtp = Math.max(interval.intensityByFtpTo, maxFtp); //((interval.intensityByFtpTo > maxFtp) && interval.intensityByFtpTo) || maxFtp;
			data.push([start, interval.intensityByFtpFrom],[finish, interval.intensityByFtpTo]);
		});

		data = data.map(d => [d[0]/finish,d[1]/maxFtp]);
		//debugger;

		// Если сегменты есть, то для графика необходимо привести значения к диапазону от 0...1
		return (data.length > 0 && data) || null;
	}
}

export default Activity;