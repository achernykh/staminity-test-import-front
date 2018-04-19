import {measureUnit, measureValue} from "../../../../share/measure/measure.functions";
const timeFormatter = function(d) {
    const hours = ~~(d / 3600);
    const minutes = ~~((d % 3600) / 60);
    const seconds = ~~(d % 60);
    let res = ((minutes < 10) ? "0" : "") + minutes + ":" + ((seconds < 10) ? "0" : "") + seconds;
    if (hours > 0) {
        res = hours + ":" + res;
    }
    return res;
};

const intFormatter = function(d) { return d.toFixed(0); };

//todo move to helper class
const LabelFormatters = {
    elapsedDuration: {
        formatter: (x, sport) => timeFormatter(x),
        label: (sport) => "",
    },
    duration: {
        formatter: (x, sport) => timeFormatter(x),
        label: (sport) => "",
    },
    distance:
    {
        formatter: (x, sport) => measureValue(x, sport, "distance"),
        label: (sport) => " " + measureUnit("distance", sport),
    },
    speed: {
        /*formatter: function (d) { return timeFormatter(d); },
        label: ' мин/км'*/
        formatter: (x, sport) => measureValue(x, sport, "speed"),
        label: (sport) => " " + measureUnit("speed", sport),
    },
    heartRate: {
        formatter: (x, sport) => measureValue(x, sport, "heartRate"),
        label: (sport) => " " + measureUnit("heartRate", sport),
    },
    cadence: {
        formatter: (x, sport) => measureValue(x, sport, "cadence"),
        label: (sport) => " " + measureUnit("cadence", sport),
    },
    strokes: {
        formatter: (x, sport) => measureValue(x, sport, "strokes"),
        label: (sport) => " " + measureUnit("strokes", sport),
    },
    power: {
        formatter: (x, sport) => measureValue(x, sport, "power"),
        label: (sport) => " " + measureUnit("power", sport),
    },
    altitude: {
        formatter: (x, sport) => measureValue(x, sport, "altitude"),
        label: (sport) => " " + measureUnit("altitude", sport),
    },
};

export default LabelFormatters;
