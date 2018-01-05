const timeFormatter = function (d) {
    const hours = ~~(d / 3600);
    const minutes = ~~((d % 3600) / 60);
    const seconds = ~~(d % 60);
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
        formatter (d) {
            const kms = d / 1000;
            return kms.toFixed(2);
        },
        label: " км",
    },
    ftp: {
        formatter (d) { return d.toFixed(0); },
        label: " %",
    },
};

export default LabelFormatters;
