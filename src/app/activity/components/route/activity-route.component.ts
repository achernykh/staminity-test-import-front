import {IComponentController, IComponentOptions} from "angular";
import {MapOptions, GeoJSON} from "leaflet";
import "./activity-route.component.scss";
import ActivityRouteDatamodel from "./activity-route.datamodel";

class ActivityRouteCtrl implements IComponentController {
    private data: Array<{lat: number, lng: number}>;
    private select: Array<{start: number, end: number}>;
    private options: MapOptions = {};
    private zoomEnabled: boolean;
    private map;

    static $inject = ["leafletData"];
    constructor(private leafletData: any) {

    }

    $onChanges(change: any): void {
        if ((change.select && !change.select.isFirstChange()) ||
            (change.refresh && !change.refresh.isFirstChange())) {
            setTimeout(() => this.$onInit(), 100);
        }
    }

    $onInit() {
        console.info('activity route: init route ctrl');
        this.map = new ActivityRouteDatamodel(this.data, this.select);
        // показывать или нет панель зума
        this.options.zoomControl = this.zoomEnabled;
        // центрирую карту по основному маршруту
        this.leafletData.getMap()
            .then((map) => {
                map.fitBounds(this.select.length === 0 ?
                    this.map.route.map((e) => GeoJSON.coordsToLatLng([e.lng, e.lat])) :
                    this.map.selectCoordinates.map((e) => GeoJSON.coordsToLatLng([e.lng, e.lat])));
                map.invalidateSize();
            })
            .then(_ => console.info('activity route: fit complete'));
    }

}

const ActivityRouteComponent: IComponentOptions = {

    controller: ActivityRouteCtrl,
    template: `<leaflet width="100%"
                        height="100%"
                        paths="$ctrl.map.paths"
                        layers="$ctrl.map.layers"
                        markers="$ctrl.map.markers"
                        defaults="$ctrl.options"></leaflet>`,
    bindings: {
        data: "<",
        select: "<",
        refresh: "<",
        zoomEnabled: "<",
        layerEnabled: "<",
    },
};

export default ActivityRouteComponent;
