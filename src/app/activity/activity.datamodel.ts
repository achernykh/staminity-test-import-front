import {
	IActivityHeader,
	IActivityDetails,
	IActivityIntervalW,
	IActivityIntervalL,
	IActivityIntervalP,
	IActivityMeasure,
	ICalcMeasures, IActivityIntervalPW, IActivityInterval, IActivityCategory, IActivityType
} from "../../../api/activity/activity.interface";
import moment from 'moment/src/moment.js';
import {copy, merge} from 'angular';
import {CalendarItem} from "../calendar-item/calendar-item.datamodel";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {activityTypes, getType} from "./activity.constants";

export interface IRoute {
	lat:number;
	lng: number;
}

class Interval implements IActivityInterval {
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
	movingDurationLength: number; // времени
	distanceLength: number; // по дистанции
	actualDurationValue: number; // Указанная вручную пользователем длительность сегмента

	// Дополнительные поля для модели данных отображения сегмента pW
	movingDuration: number;
	distance: number;
	heartRate: number | string;
	power: number | string;
	speed: number | string;

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
	public activityCategory: IActivityCategory;
	public activityType: IActivityType;
	public intervals: Array<IActivityIntervalW | IActivityIntervalPW | IActivityIntervalL> = [];

	constructor(date: Date = new Date()){
		this.startTimestamp = date;
		this.activityCategory = { // категория тренировки
			id: null,
			code: null,
			activityTypeId: null
		};
		this.activityType = { //вид спорта
			id: null,
				code: null,
				typeBasic: null
		};
		this.intervals.push(new Interval('pW'), new Interval('W'));
	}
}
/**
 *
 */
export class Activity extends CalendarItem {

	public activityHeader: IActivityHeader;
	private header: IActivityHeader;
	public intervalPW: IActivityIntervalPW;
	public intervalW: IActivityIntervalW;
	public intervalL: Array<IActivityIntervalL>;
	public intervalP: Array<IActivityIntervalP>;
	private route: Array<IRoute>;
	private isRouteExist: boolean = false;
	private hasDetails: boolean = false;
	private hasImportedData: boolean = false;
	private peaks: Array<any>;
	private readonly statusLimit: { warn: number, error: number} = { warn: 10, error: 20 };
	private actualDataIsImported: boolean = false;

	constructor(item: ICalendarItem, public details: IActivityDetails = null){
		super(item); // в родителе есть часть полей, которые будут использованы в форме, например даты
        // Если activityHeader не установлен, значит вызван режим создаения записи
        // необходимо создать пустые интервалы и обьявить обьекты
		if (!item.hasOwnProperty('activityHeader')) {
			this.header = new ActivityHeader(); //создаем пустую запись с интервалом pW, W
		} else {
			this.header = copy(item.activityHeader); // angular deep copy
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
		this.intervalL = <Array<IActivityIntervalL>>this.header.intervals.filter(i => i.type === "L");
		this.intervalP = <Array<IActivityIntervalP>>this.header.intervals.filter(i => i.type === "P");

		this.hasImportedData = this.intervalL.hasOwnProperty('length') && this.intervalL.length > 0;
		this.actualDataIsImported = this.intervalW.actualDataIsImported;
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
		// Дополниельные данные для отображения плана на панелях
		Object.assign(this.intervalPW, {
			movingDuration: {
				order: 110,
				sourceMeasure: 'movingDuration',
				value: (this.intervalPW.durationMeasure === 'movingDuration' && this.intervalPW.durationValue) || null
			},
			distance: {
				order: 120,
				sourceMeasure: 'distance',
				value: (this.intervalPW.durationMeasure === 'distance' && this.intervalPW.durationValue) || null},
			heartRate: {
				order: 210,
				sourceMeasure: 'heartRate',
				from: (this.intervalPW.intensityMeasure === 'heartRate' && this.intervalPW.intensityLevelFrom) || null,
				to: (this.intervalPW.intensityMeasure === 'heartRate' && this.intervalPW.intensityLevelTo) || null
			},
			speed: {
				order: 220,
				sourceMeasure: 'speed',
				from: (this.intervalPW.intensityMeasure === 'speed' && this.intervalPW.intensityLevelFrom) || null,
				to: (this.intervalPW.intensityMeasure === 'speed' && this.intervalPW.intensityLevelTo) || null
			},
			power: {
				order: 230,
				sourceMeasure: 'power',
				from: (this.intervalPW.intensityMeasure === 'power' && this.intervalPW.intensityLevelFrom) || null,
				to: (this.intervalPW.intensityMeasure === 'power' && this.intervalPW.intensityLevelTo) || null
			}
		});
	}

	// Подготовка данных для передачи в API
	build() {
		super.package();
		this.dateEnd = this.dateStart;
		this.header.activityType = getType(Number(this.header.activityType.id));
		// заглушка для тестирования собственных категорий
		if (this.header.activityCategory){
			//this.header.activityCategory = getCategory(Number(this.header.activityCategory.id));
		}
		// заглушка для тестирования собственных категорий
		if (this.header.activityCategory){
			this.header.activityCategory.id = null;
		}
		this.header.intervals = [];
		this.header.intervals.push(...this.intervalP, this.intervalPW, ...this.intervalL, this.intervalW);

		return {
			index: this.index,
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
		return moment(this.dateStart, 'YYYY-MM-DD').diff(moment(), 'd') === 0;
	}

	get coming() {
		//return moment().diff(moment(this.dateStart, 'YYYY-MM-DD'), 'd') < 1;
		return moment(this.dateStart, 'YYYY-MM-DD').diff(moment(), 'd') >= 0;
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
		return ((this.intervalPW.hasOwnProperty('calcMeasures')
			&& this.intervalPW.calcMeasures.hasOwnProperty('completePercent'))
			&& this.intervalPW.calcMeasures.completePercent.value * 100) || null;
	}

	/**
	 * Получение пиков по тренировке
	 * @returns {any[]}
     */
	getPeaks() {
		let search = ['heartRateTimePeaks', 'heartRateDistancePeaks',
			'speedTimePeaks', 'speedDistancePeaks',
			'powerTimePeaks', 'powerDistancePeaks',
			'cadenceTimePeaks', 'cadenceDistancePeaks'];
		let measure = {
			'heartRateTimePeaks': 'heartRate',
			'heartRateDistancePeaks': 'heartRate',
			'speedTimePeaks': 'speed',
			'speedDistancePeaks': 'speed',
			'powerTimePeaks': 'power',
			'powerDistancePeaks': 'power',
			'cadenceDistancePeaks': 'cadence',
			'cadenceTimePeaks': 'cadence'
		};
		return search.filter(m => this.intervalW.calcMeasures.hasOwnProperty(m) &&
			this.intervalW.calcMeasures[m].hasOwnProperty('peaks') &&
			this.intervalW.calcMeasures[m].peaks[0].value !== 0)
			.map(m => ({
				measure: measure[m],
				type: (m.includes('Time') && 'duration') || 'distance',
				value: this.intervalW.calcMeasures[m].peaks
			}));
	}

	printPercent() {
		return ((this.percent && this.completed) && `${this.percent.toFixed(0)}%`);
	}

	get id(){
		return this.header.activityId;
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
		return ((this.status === 'coming' || this.status === 'dismiss') && {
			from: this.intervalPW.intensityLevelFrom,
			to: this.intervalPW.intensityLevelTo}) || this.intervalW.calcMeasures[this.intensityMeasure].avgValue;
	}

	get intensityMeasure() {
		return this.intervalPW.intensityMeasure || this.defaultIntensityMeasure;
	}

	get defaultIntensityMeasure() {
		return (!!this.intervalW.calcMeasures.speed.avgValue && 'speed')
			|| (!!this.intervalW.calcMeasures.heartRate.avgValue && 'heartRate')
			|| (!!this.intervalW.calcMeasures.power.avgValue && 'power') || null;
	}

	get movingDuration() {
		return (((this.coming || this.dismiss) && this.intervalPW.durationMeasure === 'movingDuration')
			&& this.intervalPW.durationValue) || this.intervalW.calcMeasures.movingDuration.value;
	}

	get duration() {
		return (((this.coming || this.dismiss) && this.intervalPW.durationMeasure === 'movingDuration')
			&& this.intervalPW.durationValue) || this.intervalW.calcMeasures.duration.value;
	}

	get distance() {
		return (((this.coming || this.dismiss) && this.intervalPW.durationMeasure === 'distance')
			&& this.intervalPW.durationValue) || this.intervalW.calcMeasures.distance.value;
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

	formSegmentList(){

	}

	/**
	 * @description Сборка массива координат для мини-граифка
	 * Формат массива графика = [ '[start, интенсивность с], [finish, интенсивность по]',... ]
	 * @returns {any[]}
     */
	formChart(){
		let start: number = 0; //начало отсечки на графике
		let finish: number = 0; // конец отсечки на графике
		let maxFtp: number;
		let data: Array<any> = [];

		this.intervalP.map( interval => {
			start = finish;
			finish = start + interval.movingDurationLength;
			maxFtp = ((interval.intensityByFtpTo > maxFtp) && interval.intensityByFtpTo) || maxFtp;
			data.push([start, interval.intensityByFtpFrom],[finish, interval.intensityByFtpTo]);
		});

		// Если сегменты есть, то для графика необходимо привести значения к диапазону от 0...1
		return (data.length > 0 && data.map(d => {d[0] = d[0] / finish;	d[1] = d[1] / 100; return d;})) || null;
	}
}

export default Activity;