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
        //if (selection.length) {
        //    [this.startTimeSt, this.stopTimeSt] = selection;
        //}
        //.lng = data.measures.longitude.idx; // lng index in array
        //this.lat = data.measures.latitude.idx; // lat index in array
        //this.time = data.measures.timestamp.idx; // time index in array
        //this.coordinates = this.buildCoors(data.metrics); // массив координат [шир, долг]
        //this.geoCoordinates = this.buildCoors(data.metrics, true); // массив объектов координат
        //this.selectCoordinates = this.buildSelection(data.metrics); // массив объектов выбранных координат
        //this.markers = this.buildMarkers(); // маркеры - иконки
        //this.paths = this.buildPaths(); // построение графиков
        //Добавляю на карту слои
        /*this.layers = {
            baselayers: {
                xyz: {
                    name: 'OpenStreetMap (XYZ)',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
        };*/

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

    buildPaths() {
        return {
            // формирую основной маршрут для карты.
            mainPath: {
                "color": "#f81a2b",
                "weight": 2,
                "latlngs": this.geoCoordinates,
                "message": "<h3>Основной маршрут</h3>"
            },
            // формирую выбранный отрезок на карте
            selectedPath: {
                "color": "#bb39db",
                "weight": 3,
                "latlngs": this.startTimeSt ? this.selectCoordinates : [],
                "message": "<h3>Выбранный маршрут</h3>"
            }
        };
    }

    buildSelection(data) {
        //TODO: how the fuc refactor this shit??
        /**
         * фильтую массив данных по временному интервалу
         * @param data {Array} массив с необработанными данными metrics
         * @type {Array}
         */
        let a = [];
        data.map((stamp) => {
            // если текущая запись попадавет во временной интерва, заданный ранее
            if ((stamp[this.time] >= this.startTimeSt) && (stamp[this.time] <= this.stopTimeSt)) {
                //формиру Гео_объект и кладу в массив
                a.push({lng: stamp[this.lng], lat: stamp[this.lat]});
            }
        });
        return a;
    }

    /**
     * формирует массив из координат или гео-координат
     * @param data{Array} Список массивов [x,y], или геоОбъектов {lng:x, lat:y}
     * @param geo Boolean, переключатель типа
     * @returns {Map|U[]|Uint8Array|any|Int8Array|Int32Array}
     */
    buildCoors(data, geo = false) {
        // собираю массив координат / объектов координат
        return data.map((stamp) => geo ? {
            lng: stamp[this.lng],
            lat: stamp[this.lat]
        } : stamp.filter((_, index) => (index === this.lng || index === this.lat)));
    }

    buildMarkers() {
        // маркеры начала и конца отрезка
        return {
            m1: {
                lat: this.coordinates[0][0],
                lng: this.coordinates[0][1],
                message: "Начало маршрута",
                focus: false,
                icon: {
                    iconUrl: 'assets/images/power-button.svg',
                    iconSize: [20, 20], // size of the icon
                    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
                    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
                }
            },
            m2: {
                lat: this.coordinates[this.coordinates.length - 1][0],
                lng: this.coordinates[this.coordinates.length - 1][1],
                message: "Конец маршрута",
                focus: false,
                icon: {
                    iconUrl: 'assets/images/racing.svg',
                    iconSize: [20, 20], // size of the icon
                    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
                    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
                }
            }
        };
    }




}

export default ActivityRouteDatamodel;