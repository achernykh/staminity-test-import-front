let timeFormatter = function(d) {
    let hours = ~~(d / 3600);
    let minutes = ~~((d % 3600) / 60);
    let seconds = ~~(d % 60);
    let res = ((minutes < 10) ? "0" : "") + minutes + ":" + ((seconds < 10) ? "0" : "") + seconds;
    if (hours > 0) {
        res = hours + ":" + res;
    }
    return res;
};

//todo move to helper class
const LabelFormatters = {
    movingDuration: {
        formatter: timeFormatter,
        label: "",
    },
    distance:
    {
        formatter: function (d) {
            let kms = d / 1000;
            return kms.toFixed(2);
        },
        label: " км", 
    },
    ftp: {
        formatter: function (d) { return d.toFixed(0); },
        label: " %",
    },
};

export default LabelFormatters;