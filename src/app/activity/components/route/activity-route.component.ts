import {IComponentController, IComponentOptions} from "angular";
import {MapOptions} from "leaflet";
import "./activity-route.component.scss";
import ActivityRouteDatamodel from "./activity-route.datamodel";

class ActivityRouteCtrl implements IComponentController {
    private data: Array<{lat: number, lng: number}>;
    private select: Array<{start: number, end: number}>;
    private options: MapOptions = {};
    private zoomEnabled: boolean;
    private map;

    public static $inject = ["leafletData"];
    constructor(private leafletData: any) {

    }

    public $onChanges(change: any): void {
        if (!change.select.isFirstChange()) {
            this.$onInit();
        }
    }

    public $onInit() {
        this.map = new ActivityRouteDatamodel(this.data, this.select);
        // показывать или нет панель зума
        this.options.zoomControl = this.zoomEnabled;
        // центрирую карту по основному маршруту
        this.leafletData.getMap()
            .then((map) => {
                map.fitBounds(this.select.length === 0 ?
                    this.map.route.map((e) => L.GeoJSON.coordsToLatLng([e.lng, e.lat])) :
                    this.map.selectCoordinates.map((e) => L.GeoJSON.coordsToLatLng([e.lng, e.lat])));
                map.invalidateSize();
            });
    }

}

const ActivityRouteComponent: IComponentOptions = {

    controller: ActivityRouteCtrl,
    template: `<leaflet width="100%" height="20vh"
                        paths="$ctrl.map.paths"
                        layers="$ctrl.map.layers"
                        markers="$ctrl.map.markers"
                        defaults="$ctrl.options"></leaflet>`,
    bindings: {
        data: "<",
        select: "<",
        zoomEnabled: "<",
        layerEnabled: "<",
    },
};

export default ActivityRouteComponent;
