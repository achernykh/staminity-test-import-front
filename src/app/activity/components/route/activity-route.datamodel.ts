import {IComponentController} from 'angular';

class ActivityRouteDatamodel implements IComponentController {
    private lng;
    private lat;
    private time;
    private coordinates;
    private geoCoordinates;
    private markers;
    private route;
    private selectCoordinates;
    private startTimeStamp;
    private endTimeStamp;
    private paths;
    private layers;

    constructor(data, selection) {

        this.route = data.map(d=>({lng: d['lng'],lat: d['lat']}));
        this.startTimeStamp = (selection.length > 0 && selection[0].startTimeStamp) || null;
        this.endTimeStamp = (selection.length > 0 && selection[0].endTimeStamp) || null;

        if (selection.length > 0) {
            this.selectCoordinates =
                data.filter(d => d.timestamp >= this.startTimeStamp && d.timestamp <= this.endTimeStamp);
        }

        Object.assign(this, {
            layers : {
                baselayers: {
                    xyz: {
                        name: 'OpenStreetMap (XYZ)',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    }
                }
            },
            markers: {
                m1: {
                    lat: data[0]['lat'],
                    lng: data[0]['lng'],
                    message: "Начало маршрута",
                    focus: false,
                    icon: {
                        iconUrl: 'assets/picture/power-button.svg',
                        iconSize: [20, 20], // size of the icon
                        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
                    }
                },
                m2: {
                    lat: data[data.length - 1]['lat'],
                    lng: data[data.length - 1]['lng'],
                    message: "Конец маршрута",
                    focus: false,
                    icon: {
                        iconUrl: 'assets/picture/racing.svg',
                        iconSize: [20, 20], // size of the icon
                        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
                    }
                }
            },
            paths: {
                mainPath: {
                    "color": "#f81a2b",
                    "weight": 4,
                    "latlngs": this.route,
                    "message": "<h3>Основной маршрут</h3>"
                },
                // формирую выбранный отрезок на карте
                selectedPath: {
                    "color": "#bb39db",
                    "weight": 4,
                    "latlngs": selection.length > 0 ? this.selectCoordinates: [],
                    "message": "<h3>Выбранный маршрут</h3>"
                }
            }
        });

    }

}

export default ActivityRouteDatamodel;