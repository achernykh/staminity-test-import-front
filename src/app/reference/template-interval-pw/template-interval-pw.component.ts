import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { maybe, prop } from '../../share/util.js';
import { measuresByCode, activityTypes } from '../reference.constants';
import './template-interval-pw.component.scss';


export class TemplateIntervalPWCtrl implements IComponentController {

	static $inject = ['$scope', '$mdSelect', '$mdDialog', '$translate', 'message', 'ReferenceService'];

	private interval;
	private activityType;
	private user;
	private ftpMode = false;
	private form: any;
	private mode: any;

	constructor (
		private $scope, 
		private $mdSelect,
		private $mdDialog, 
		private $translate,
		private message,
		private ReferenceService
	) {

	}

	get measures () {
		console.log('measuresByCode', measuresByCode);
		return measuresByCode[this.activityType.typeBasic] || [];
	}

	isInterval (measure) {
		return ['speed', 'heartRate', 'power'].indexOf(measure) !== -1;
	}

	getFTP (measure: string, sport: string = 'default') {
		let zones = this.user.trainingZones;
		return this.isInterval(measure)? 0 : 
			maybe(zones) (prop(measure)) (m => m[sport] || m['default']) (prop('FTP')) ();
	}

	log (msg, x) {
		console.log(msg, x);
		return x;
	}

	dump () {
		console.log('TemplateIntervalPWCtrl', this);
	}


    changeValue(key) {
        if(!!!key) {
            return;
        }

        //debugger;

        this.validateForm();
        if (this.ftpMode) {
        	this.completeFtpMeasure(key);
        } {
        	this.completeAbsoluteMeasure(key);
        }
        this.prepareDataForUpdate();
    }

    completeAbsoluteMeasure(key) {
        this.interval[key]['intensityLevelFrom'] = this.interval[key]['intensityLevelFrom'] * this.getFTP(key);
        this.interval[key]['intensityByFtpTo'] = this.interval[key]['intensityLevelTo'] * this.getFTP(key);
    }

    completeFtpMeasure(key) {
        this.interval[key]['intensityLevelFrom'] = this.interval[key]['intensityLevelFrom'] / this.getFTP(key);
        this.interval[key]['intensityLevelTo'] = this.interval[key]['intensityByFtpTo'] / this.getFTP(key);
    }

    prepareDataForUpdate() {
        this.interval.durationMeasure = (!!this.interval.distance['durationValue'] && 'distance') ||
            (!!this.interval.movingDuration['durationValue'] && 'movingDuration') || null;

        this.interval.durationValue =
            (this.interval[this.interval.durationMeasure] && this.interval[this.interval.durationMeasure]['durationValue']) || null;

        this.interval.intensityMeasure = (!!this.interval.heartRate['intensityLevelFrom'] && 'heartRate') ||
            (!!this.interval.speed['intensityLevelFrom'] && 'speed') ||
            (!!this.interval.power['intensityLevelFrom'] && 'power') || null;

        this.interval.intensityLevelFrom =
            (this.interval[this.interval.intensityMeasure] && this.interval[this.interval.intensityMeasure]['intensityLevelFrom']) || null;
        this.interval.intensityLevelTo =
            (this.interval[this.interval.intensityMeasure] && this.interval[this.interval.intensityMeasure]['intensityByFtpTo']) || null;

        this.interval.intensityByFtpFrom =
            (this.interval[this.interval.intensityMeasure] && this.interval[this.interval.intensityMeasure]['intensityLevelFrom']) || null;
        this.interval.intensityByFtpTo =
            (this.interval[this.interval.intensityMeasure] && this.interval[this.interval.intensityMeasure]['intensityLevelTo']) || null;
    }

    changeParam() {
        setTimeout(() => {
            this.validateForm();
        }, 100);
    }

    validateForm() {

        //console.log('check date',isFutureDay(this.form['dateStart'].$modelValue),this.AuthService.isActivityinterval());
        //console.log('check role date',isFutureDay(this.form['dateStart'].$modelValue) && this.AuthService.isActivityinterval());

        if (this.form.hasOwnProperty('interval_distance')) {
            this.form['interval_distance'].$setValidity('needDuration',
                this.form['interval_distance'].$modelValue > 0 ||
                this.form['interval_movingDuration'].$modelValue > 0 ||
                this.form['actual_distance'].$modelValue > 0 ||
                this.form['actual_movingDuration'].$modelValue > 0);

            this.form['interval_movingDuration'].$setValidity('needDuration',
                this.form['interval_distance'].$modelValue > 0 ||
                this.form['interval_movingDuration'].$modelValue > 0 ||
                this.form['actual_distance'].$modelValue > 0 ||
                this.form['actual_movingDuration'].$modelValue > 0);

            /*this.form['interval_heartRate'].$setValidity('needIntensity',
             this.form['interval_heartRate'].$modelValue[this.from] > 0 ||
             this.form['interval_speed'].$modelValue[this.from] > 0);

             this.form['interval_speed'].$setValidity('needIntensity',
             this.form['interval_heartRate'].$modelValue[this.from] > 0 ||
             this.form['interval_speed'].$modelValue[this.from] > 0);*/

            // Пользователь может указать или расстояние, или время
            this.form['interval_distance'].$setValidity('singleDuration',
                !(this.form['interval_distance'].$modelValue > 0 && this.form['interval_movingDuration'].$modelValue > 0));
            this.form['interval_movingDuration'].$setValidity('singleDuration',
                !(this.form['interval_distance'].$modelValue > 0 && this.form['interval_movingDuration'].$modelValue > 0));

            // Пользователь может указать только один парметр интенсивности
            if (this.form['interval_heartRate'] && this.form['interval_speed']) {
                this.form['interval_heartRate'].$setValidity('singleIntensity',
                    !(this.form['interval_heartRate'].$modelValue['intensityLevelFrom'] > 0 &&
                    this.form['interval_speed'].$modelValue['intensityLevelFrom'] > 0));
            }

            if (this.form['interval_speed'] && this.form['interval_heartRate']) {
                this.form['interval_speed'].$setValidity('singleIntensity',
                    !(this.form['interval_heartRate'].$modelValue['intensityLevelFrom'] > 0 &&
                    this.form['interval_speed'].$modelValue['intensityLevelFrom'] > 0));
            }
        }
    }
}


const TemplateIntervalPWComponent: IComponentOptions = {
	bindings: {
		interval: '<',
		activityType: '<',
		user: '<',
		mode: '<'
	},
	controller: TemplateIntervalPWCtrl,
	template: require('./template-interval-pw.component.html') as string
};


export default TemplateIntervalPWComponent;