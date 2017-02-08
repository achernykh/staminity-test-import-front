import {IComponentController} from 'angular';

class ActivityRouteDatamodel implements IComponentController {
    private lng;
    private lat;
    private time;
    private coordinates;
    private geoCoordinates;
    private markers;
    private selectCoordinates;
    private startTimeSt;
    private stopTimeSt;
    private paths;
    private layers;

    constructor(data, selection = []) {

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
                    "latlngs": data,
                    "message": "<h3>Основной маршрут</h3>"
                },
                // формирую выбранный отрезок на карте
                selectedPath: {
                    "color": "#bb39db",
                    "weight": 4,
                    "latlngs": this.startTimeSt ? this.selectCoordinates : [],
                    "message": "<h3>Выбранный маршрут</h3>"
                }
            }
        });

    }

}

export default ActivityRouteDatamodel;