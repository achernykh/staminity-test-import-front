class LandingPageCtrl {
    constructor ($q, $log, $http) {
        'ngInject';
        this._$log = $log;
        this._$q = $q;
	    this._$http = $http;
    }
    $onInit(){
        //this._$log.debug('LandingPage: Initialisation', this);
	    /**
	     * POST
	     /3.0/lists/9e67587f52/members/
	     224d40e5a0

	     {
    "email_address": "urist.mcvankab@freddiesjokes.com",
    "status": "subscribed",
    "merge_fields": {
        "FNAME": "Urist",
        "LNAME": "McVankab"
    }
}

	     API = 5b2404f300d5d106c68325a849b57b02-us14

	     curl --request GET --url 'https://us14.api.mailchimp.com/3.0/' --user
	     'anystring:5b2404f300d5d106c68325a849b57b02-us14'

	     */

    }
    $canActivate(){
        this._$log.debug('LandingPage: $canActivate');
        return true;
    }
    $onDestroy(){
        //this._$log.debug('LandingPage: Destroy');
    }

	onSubscribe(email) {
		console.debug('onSubscribe: ', email);
		let mailchimp = 'https://us14.api.mailchimp.com/3.0/';
		let list = '224d40e5a0';
		let api = `https://us14.api.mailchimp.com/3.0/lists/224d40e5a0/members/`;
		this._$http.post(api,
			{
				"email_address": email,
				"status": 'subscribed'
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Auth-Token': "username 5b2404f300d5d106c68325a849b57b02-us14",
					'Authorization': "username 5b2404f300d5d106c68325a849b57b02-us14",
					'Authorized': "username 5b2404f300d5d106c68325a849b57b02-us14"
				},
			}
		).then(
			(success) => {
				console.debug('onSubscribe: ', api, success);
			},
			(error) => {
				console.error('onSubscribe: ', api, error);
			});
	}

    goTo(link){
        this.$router.navigate([link]);
    }
}

let LandingPage = {
    bindings: {
        view: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: LandingPageCtrl,
    templateUrl: "landingpage/landingpage.html"
};
export default LandingPage;