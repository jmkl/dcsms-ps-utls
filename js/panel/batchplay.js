var PhotoshopCore = require('photoshop').core;
async function runCommand(menuString) {
    await PhotoshopCore.performMenuCommand({
        title: PhotoshopCore.translateUIString(menuString)
    });
}
async function runCommandID(id) {
    await PhotoshopCore.performMenuCommand({
        commandID: id,
        kcanDispatchWhileModal: true,
        _isCommand: false
    });
}
async function runbatchPlay(...cmd) {
    return await batchPlay([...cmd], {
        "synchronousExecution": true,
        modalBehavior: "fail"
    })
}

class cmd {
    defwidth = 1280;
    constructor() {}
    static scaleAlgo(number) {
        const inMin = 1,
            inMax = 24,
            outMin = 50;
        return (number - inMin) * (1280 - outMin) / (inMax - inMin) + outMin;
    }
    static newDocument() {
        return {
            "_obj": "make",
            "new": {
                "_obj": "document",
                "artboard": false,
                "autoPromoteBackgroundLayer": false,
                "preset": "Thumbnail"
            },
            "_isCommand": true
        }
    }
    static selectSubject() {
        return {
            "_obj": "autoCutout",
            "sampleAllLayers": false,
            "_isCommand": true
        }
    }
    static getLayer(id) {
        return {
            "_obj": "get",
            "_target": [{
                "_ref": "layer",
                "_id": id
            }],
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }
    }
    static setTextSize(layerID, size) {
        return {
            "_obj": "set",
            "_target": [{
                "_ref": "property",
                "_property": "textStyle"
            }, {
                "_ref": "textLayer",
                "_id": layerID
            }],
            "to": {
                "_obj": "textStyle",
                "size": {
                    "_unit": "pixelsUnit",
                    "_value": size
                }
            },
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        };
    }

    static setText(layerID, text) {
        return {
            "_obj": "set",
            "_target": [{
                "_ref": "textLayer",
                "_id": layerID
            }],
            "to": {
                "_obj": "textLayer",
                "textKey": text,
            },
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }

    }

    static scaleLayer(percent) {
        return {
            "_obj": "transform",
            "_target": [{
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }],
            "freeTransformCenterState": {
                "_enum": "quadCenterState",
                "_value": "QCSAverage"
            },
            "width": {
                "_unit": "percentUnit",
                "_value": percent
            },
            "height": {
                "_unit": "percentUnit",
                "_value": percent
            },
            "linked": true,
            "interfaceIconFrameDimmed": {
                "_enum": "interpolationType",
                "_value": "bilinear"
            },
            "_isCommand": true
        }
    }

    static alignTexts(whereto, tocanvas) {
        return {
            "_obj": "align",
            "_target": [{
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }],
            "using": {
                "_enum": "alignDistributeSelector",
                "_value": whereto
            },
            "alignToCanvas": tocanvas,
            "_isCommand": true
        }
    }
    static selectLayerByName(layerName) {

        return {
            "_obj": "select",
            "_target": [{
                "_ref": "layer",
                "_name": layerName
            }],
            "makeVisible": true,
            "_isCommand": true
        }
    }
    static selectLayer(layerID) {
        console.log(layerID);
        return {
            "_obj": "select",
            "_target": [{
                "_ref": "textLayer",
                "_id": layerID
            }],
            "makeVisible": true,
            "_isCommand": true
        }
    }
    static moveLayer(top, left) {
        return {
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
                    "_value": left
                },
                "vertical": {
                    "_unit": "pixelsUnit",
                    "_value": top
                }
            },
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }
    }
    static showLayer() {
        return {
            "_obj": "show",
            "null": [{
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }],
            "_isCommand": true
        }
    }

    static selectNoLayer() {
        return {
            "_obj": "selectNoLayers",
            "_target": [{
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }],
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }
    }

    static selectLayers(ids) {

        const mapids = ids.map(function(data) {
            var obj = {};
            obj['_ref'] = 'layer';
            obj['_id'] = data;
            return obj;
        })
        return {
            "_obj": "select",
            "_target": mapids,
            "selectionModifier": {
                "_enum": "selectionModifierType",
                "_value": "addToSelectionContinuous"
            },

        }
    }
    static applyEffectMinimum() {
        return {
            "_obj": "minimum",
            "radius": {
                "_unit": "pixelsUnit",
                "_value": 1
            },
            "preserveShape": {
                "_enum": "preserveShape",
                "_value": "squareness"
            },
            "_isCommand": true
        }
    }
    static createMask() {
        return {
            "_obj": "make",
            "new": {
                "_class": "channel"
            },
            "at": {
                "_ref": "channel",
                "_enum": "channel",
                "_value": "mask"
            },
            "using": {
                "_enum": "userMaskEnabled",
                "_value": "revealSelection"
            },
            "_isCommand": true
        }
    }
    static insertClipboard() {
        return {
            _obj: "paste",
            antiAlias: {
                _enum: "antiAliasType",
                _value: "antiAliasNone",
            },
            as: {
                _class: "pixel",
            },
            _isCommand: true,
        }
    }
    static insertTemplate(token) {
        return [{
                _obj: "placeEvent",
                target: {
                    _path: token,
                    _kind: "local",
                },
            },
            {
                _obj: "placedLayerConvertToLayers",
                _isCommand: true,
            }
        ]
    }

}
module.exports = {
    runbatchPlay,
    cmd,
    runCommand,
    runCommandID
}