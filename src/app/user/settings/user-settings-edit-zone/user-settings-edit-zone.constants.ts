export const calculationMethods = { 
    heartRate: [{ 
        type: "lactateThreshold", 
        method: ["JoeFrielHeartRateRunning7", "JoeFrielHeartRateCycling7"], 
    }, { 
        type: "restingAndMax", 
        method: ["Karvonen5"], 
    }, { 
        type: "max", 
        method: ["Yansen6"], 
    }, { 
        type: "custom", 
        method: ["5", "7", "9"], 
    }], 
    power: [{ 
        type: "powerThreshold", 
        method: ["AndyCoggan6"], 
    }, { 
        type: "custom", 
        method: ["5", "7", "9"], 
    }], 
    speed: [ 
        { 
            type: "paceThreshold", 
            method: ["JoeFrielSpeed7"], 
        }, { 
            type: "custom", 
            method: ["5", "7", "9"], 
        }, 
    ], 
}; 