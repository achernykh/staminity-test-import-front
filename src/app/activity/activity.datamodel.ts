import {
	IActivityHeader,
	IActivityDetails,
	IActivityIntervalW,
	IActivityIntervalL,
	IActivityMeasure,
	ICalcMeasures} from "../../../api/activity/activity.interface";
import moment from 'moment/src/moment.js';

class ActivityDatamodel {

	private intervalW: IActivityIntervalW;
	private intervalL: Array<IActivityIntervalL>;
	private calcMeasures: Array<IActivityMeasure> = [];
	private route: any;
	private isRouteExist: boolean;

	constructor(
		private method,
		private header:IActivityHeader,
		private details:IActivityDetails) {

		this.intervalW = <IActivityIntervalW>this.header.intervals.filter(i => i.type === "W")[0];
		this.intervalL = <Array<IActivityIntervalL>>this.header.intervals.filter(i => i.type === "L");

		Object.keys(this.intervalW.calcMeasures)
			.map((key, index) => this.calcMeasures.push(Object.assign(this.intervalW.calcMeasures[key],{code: key})));

		this.route = typeof this.details !== 'undefined' ? this.getRouteData(this.details) : null;
		this.isRouteExist = !!this.route;
		console.info('Datasource',this);
	}

	getRouteData(details) {

		if (!details.measures.hasOwnProperty('longitude') || !details.measures.hasOwnProperty('latitude')) {
			return null;
		}

		let lng = details.measures.longitude.idx; // lng index in array
		let lat = details.measures.latitude.idx; // lat index in array
		//let time = details.measures.timestamp.idx; // time index in array
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