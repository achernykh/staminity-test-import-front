class LandingPageCtrl {
    constructor ($q, $log) {
        'ngInject';
        this._$log = $log;
        this._$q = $q;
    }
    $onInit(){
        //this._$log.debug('LandingPage: Initialisation', this);
    }
    $canActivate(){
        this._$log.debug('LandingPage: $canActivate');
        return true;
    }
    $onDestroy(){
        //this._$log.debug('LandingPage: Destroy');
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