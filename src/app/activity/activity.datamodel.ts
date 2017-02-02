import {
	IActivityHeader,
	IActivityDetails,
	IActivityIntervalW,
	IActivityIntervalL,
	IActivityIntervalP,
	IActivityMeasure,
	ICalcMeasures, IActivityIntervalPW, IActivityInterval
} from "../../../api/activity/activity.interface";
import moment from 'moment/src/moment.js';
import {copy} from 'angular';
import {CalendarItem} from "../calendar-item/calendar-item.datamodel";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {getActivityType, getCategory} from "./activity.constants";

export interface IRoute {
	lat:number;
	lng: number;
}

class Interval implements IActivityInterval{
	public trainersPrescription: string;
	public durationMeasure: string;
	public durationValue: number;
	public calcMeasures: ICalcMeasures;

	constructor(public type: string){
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
	}
}

class ActivityHeader implements IActivityHeader {

	public startTimestamp: Date;
	public activityCategory: {
		id: number;
		code: string;
	};
	public activityType: {
		id: number;
		code: string;
		typeBasic: string;
	};
	public intervals: Array<IActivityIntervalW | IActivityIntervalPW | IActivityIntervalL>;

	constructor(date: Date = new Date()){
		this.startTimestamp = date;
		this.activityCategory = { // категория тренировки
			id: null,
			code: null
		};
		this.activityType = { //вид спорта
			id: null,
				code: null,
				typeBasic: null
		};
		this.intervals = [new Interval('pW'), new Interval('W')];
	}
}
/**
 *
 */
export class Activity extends CalendarItem {

	public activityHeader: IActivityHeader;
	private header: IActivityHeader;
	private intervalPW: IActivityIntervalPW;
	private intervalW: IActivityIntervalW;
	private intervalL: Array<IActivityIntervalL>;
	private intervalP: Array<IActivityIntervalP>;
	private route: Array<IRoute>;
	private isRouteExist: boolean = false;
	private hasDetails: boolean = false;

	constructor(item: ICalendarItem, details: IActivityDetails = null){
		super(item);
		if (!item.hasOwnProperty('activityHeader')) {
			this.header = new ActivityHeader(); //создаем пустую запись с интервалом pW, W
		} else {
			this.header = copy(item.activityHeader); // angular deep copy
			// Если итервала pW нет, то создаем его
			// Интервал pW необходим для вывода Задания и сравнения план/факт выполнения по неструктуриорванному заданию
			if (!this.header.intervals.some(i => i.type === 'pW')) {
				this.header.intervals.push(new Interval('pW'));
			}
		}

		// Ссылки на интервалы для быстрого доступа
		this.intervalPW = <IActivityIntervalPW>this.header.intervals.filter(i => i.type === "pW")[0];
		this.intervalW = <IActivityIntervalW>this.header.intervals.filter(i => i.type === "W")[0];
		this.intervalL = <Array<IActivityIntervalL>>this.header.intervals.filter(i => i.type === "L");
		this.intervalP = <Array<IActivityIntervalP>>this.header.intervals.filter(i => i.type === "P");

		// Обработка детальных данных по тренировке
		this.hasDetails = !!details && details.metrics.length > 0;
		if(this.hasDetails) {
			this.route = this.getRouteData(details);
			this.isRouteExist = !!this.route;
		}
	}

	// Подготовка данных для модели отображения
	prepare() {
		super.prepare();
	}

	// Подготовка данных для передачи в API
	build() {
		super.package();
		this.header.activityType = getActivityType(Number(this.header.activityType.id));
		// заглушка для тестирования собственных категорий
		if (this.header.activityCategory){
			this.header.activityCategory = getCategory(Number(this.header.activityCategory.id));
		}
		// заглушка для тестирования собственных категорий
		if (this.header.activityCategory){
			this.header.activityCategory.id = null;
		}

		return {
			calendarItemId: this.calendarItemId,
			calendarItemType: this.calendarItemType, //activity/competition/event/measurement/...,
			revision: this.revision,
			dateStart: this.dateStart, // timestamp даты и времени начала
			dateEnd: this.dateEnd, // timestamp даты и времени окончания
			userProfileOwner: this.userProfileOwner,
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
		return details.metrics
			.filter(m => m[lng] !== 0 || m[lat] !== 0)
			.map(m => ({lng: m[lng],lat: m[lat]}));
	}

	/**
	 * Вид спорта
	 * @returns {String}
     */
	get sport() {
		return this.header.activityType.code;
	}

	/**
	 * Базовый вид спорта
	 * @returns {String}
     */
	get sportBasic(){
		return this.header.activityType.typeBasic;
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
		return !!this.intervalP;
	}

	get coming() {
		return moment().diff(moment(this.dateStart, 'YYYY-MM-DD'), 'd') < 1;
	}

	/**
	 * Тренировка имеет план?
	 * Проверяем наличие интервала с типом pW, а также наличие значения в показателях
	 * @returns {boolean}
     */
	get specified() {
		return (!!this.intervalPW &&
			Object.keys(this.intervalPW.calcMeasures).filter(m =>
				this.intervalPW.calcMeasures[m]['value'] || this.intervalPW.calcMeasures[m]['minValue'] ||
				this.intervalPW.calcMeasures[m]['maxValue'] || this.intervalPW.calcMeasures[m]['avgValue']).length > 0);
	}

	get bottomPanel() {
		return ((this.coming && this.intervalPW.trainersPrescription) && 'prescription') ||
			(this.completed && 'data') || null;
	}

	/**
	 * Опредлеям нужно ли выводить дополнительную панель с информацией
	 * @returns {boolean}
	 */
	hasBottomData() {
		return !!this.bottomPanel &&
			((this.bottomPanel === 'data' && this.summaryAvg.length > 0) ||
			(this.bottomPanel === 'prescription' && this.intervalPW.trainersPrescription.length > 0));
	}

	get percent() {
		return (this.intervalW.calcMeasures.hasOwnProperty('completePercent')
			&& this.intervalW.calcMeasures.completePercent.value) || null;
	}

	printPercent() {
		return (this.percent && `${this.percent.toFixed(0)}%`);
	}

	/**
	 * Перечень статусов тренировки
	 * 1) Запланирована, в будущем
	 * 2) Запланирована, пропущена
	 * 3) Запланирована, выполнена
	 * 4) Запланирована, выполнена с допущением
	 * 5) Запланирована, выполнена с нарушением
	 * 6) Не запланирована, выполнена
	 * @returns {string}
	 */
	get status() {

		return (this.coming && 'coming') || (!this.specified && 'not-specified') || (!this.completed && 'dismiss')
			|| (this.percent > 75 && 'complete') || (this.percent > 50 && 'complete-warn') || 'complete-error';

		/*if (this.coming)
			return 'coming'
		else if (!this.specified)
			return 'not-specified'
		else if (!this.completed)
			return 'dismiss'
		else if (this.percent > 75)
			return "complete"
		else if (this.percent > 50)
			return "complete-warn"
		else
			return "complete-error"*/
	}

	get sportUrl() {
		return `assets/icon/${this.sport}.svg`;
	}

	get movingDuration() {
		return (this.coming && this.intervalPW.calcMeasures.movingDuration.maxValue) ||
			this.intervalW.calcMeasures.movingDuration.maxValue;
	}

	get distance() {
		return (this.coming && this.intervalPW.calcMeasures.distance.maxValue) ||
			this.intervalW.calcMeasures.distance.maxValue;
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

}

class ActivityDatamodel {

	private intervalW: IActivityIntervalW;
	private intervalL: Array<IActivityIntervalL>;
	private calcMeasures: Array<IActivityMeasure> = [];
	private route: Array<IRoute>;
	private isRouteExist: boolean;

	constructor(
		private mode,
		private header:IActivityHeader,
		private details:IActivityDetails) {

		// Режим создания новой записи
		if (mode === 'post') {
			this.header = new ActivityHeader(); //создаем пустую запись с интервалом pW, W
		}
		// Режим просмотра (view) / редактирования записи (put)
		else {
			this.intervalW = <IActivityIntervalW>this.header.intervals.filter(i => i.type === "W")[0];
			this.intervalL = <Array<IActivityIntervalL>>this.header.intervals.filter(i => i.type === "L");

			Object.keys(this.intervalW.calcMeasures)
				.map((key, index) => this.calcMeasures.push(Object.assign(this.intervalW.calcMeasures[key],{code: key})));

			this.route = typeof this.details !== 'undefined' ? this.getRouteData(this.details) : null;
			this.isRouteExist = !!this.route;
		}

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
		return details.metrics
			.filter(m => m[lng] !== 0 || m[lat] !== 0)
			.map(m => ({lng: m[lng],lat: m[lat]}));
	}

	get completed() {
		return this.header.intervals.some(interval => interval.type === "W");
	}

	get structured() {
		return this.header.intervals.some(interval => interval.type === "P");
	}

	get coming() {
		return moment().diff(moment(this.header.startTimestamp, 'YYYY-MM-DD'), 'd') < 1;
	}

	get specified() {
		return this.header.intervals.some(interval => interval.type === "pW");
	}

	get bottomPanel() {
		return (this.completed && 'data');
	}

	/*get intervalW() {
		if(!!this._intervalW){
			this._intervalW = <IActivityIntervalW>this.header.intervals
				.filter(interval => interval.type === "W")[0];
		}
		this.intervalW = this._intervalW;
		return this._intervalW;
	}
	set intervalW(data){
		this._intervalW = data;
	}*/

	get percent() {
		return this.intervalW.hasOwnProperty('completePercent') ?
			this.intervalW.calcMeasures.completePercent.value : null;
	}

	get activityType(){
		return this.header.activityType.typeBasic;
	}

	/**
	 * Перечень статусов тренировки
	 * 1) Запланирована, в будущем
	 * 2) Запланирована, пропущена
	 * 3) Запланирована, выполнена
	 * 4) Запланирована, выполнена с допущением
	 * 5) Запланирована, выполнена с нарушением
	 * 6) Не запланирована, выполнена
	 * @returns {string}
	 */
	get status() {

		return (this.coming && 'coming') || (!this.specified && 'not-specified');

		/*if (this.coming)
			return 'coming';
		else if (!this.specified)
			return 'not-specified';
		else if (!this.completed)
			return 'dismiss';
		else if (this.percent > 75)
			return "complete";
		else if (this.percent > 50)
			return "complete-warn";
		else
			return "complete-error";*/
	}

	get sport() {
		return this.header.activityType.code;
	}

	get sportUrl() {
		return `assets/icon/${this.header.activityType.code}.svg`;
	}

	get movingDuration(){
		/*try {
		 return moment().startOf('day').second(this.intervalW[0].calcMeasures.movingDuration.maxValue).format('H:mm:ss')
		 } catch(e) {
		 return null
		 }*/
		//return this.intervalW[0].calcMeasures.hasOwnProperty('movingDuration') ?
		//    moment().startOf('day').second(this.intervalW[0].calcMeasures.movingDuration.maxValue).format('H:mm:ss') : null
		//this.intervalW[0].calcMeasures.movingDuration.maxValue : null

		let movingDuration = this.intervalW.calcMeasures.movingDuration;
		return ((movingDuration.hasOwnProperty('maxValue')) && moment().startOf('day').second(movingDuration.maxValue).format('H:mm:ss')) || null;

	}

	get distance() {
		/*try {
		 return this.intervalW[0].calcMeasures.distance.maxValue.toFixed(0)
		 } catch(e) {
		 return null
		 }*/
		//return this.intervalW[0].calcMeasures.hasOwnProperty('distance') ?
		//    this.intervalW[0].calcMeasures.distance.maxValue.toFixed(0) : null
		let distance = this.intervalW.calcMeasures.distance;
		return ((distance.hasOwnProperty('maxValue')) && distance.maxValue.toFixed(0)) || null;
	}

	// Формируем перечень показателей для панели data (bottomPanel)
	get summaryAvg() {
		let measures = ['speed','heartRate','power'];
		let calc = this.intervalW.calcMeasures;

		return measures.map(measure => {
				if(calc.hasOwnProperty(measure)){
					return ((calc[measure].hasOwnProperty('avgValue')) &&
						{ measure : measure, value: <number>calc[measure].avgValue}) || {[measure]: null, value: null};
				}}).filter(measure => !!measure && !!measure.value);
	}

}

export default ActivityDatamodel;