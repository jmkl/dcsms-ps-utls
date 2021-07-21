(async() => {
    const batchPlay = require("photoshop").action.batchPlay;

    const result = await batchPlay(
        [{
            "_obj": "move",
            "_target": [{
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }],
            "to": {
                "_obj": "offset",
                "horizontal": {
                    "_unit": "pixelsUnit",
                    "_value": 0
                },
                "vertical": {
                    "_unit": "pixelsUnit",
                    "_value": 600
                }
            },
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }], {
            "synchronousExecution": false,
            "modalBehavior": "fail"
        });

})()