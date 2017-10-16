import {
	IActivityHeader,
	IActivityDetails,
	IActivityIntervalW,
	IActivityIntervalL,
	IActivityIntervalP,
	IActivityMeasure,
	ICalcMeasures, IActivityIntervalPW, IActivityInterval, IActivityType, IActivityIntervalG, IDurationMeasure,
	IIntensityMeasure, IActivityIntervalU
} from "../../../api/activity/activity.interface";
import {IActivityCategory} from '../../../api/reference/reference.interface';
import moment from 'moment/src/moment.js';
import {copy, merge} from 'angular';
import {CalendarItem} from "../calendar-item/calendar-item.datamodel";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {activityTypes, getType} from "./activity.constants";
import {ActivityIntervalCalcMeasure} from "./activity-datamodel/activity.models";
import {ActivityIntervals} from "./activity-datamodel/activity.intervals";
import {ActivityIntervalFactory} from "./activity-datamodel/activity.functions";
import {IUserProfileShort, IUserProfile} from "../../../api/user/user.interface";
import {IGroupProfileShort} from '../../../api/group/group.interface';
import { Owner, getOwner, ReferenceFilterParams, categoriesFilters } from "../reference/reference.datamodel";
import { pipe, orderBy, prop, groupBy } from "../share/util.js";
import {ActivityHeader} from "./activity-datamodel/activity.header";
import {ActivityIntervalPW} from "./activity-datamodel/activity.interval-pw";
import {ActivityIntervalW} from "./activity-datamodel/activity.interval-w";
import {ActivityIntervalP} from "./activity-datamodel/activity.interval-p";
import {ActivityDetails, IRoute} from "./activity-datamodel/activity.details";
import {ActivityIntervalL} from "./activity-datamodel/activity.interval-l";
import {ActivityIntervalU} from "./activity-datamodel/activity.interval-u";
import {ActivityIntervalG} from "./activity-datamodel/activity.interval-g";

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
	movingDuration: IDurationMeasure;
	distance: IDurationMeasure;
	heartRate: IIntensityMeasure;
	power: IIntensityMeasure;
	speed: IIntensityMeasure;

	// Поля для типа интервала G
	code: string;
	repeatCount: number;

	public calcMeasures: ICalcMeasures;

	constructor(public type: string, obj?: {}){
		this.type = type;
		this.trainersPrescription = null;
		this.durationMeasure = null; //movingDuration/distance, каким показателем задается длительность планового сегмента
		this.durationValue = null; // длительность интервала в ед.изм. показателя длительности
		//this.calcMeasures = new IntervalCalcMeasure();
		/**{
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
		};**/

		switch (type) {
			case 'pW': {
				this.calcMeasures = new ActivityIntervalCalcMeasure();
				break;
			}
		}

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
		} else if(type === 'G') {
			this.code = Math.random().toString(36).substr(2, 5);
			this.repeatCount = 0;
		}

		if(obj) { // дополнительные параметры для создания интервала
			Object.assign(this,obj);
		}
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
	public header: ActivityHeader;
	public categoriesList: Array<IActivityCategory> = [];

	public intervals: ActivityIntervals;
	public categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };
	public intervalPW: ActivityIntervalPW;
	public intervalW: ActivityIntervalW;
	public intervalL: Array<ActivityIntervalL> = [];
	public intervalP: Array<ActivityIntervalP> = [];
	public intervalG: Array<ActivityIntervalG> = [];
	public intervalU: Array<ActivityIntervalU> = [];

	private route: Array<IRoute>;
	private isRouteExist: boolean = true; // ставим начально значени true, чтобы отобразить процесс загрузки данных, далее значение будет переопределно наличем координат
	private hasDetails: boolean = false;
	public hasImportedData: boolean = false;
	private peaks: Array<any>;
	private readonly statusLimit: { warn: number, error: number} = { warn: 10, error: 20 };
	//public actualDataIsImported: boolean = false;
    private _startDate: Date;
	public details: ActivityDetails;

	// Дополнительные поля для использования в шаблонах тренировки
	public isTemplate: boolean;
	public templateId: number;
	public code: string;
	public description: string;
	public favourite: boolean;
	public visible: boolean;
	public groupProfile: IGroupProfileShort;

	constructor(private item: ICalendarItem){
		super(item); // в родителе есть часть полей, которые будут использованы в форме, например даты
		// Запоминаем, чтобы парсить только один раз
		this._startDate = toDay(moment(this.dateStart, 'YYYY-MM-DD').toDate());

		this.prepare();
	}

	completeIntervals(intervals: Array<IActivityIntervalW | IActivityIntervalP | IActivityIntervalPW | IActivityIntervalL>) {
		this.header.intervals = [];
		this.header.intervals.push(...this.intervalP, this.intervalPW, ...intervals, this.intervalW);
		this.intervalL = <Array<ActivityIntervalL>>this.header.intervals.filter(i => i.type === "L");
		this.hasImportedData = this.intervalL.hasOwnProperty('length') && this.intervalL.length > 0;
	}

	hasImport():boolean {
		return this.intervals.L.length > 0;
	}

	completeInterval(interval: IActivityIntervalL | IActivityIntervalP | IActivityIntervalG | ActivityIntervalU) {
		//this.header.intervals.push(interval);
		switch (interval.type) {
			case 'U': {
				this.intervalU.push(<ActivityIntervalU>interval); //= <Array<IActivityIntervalL>>this.header.intervals.filter(i => i.type === "U");
				break;
			}
			case 'P': {
				//this.intervalP.push(<IActivityIntervalP>interval);// = <Array<IActivityIntervalP>>this.header.intervals.filter(i => i.type === "P");
				this.calculateInterval('pW');
				break;
			}
			case 'G': {
				this.intervalG.push(<ActivityIntervalG>interval);
				break;
			}
		}
	}

	calculateInterval(type: string) {
		switch (type) {
			/**case 'pW': {
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
				this.intervalPW = <ActivityIntervalPW>intervalPW;
				this.intervalPW.movingDurationApprox = this.intervalP.some(i => i.movingDurationApprox);
				this.intervalPW.distanceApprox = this.intervalP.some(i => i.distanceApprox);
				break;
			}**/
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
	prepare() {
		super.prepare();
		// Заголовок тренировки
		this.header = new ActivityHeader(this.item.activityHeader);
		// Интервалы тренировки
		this.intervals = new ActivityIntervals(this.header.intervals.length > 0 && this.header.intervals || undefined);
		// Детали тренировки
		this.details = new ActivityDetails();

		this.updateIntervals();
	}

	updateIntervals(){
		// Ссылки на интервалы для быстрого доступа
		this.intervalPW = <ActivityIntervalPW>this.intervals.PW;
		this.intervalW = <ActivityIntervalW>this.intervals.W;
		this.intervalP = <Array<ActivityIntervalP>>this.intervals.P;
		this.intervalG = <Array<ActivityIntervalG>>this.intervals.G;
		this.intervalL = <Array<ActivityIntervalL>>this.intervals.L;
		this.intervalU = <Array<ActivityIntervalU>>this.intervals.U;
	}

	get actualDataIsImported(){
		return this.intervalW.actualDataIsImported || false;
	}

	// Подготовка данных для передачи в API
	build(userProfile?: IUserProfileShort):ICalendarItem {
		super.package();
		this.dateEnd = this.dateStart;
		//this.header = this.header.build();
		this.header.activityType = getType(Number(this.header.activityType.id));
		//this.header.activityCategory = this.categoriesList.filter(c => c.id === this.category)[0] || null;
		//this.header.intervals = this.intervals.build();
		//this.header.intervals.push(...this.intervalP, this.intervalPW, this.intervalW); //, ...this.intervalL

		return {
			//index: this.index,
			calendarItemId: this.calendarItemId,
			calendarItemType: this.calendarItemType, //activity/competition/event/measurement/...,
			revision: this.revision,
			dateStart: this.dateStart, // timestamp даты и времени начала
			dateEnd: this.dateEnd, // timestamp даты и времени окончания
			userProfileOwner: userProfile || this.userProfileOwner,
			userProfileCreator: this.userProfileCreator,
			//userProfileCreator: IUserProfileShort,
			activityHeader: Object.assign(this.header.build(), {intervals: this.intervals.build()})
		};
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

	get category():IActivityCategory {
		return this.header.hasOwnProperty('activityCategory') && this.header.activityCategory;
	}

	set category(c: IActivityCategory) {
		this.header.activityCategory = c;
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
		return this.intervalW && this.intervalW.completed();
	}

	get structured() {
		return this.intervalP && this.intervalP.length > 0;
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
		return this.intervalPW && this.intervalPW.specified();
	}

	get bottomPanel() {
		return ((this.status === 'coming' &&
			((this.intervalPW.trainersPrescription && this.intervalPW.trainersPrescription.length > 0) ||
			(!this.structured && this.intervalPW.intensityMeasure) )) && 'plan') ||
			//(this.status === 'coming' && this.structured && 'segmentList') ||
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
		return this.intervalPW && this.intervalPW.percent();
	}

	printPercent() {
		return ((this.percent && this.completed) && `${this.percent.toFixed(0)}%`);
	}

	get id(){
		return this.header.activityId;
	}

	/**
	 * Перечень статусов тренировки
	 * 0) Шаблон - template
	 * 1) Запланирована, в будущем - coming
	 * 2) Запланирована, пропущена - dismiss
	 * 3) Запланирована, выполнена - complete
	 * 4) Запланирована, выполнена с допущением - complete-warn
	 * 5) Запланирована, выполнена с нарушением - complete-error
	 * 6) Не запланирована, выполнена - not-specified
	 * @returns {string}
	 */
	get status() {
		return this.isTemplate? 'template' : (
			!this.isToday ?
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
				|| (this.coming && 'coming')
		);
	}

	get durationValue(){
		return (!!this.durationMeasure && this[this.durationMeasure]) || null;
	}

	get durationMeasure() {
		return (this.intervalPW && this.intervalPW.durationMeasure)
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

	get movingDuration():number {
		return this.intervalW.movingDuration() ||
			(this.structured && this.intervalPW.movingDurationLength) ||
			(this.intervalPW.durationMeasure === 'movingDuration' && this.intervalPW.durationValue) || null;
	}

	get movingDurationApprox():boolean {
		return !!!this.intervalW.movingDuration() && this.intervalPW.movingDurationApprox;
	}

	get duration() {
		return this.intervalW.movingDuration() ||
			(this.structured && this.intervalPW.movingDurationLength) ||
			(this.intervalPW.durationMeasure === 'movingDuration' && this.intervalPW.durationValue) || null;
	}

	get distance() {
		return this.intervalW.distance() ||
			(this.structured && this.intervalPW.distanceLength) ||
			(this.intervalPW.durationMeasure === 'distance' && this.intervalPW.durationValue) || null;
	}

	get distanceApprox():boolean {
		return !!!this.intervalW.distance() && this.intervalPW.distanceApprox;
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
	formChart():Array<Array<number>>{
		return this.intervalP && this.intervals.chart() || null;
	}

	setCategoriesList (categoriesList: Array<IActivityCategory>, userProfile: IUserProfile) {
		this.categoriesList = categoriesList;
		this.categoriesByOwner = pipe(
			orderBy(prop('sortOrder')),
			groupBy(getOwner(userProfile))
		) (categoriesList);
	}
}

export default Activity;