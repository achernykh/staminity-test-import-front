import {IActivityHeader, IActivityDetails,IActivityIntervalW, ICalcMeasures} from "../../../api/activity/activity.interface";
import moment from 'moment/src/moment.js';

class ActivityDatasource {

	private intervalW: IActivityIntervalW;
	private calcMeasures: ICalcMeasures;
	//private measureMain: Array<>;

	constructor(
		private method,
		private header:IActivityHeader,
		private details:IActivityDetails) {

		this.intervalW = <IActivityIntervalW>this.header.intervals.filter(interval => interval.type === "W")[0];
		this.calcMeasures = this.intervalW.calcMeasures;
		//this.measureMain = [this.calcMeasures.elevationGain, this.calcMeasures.elevationLoss];

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

	getMeasuresMain() {
		return [this.calcMeasures.elevationGain, this.calcMeasures.elevationLoss];
	}

}

export default ActivityDatasource;