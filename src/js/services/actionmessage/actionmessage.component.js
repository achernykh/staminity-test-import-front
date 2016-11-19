export class ActionMessageService {
	constructor($mdToast){
		'ngInject';
		this._$mdToast = $mdToast;
	}
	/**
	 *
	 * @param text
	 */
	simple(text){
		"use strict";
		this._$mdToast.show(
			this._$mdToast.simple()
				.textContent(text)
				.position("bottom center")
				.hideDelay(3000)
		);
	}
}