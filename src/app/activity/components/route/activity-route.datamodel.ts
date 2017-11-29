import {IComponentController} from "angular";

class ActivityRouteDatamodel implements IComponentController {
    private lng;
    private lat;
    private time;
    private coordinates;
    private geoCoordinates;
    private markers;
    private route;
    private intervalCoordinates: any[] = [];
    private selectCoordinates: any[] = [];
    private selectedPath: {} = null;
    private startTimestamp;
    private endTimestamp;
    private paths;
    private layers;

    constructor(data: any[], selection: any[] = []) {

        this.route = data.map((d) => ({lng: d["lng"],lat: d["lat"]}));
        this.startTimestamp = (selection.length > 0 && selection[0].startTimestamp) || null;
        this.endTimestamp = (selection.length > 0 && selection[0].endTimestamp) || null;

        Object.assign(this, {
            layers : {
                baselayers: {
                    xyz: {
                        name: "OpenStreetMap (XYZ)",
                        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        type: "xyz",
                    },
                },
            },
            markers: {
                m1: {
                    lat: data[0]["lat"],
                    lng: data[0]["lng"],
                    message: "Начало маршрута",
                    focus: false,
                    icon: {
                        iconUrl: "assets/picture/power-button.svg",
                        iconSize: [20, 20], // size of the icon
                        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
                    },
                },
                m2: {
                    lat: data[data.length - 1]["lat"],
                    lng: data[data.length - 1]["lng"],
                    message: "Конец маршрута",
                    focus: false,
                    icon: {
                        iconUrl: "assets/picture/racing.svg",
                        iconSize: [20, 20], // size of the icon
                        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
                    },
                },
            },
            paths: {
                mainPath: {
                    "color": "#f81a2b",
                    "weight": 4,
                    "latlngs": this.route,
                    "message": "<h3>Основной маршрут</h3>",
                },/*,
                // формирую выбранный отрезок на карте
                selectedPath: {
                    "color": "#bb39db",
                    "weight": 4,
                    "latlngs": selection.length > 0 ? this.selectCoordinates: [],
                    "message": "<h3>Выбранный маршрут</h3>"
                }*/
            },
        });

        selection.forEach((s,i) => {
            this.intervalCoordinates.push(...data
                .filter((d) => d.timestamp >= s.startTimestamp && d.timestamp <= s.endTimestamp));
            this.paths["selection #"+i] = {
                "color": "#bb39db",
                "weight": 4,
                "latlngs": this.intervalCoordinates,
                "message": "<h3>Выбранный маршрут</h3>",
            };
            this.selectCoordinates.push(...this.intervalCoordinates);
            this.intervalCoordinates = [];
        });

    }

}

export default ActivityRouteDatamodel;