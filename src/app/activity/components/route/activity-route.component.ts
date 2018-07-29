import {IComponentController, IComponentOptions, IScope} from "angular";
import {MapOptions, GeoJSON} from "leaflet";
import "./activity-route.component.scss";
import ActivityRouteDatamodel from "./activity-route.datamodel";

class ActivityRouteCtrl implements IComponentController {
    id: string;
    refresh: number;
    private data: Array<{lat: number, lng: number}>;
    private select: Array<{start: number, end: number}>;
    private options: MapOptions = {};
    private zoomEnabled: boolean;
    private map;
    private ready: boolean = false;

    static $inject = ["leafletData",'$element','$scope'];
    constructor(private leafletData: any, private $element: any, private $scope: IScope) {

    }

    $onChanges(change: any): void {
        if ((change.select && !change.select.isFirstChange()) ||
            (this.refresh > 1)) {
            setTimeout(() => this.$onInit(), 100);
        }
    }

    $onInit(): void {
        this.prepareData();
        this.prepareOptions();
        this.fitMap();
    }

    $postLink (): void {
        console.info('activity route: postLink route ctrl');
        this.$element.ready(() => {
            setTimeout(() => window.hasOwnProperty('ionic') && this.$onInit(), 1);
        });
    }

    private prepareData (): void {
        this.map = new ActivityRouteDatamodel(this.data, this.select);
    }

    private prepareOptions (): void {
        // показывать или нет панель зума
        this.options = {
            zoomControl: this.zoomEnabled,
            //paths: this.map.paths,
            //layers: this.map.layers,
            //markers: this.map.markers
        };
    }

    private fitMap (): void {
        this.leafletData.getMap(this.id)
            .then((map) => {
                map.fitBounds(this.select.length === 0 ?
                    this.map.route.map((e) => GeoJSON.coordsToLatLng([e.lng, e.lat])) :
                    this.map.selectCoordinates.map((e) => GeoJSON.coordsToLatLng([e.lng, e.lat])));
                setTimeout(_ => map.invalidateSize(), 1);
                //map.invalidateSize();
               // this.ready = true;
            }).then(_ => this.$scope.$applyAsync());
    }

}

const ActivityRouteComponent: IComponentOptions = {

    controller: ActivityRouteCtrl,
    template: `<leaflet id="{{$ctrl.id}}"
                        width="100%"
                        height="100%"
                        paths="$ctrl.map.paths"
                        layers="$ctrl.map.layers"
                        markers="$ctrl.map.markers"
                        defaults="$ctrl.options"></leaflet>`,
    bindings: {
        id: "<",
        data: "<",
        select: "<",
        refresh: "<",
        zoomEnabled: "<",
        layerEnabled: "<",
    },
};

export default ActivityRouteComponent;
