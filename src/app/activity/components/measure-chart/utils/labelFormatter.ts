import {measureValue, measureUnit} from "../../../../share/measure/measure.constants";
let timeFormatter = function(d) {
    let hours = ~~(d / 3600);
    let minutes = ~~((d % 3600) / 60);
    let seconds = ~~(d % 60);
    let res = ((minutes < 10) ? '0' : '') + minutes + ':' + ((seconds < 10) ? '0' : '') + seconds;
    if (hours > 0) {
        res = hours + ':' + res;
    }
    return res;
};

let intFormatter = function(d) { return d.toFixed(0); };

//todo move to helper class
const LabelFormatters = {
    elapsedDuration: {
        formatter: (x,sport) => timeFormatter(x),
        label: (sport) => '',
    },
    duration: {
        formatter: (x,sport) => timeFormatter(x),
        label: (sport) => '',
    },
    distance:
    {
        formatter: (x, sport) => measureValue(x,sport,'distance'),
        /*formatter: function (d) {
            let kms = d / 1000;
            return kms.toFixed(2);
        },
        label: ' км'*/
        label: (sport) => ' ' + measureUnit('distance',sport)
    },
    speed: {
        /*formatter: function (d) { return timeFormatter(d); },
        label: ' мин/км'*/
        formatter: (x, sport) => measureValue(x, sport,'speed'),
        label: (sport) => ' ' + measureUnit('speed',sport)
    },
    heartRate: {
        formatter: (x,sport) => measureValue(x,sport,'heartRate'),
        label: (sport) => ' ' + measureUnit('heartRate',sport)
    },
    power: {
        formatter: (x,sport) => measureValue(x,sport,'power'),
        label: (sport) => ' ' + measureUnit('power',sport)
    },
    altitude: {
        formatter: (x,sport) => measureValue(x,sport,'altitude'),
        label: (sport) => ' ' + measureUnit('altitude',sport)
    }
};

export default LabelFormatters;