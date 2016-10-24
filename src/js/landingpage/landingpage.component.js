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

		/**
		 * curl --request POST \
		 --url 'https://usX.api.mailchimp.com/3.0/lists' \
		 --user 'anystring:apikey' \
		 --header 'content-type: application/json' \
		 --data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"MailChimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \
		 --include		 *
		 */


		console.debug('onSubscribe: ', email);
		let mailchimp = 'https://us14.api.mailchimp.com/3.0/';
		let list = '224d40e5a0';
		let api = `https://achernykh:5b2404f300d5d106c68325a849b57b02-us14@us14.api.mailchimp.com/3.0/lists/224d40e5a0/members/`;
		this._$http({
					method: 'POST',
					url: api,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'apikey 5b2404f300d5d106c68325a849b57b02-us14',
						user: 'achernykh:5b2404f300d5d106c68325a849b57b02-us14',
					},
					data: {
						email_address: email,
						status: 'subscribed'
					}
				}).then(
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