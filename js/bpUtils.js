const ALIGNME = {
    VER: "ADSCentersV",
    HOR: "ADSCentersH",
    TOP: "ADSTops",
    LEFT: "ADSLefts",
    RIGHT: "ADSRights",
    BOT: "ADSBottoms"
};
const TOKEN = {
    TEMPLATE: "Thumbnail Template",
    IMAGES: "Image Download",
    SAVE: "Save Location",
    NAUFAL: "Folder Naufal",
    REFLY: "Folder Refly",
    NENO: "Folder Neno",
    BATCHPLAY: "Folder BatchPlay"

};

function _get(id) {
    return {
        _obj: "get",
        _target: { _ref: "layer", _id: id },
    };
}

function _select(id) {

    return {
        _obj: 'select',
        _target: { _ref: 'layer', _id: id },
    }
}

function _selectname(name) {

    return {
        _obj: "select",
        _target: [{
            _ref: "layer",
            _name: name,
        }, ],
        makeVisible: true,
        _isCommand: true

    }
}

function _lock(lockme) {
    return {
        "_obj": "applyLocking",
        "_target": [{
            "_ref": "layer",
            "_enum": "ordinal",
            "_value": "targetEnum"
        }],
        "layerLocking": {
            "_obj": "layerLocking",
            "protectAll": lockme
        },
        "_isCommand": true
    }
}

function _alignhor(isH = ALIGNME.VER) {
    return {
        _obj: "align",
        _target: [{
            _ref: "layer",
            _enum: "ordinal",
            _value: "targetEnum",
        }, ],
        using: {
            _enum: "alignDistributeSelector",
            _value: isH,
        },
        alignToCanvas: true,
        _isCommand: true,
    };
}

function _move(id, val) {
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
        "offset": {
            "_obj": "offset",
            "horizontal": {
                "_unit": "pixelsUnit",
                "_value": 0
            },
            "vertical": {
                "_unit": "pixelsUnit",
                "_value": val
            }
        },
        "interfaceIconFrameDimmed": {
            "_enum": "interpolationType",
            "_value": "bilinear"
        },
        "_isCommand": true
    }
}

function _scale(persen) {
    return {
        _obj: "transform",
        _target: [{
            _ref: "layer",
            _enum: "ordinal",
            _value: "targetEnum",
        }, ],
        freeTransformCenterState: {
            _enum: "quadCenterState",
            _value: "QCSAverage",
        },
        offset: {
            _obj: "offset",
            horizontal: {
                _unit: "pixelsUnit",
                _value: 0,
            },
            vertical: {
                _unit: "pixelsUnit",
                _value: 0,
            },
        },
        width: {
            _unit: "percentUnit",
            _value: persen,
        },
        height: {
            _unit: "percentUnit",
            _value: persen,
        },
        linked: true,
        interfaceIconFrameDimmed: {
            _enum: "interpolationType",
            _value: "bicubicAutomatic",
        },
        _isCommand: true,
    };
}

function _maketext(mytext, mstyle = null) {

    const theText = mytext;
    const defaultstyle = {
        _obj: "textStyle",
        styleSheetHasParent: true,
        fontPostScriptName: "BebasNeuePro-Bold",
        fontName: "Bebas Neue Pro",
        fontStyleName: "Bold",
        fontAvailable: true,
        tracking: -40,
        impliedFontSize: {
            _unit: "pixelsUnit",
            _value: 120,
        },
        fontCaps: {
            _enum: "fontCaps",
            _value: "allCaps",
        },
        color: {
            _obj: "RGBColor",
            red: 255,
            green: 255,
            blue: 255,
        },
    };
    if (mstyle == null) mstyle = defaultstyle;
    return {
        _obj: "make",
        _target: [{
            _ref: "textLayer",
        }, ],
        using: {
            _obj: "textLayer",
            name: "dcsmstext",
            textKey: theText,
            textStyleRange: [{
                _obj: "textStyleRange",
                from: 0,
                to: theText.length,
                textStyle: mstyle,
            }, ],
            _isCommand: true,
        },
    };
}

function _rename(text = "dcsmstext_tamper") {
    return {
        _obj: "set",
        _target: [{
            _ref: "layer",
            _enum: "ordinal",
            _value: "targetEnum",
        }, ],
        to: {
            _obj: "layer",
            name: text,
        },
        _isCommand: true,
    };
}

let iswidth = false;
async function bputilsFitLayer(forcewidth = false) {
    if (forcewidth) iswidth = true;

    const doc = await app.activeDocument;
    const dh = doc.height;
    const dw = doc.width;
    const activeLayer = doc.activeLayers;
    if (activeLayer[0].kind == 1 || activeLayer[0].kind == 5) {
        const { left, top, bottom, right } = activeLayer[0].bounds;
        const imgw = right - left;
        const imgh = bottom - top;
        if (iswidth) {
            await batchPlay([_scale((dw / imgw) * 100)], {
                synchronousExecution: true,
            });
            iswidth = false;
        } else {
            await batchPlay([_scale((dh / imgh) * 100)], {
                synchronousExecution: true,
            });
            iswidth = true;
        }
    }
}
async function CenterAlign() {
    return await batchPlay(
        [
            _selectname("colorfill"),
            _lock(false),
            _selectname("masterlayer"),
            _alignhor(),
            _alignhor(ALIGNME.HOR)
        ], {
            synchronousExecution: true,
            modalBehavior: "fail",
        }
    );
}

async function cekmultilinetext(activeLayer) {
    const result = await batchPlay(
        [{
            _obj: "get",
            _target: [{
                _ref: "layer",
                _name: activeLayer.name,
                _id: activeLayer._id,
            }, ],

            _options: {
                dialogOptions: "dontDisplay",
            },
        }, ], {
            synchronousExecution: true,
            modalBehavior: "fail",
        }
    );
    return result;
}
async function movealltext_id(text, top) {
    await batchPlay([
        _select(text._id),
        _alignhor(),
        _alignhor(ALIGNME.HOR),
        _alignhor(ALIGNME.TOP),
        _move(text._id, top),
    ], { synchronousExecution: true, modalBehavior: "fail" });

    return text.boundsNoEffects.bottom - text.boundsNoEffects.top;
}
async function movealltext(text, top) {
    await batchPlay([
        _select(text.layerID),
        _alignhor(),
        _alignhor(ALIGNME.HOR),
        _alignhor(ALIGNME.TOP),
        _move(text.layerID, top),
    ], { synchronousExecution: true, modalBehavior: "fail" });

    return text.boundsNoEffects.bottom - text.boundsNoEffects.top;
}
async function bputilsDoText(newtexts) {


    await AddText(newtexts);
    const allLayers = await app.activeDocument.layers;
    const textlayers = allLayers
        .filter((layer) => layer.name === "dcsmstext_tamper")
        .reverse();

    let top = 0;
    for (let t = 0; t < textlayers.length; t++) {
        const layer = await scaleTextSize(textlayers[t]);

        top += await movealltext(layer, top)
    }
    setTimeout(async() => {
        await _movelayers();
        await CenterAlign();
        const event = new CustomEvent('donecreatingtext');
        document.dispatchEvent(event);
    }, 2000);



}

async function getStyle(key) {
    return await batchPlay(
        [{
                _obj: "select",
                _target: [{
                    _ref: "layer",
                    _name: key,
                }, ],
                makeVisible: true,
                _isCommand: true,
                _options: {
                    dialogOptions: "dontDisplay",
                },
            },
            {
                _obj: "get",
                _target: [{
                    _ref: "layer",
                    _name: key,
                }, ],
                _options: {
                    dialogOptions: "dontDisplay",
                },
            },
        ], {
            synchronousExecution: true,
            modalBehavior: "execute",
        }
    );

}
async function insertImage(token) {
    return await batchPlay(
        [{
                _obj: "placeEvent",
                target: {
                    _path: token,
                    _kind: "local",
                },
            },
            _alignhor(), _rename("wtf")
        ], {
            synchronousExecution: true,
            modalBehavior: "fail",
        }
    );
}
async function insertTemplate(token) {
    return await batchPlay(
        [{
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
        ], {
            synchronousExecution: true,
            modalBehavior: "fail",
        }
    );
}

async function getDefaultText() {
    let items = []
    const test = await app.activeDocument.layers;
    test.forEach((obj) => {
        if (obj.name.includes("dcsmstext")) {
            items.push(obj);
        }
    })
    return items;

}
async function isNaufal() {
    const test = await app.activeDocument.layers;
    return (test.filter((obj) => obj.name.includes("dcsmstext_alt")).length > 0);
}
async function AddText(newtexts) {
    const defaulttext = await getDefaultText();
    const isnaufal = await isNaufal();


    const txtstyle = await findNestedObj(await getStyle("dcsmstext"), "textStyle");
    let txtstyle2 = null;
    if (isnaufal) {
        try {
            txtstyle2 = await findNestedObj(await getStyle("dcsmstext_alt"), "textStyle");
        } catch (error) {

        }
    }
    let newcommand = [];
    newtexts.forEach(async(text) => {
        try {
            if (isnaufal && text.includes("$")) {
                newcommand.push(_selectname("alt"));
                newcommand.push(_maketext(text.replace("$", ""), txtstyle2["textStyle"]));
            } else {
                newcommand.push(_selectname("core"));
                newcommand.push(_maketext(text, txtstyle["textStyle"]));
            }

            newcommand.push(_rename())
            newcommand.push(
                _alignhor(),
                _alignhor(ALIGNME.HOR),
                _alignhor(ALIGNME.TOP)
            );

        } catch (err) {


        }

    });
    defaulttext.forEach((txt) => {
        txt.delete()
    })


    const result = await batchPlay(newcommand, {
        synchronousExecution: true,
        modalBehavior: "fail",
    });

    return result;


}

function calculatesizeafter(w, h, percentage) {
    return [(percentage * w) / 100, (percentage * h) / 100];
}

function textsize(value) {
    return {
        "_obj": "set",
        "_target": [{
                "_ref": "property",
                "_property": "textStyle"
            },
            {
                "_ref": "textLayer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }
        ],
        "to": {
            "_obj": "textStyle",
            "textOverrideFeatureName": 808465458,
            "typeStyleOperationType": 3,
            "size": {
                "_unit": "pixelsUnit",
                "_value": value
            }
        },
        "_isCommand": true
    }
}
const defwidth = 1280;

function scaleAlgo(number) {
    const inMin = 1,
        inMax = 24,
        outMin = 50;
    return (number - inMin) * (defwidth - outMin) / (inMax - inMin) + outMin;
}
async function scaleTextSize(layer) {

    const result = await batchPlay([_get(layer._id)], {
        synchronousExecution: true,
        modalBehavior: "fail",
    });

    const l = result[0];
    // (1280/count)*3.04583723105706
    const _fs = result[0].textKey.textStyleRange[0].textStyle.size._value;
    const _w = (result[0].boundsNoEffects.width._value);
    const _txtcount = result[0].textKey.textStyleRange[0].to - 1;
    const sizer = (_txtcount < 19) ? scaleAlgo(_txtcount) : defwidth;
    const factor = _fs / (_w / _txtcount); //3.04583723105706

    const resultlayer = await batchPlay([_select(layer._id), textsize((sizer / _txtcount) * factor), _get(layer._id)], {
        synchronousExecution: true,
        modalBehavior: "fail",
    });
    return resultlayer[2];
}
async function scaleTextLayer() {
    const maxsize = 180;
    const layer = await app.activeDocument.activeLayers[0];

    const { left, top, bottom, right } = await layer.boundsNoEffects;
    const w = right - left;
    const h = bottom - top;
    const nw = (1240 / w) * 100;
    const nh = (720 / h) * 100;
    const maxh = (maxsize / h) * 100;
    const calc = calculatesizeafter(w, h, nw);
    //
    if (calc[1] > maxsize) {
        const pr = 0.7;
        layer.scale(maxh * pr, maxh * pr);
    } else {
        layer.scale(nw, nw);
    }
    return layer;

}

async function findNestedObj(entireObj, keyToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind]) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}

function getMaxName(ntries) {
    const files = ntries.filter(e => e.name.indexOf('psd') > 0);
    const names = []
    files.forEach(child => {
        const name = parseInt(child.name.replace('.psd', ''));
        if (!isNaN(name))
            names.push(name);
    })
    return Math.max(...names);
}

function cmdSavePSD(token) {
    return {
        "_obj": "save",
        "as": {
            "_obj": "photoshop35Format",
            "maximizeCompatibility": true
        },
        "in": {
            "_path": token,
            "_kind": "local"
        },
        "documentID": app.activeDocument._id,
        "lowerCase": true,
        "saveStage": {
            "_enum": "saveStageType",
            "_value": "saveBegin"
        },
        "_isCommand": false
    }
}

function cmdSave(token) {
    //const app = require('photoshop').app;
    return {
        "_obj": "save",
        "as": {
            "_obj": "JPEG",
            "extendedQuality": 10,
            "matteColor": {
                "_enum": "matteColor",
                "_value": "none"
            }
        },
        "in": {
            "_path": token,
            "_kind": "local"
        },
        "documentID": app.activeDocument._id,
        "copy": true,
        "lowerCase": true,
        "saveStage": {
            "_enum": "saveStageType",
            "_value": "saveBegin"
        },
        "_isCommand": false
    }
}


// async function getTokenFor(doc) {
//     return new Promise((resolve, reject) => {
//         layers = doc.layers;
//         layers.forEach(async(l) => {
//             if (l.name.toLowerCase().includes("naufal")) {
//                 resolve(TOKEN.NAUFAL);
//             } else if (l.name.toLowerCase().includes("refly")) {
//                 resolve(TOKEN.REFLY);
//             } else if (l.name.toLowerCase().includes("neno")) {
//                 resolve(TOKEN.NENO);
//             } else {
//                 resolve(null);
//             }

//         })
//     })


// }

function setRGB(r, g, b, color) {
    color.color.red = r;
    color.color.grain = g;
    color.color.blue = b;
    return color;
}


async function applySingleColor(c, isTop = true) {


    const result = await batchPlay(
        [{
            "_obj": "select",
            "_target": [{
                "_ref": "layer",
                "_name": "colorfill"
            }],
            "makeVisible": true,
            "_isCommand": true

        }, {
            "_obj": "applyLocking",
            "_target": [{
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }],
            "layerLocking": {
                "_obj": "layerLocking",
                "protectNone": true
            },
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }, {
            _obj: "get",
            _target: [{
                _ref: "layer",
                _name: "colorfill",
            }, ],
            makeVisible: false,
            _isCommand: true,
        }, ], {
            synchronousExecution: true,
            modalBehavior: "fail",
        }
    );

    const colors = await findNestedObj(result[2], "colors");
    setRGB(c[0], c[1], c[2], isTop ? colors.colors[0] : colors.colors[1]);


    try {
        await batchPlay(
            [{
                _obj: "set",
                _target: [{
                    _ref: "contentLayer",
                    _enum: "ordinal",
                    _value: "targetEnum",
                }, ],
                to: {
                    _obj: "gradientLayer",
                    angle: {
                        _unit: "angleUnit",
                        _value: 90,
                    },
                    type: {
                        _enum: "gradientType",
                        _value: "linear",
                    },
                    gradient: colors,
                },
                _isCommand: true,
                _options: {
                    dialogOptions: "dontDisplay",
                },
            }, ], {
                synchronousExecution: true,
                modalBehavior: "fail",
            }
        );
    } catch (error) {
        Logger(this.name, error)
    }


}

async function doselectLayer(layerid) {
    return await batchPlay(
        [{
            _obj: 'select',
            _target: { _ref: 'layer', _id: layerid },
        }], {
            "synchronousExecution": true,
            "modalBehavior": "fail"
        });

}
async function fxboxOilPainting() {
    await batchPlay(
        [{
            "_obj": "AdobeScriptAutomation Scripts",
            "javaScript": {
                "_path": "./js/jsx/oilpaint.jsx",
                "_kind": "local"
            },
            "javaScriptMessage": "undefined",
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }], {
            "synchronousExecution": false,
            "modalBehavior": "fail"
        });


}
async function _movelayers() {
    const layer = await app.activeDocument.layers.reverse();
    let top = 0;
    for (let x = 0; x < layer.length; x++) {
        const l = layer[x];
        if (l.kind == 3 && l.name == "dcsmstext_tamper") {

            top += await _movelayer(l, top)
        }

    }
}

async function _movelayer(layer, top) {

    const x = -layer.boundsNoEffects.left;
    const y = -layer.boundsNoEffects.top;
    const topx = (layer.boundsNoEffects.bottom - layer.boundsNoEffects.top) + 10;
    const resultx = await batchPlay(
        [_select(layer._id), {
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
                    "_value": x
                },
                "vertical": {
                    "_unit": "pixelsUnit",
                    "_value": y + top
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

    return topx;

}