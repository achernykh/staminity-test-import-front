export class ActionMessageService {

	constructor($mdToast){
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

ActionMessageService.$inject = ['$mdToast'];