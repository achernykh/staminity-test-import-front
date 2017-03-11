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
        formatter: timeFormatter,
        label: '',
    },
    distance:
    {
        formatter: function (d) {
            let kms = d / 1000;
            return kms.toFixed(2);
        },
        label: ' км' 
    },
    speed: {
        formatter: function (d) { return timeFormatter(d); },
        label: ' мин/км'
    },
    heartRate: {
        formatter: intFormatter,
        label: ' чсс'
    },
    power: {
        formatter: intFormatter,
        label: ' ватт'
    },
    altitude: {
        formatter: intFormatter,
        label: ' м'
    }
};

export default LabelFormatters;