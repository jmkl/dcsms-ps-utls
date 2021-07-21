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
async function bpmainSelectSubject() {

    return await batchPlay(
        [{
            _obj: "autoCutout",
            sampleAllLayers: true,
            _isCommand: true,
        }, ], {
            synchronousExecution: true,
            modalBehavior: "fail",
        }
    );
}
async function bpmainPaste() {
    return await batchPlay(
        [{
                _obj: "paste",
                antiAlias: {
                    _enum: "antiAliasType",
                    _value: "antiAliasNone",
                },
                as: {
                    _class: "pixel",
                },
                _isCommand: true,
            },
            _alignhor(ALIGNME.VER),
            _alignhor(ALIGNME.HOR),
        ], {
            synchronousExecution: true,
            modalBehavior: "fail",
        }
    );
}

async function bpmainExplodeText() {
    const activeLayer = await app.activeDocument.activeLayers[0];

    const gettemp = await batchPlay(
        [_get(activeLayer._id)], {
            synchronousExecution: true,
            modalBehavior: "fail",
        }
    );


    if (activeLayer.kind != 3) return;

    const result = await cekmultilinetext(activeLayer);

    const newtxt = result[0].textKey["textKey"].trim().split("\r");


    if (newtxt.length > 1) {

        await bputilsDoText(newtxt, findNestedObj(gettemp, "textStyle"));
    }
}

async function bpmainCreateText(dropdown) {

    const index = dropdown.parentNode.selectedIndex;
    const template = dropdown.childNodes[index].value;
    const newtexts = document.getElementById("content").value.trim().split("\r");
    const token = await getToken(TOKEN.TEMPLATE)
    const theTemplate = await token.getEntry(template);
    const temptoken = fs.createSessionToken(theTemplate);
    const result = await insertTemplate(temptoken);

    try {
        await bputilsDoText(newtexts);
    } catch (error) {
        Logger("bpmainCreateText", error)
    }




}


async function bpmainSave(resetme = false) {
    // const result = await showDialog("hello");
    // console.log(!result);
    // result.catch((e) => { console.log("error") })

    const doc = await app.activeDocument;
    savepathtoken = await getToken(await getTokenFor(doc), resetme, false);
    if (savepathtoken == undefined) {
        return;
    }


    showsSaveDirStatus(savepathtoken.nativePath);
    if (doc.title.includes("Untitled")) {
        let num = 0;
        let listfiles = getMaxName(await savepathtoken.getEntries())
        if (listfiles == -Infinity)
            listfiles = 0
        num = listfiles + 1;
        dosaveDocument(num);
    } else if (doc.title.includes(".psd")) {
        dosaveDocument(doc.title.replace(".psd", ""));
    }




}

async function dosaveDocument(namafile) {


    try {

        const newJPG = await savepathtoken.createFile(namafile + ".jpeg", { overwrite: true });
        const newPSD = await savepathtoken.createFile(namafile + ".psd", { overwrite: true });
        const saveJPEG = await fs.createSessionToken(newJPG);
        const savePSD = await fs.createSessionToken(newPSD);
        const result = await batchPlay([cmdSavePSD(savePSD), cmdSave(saveJPEG)], {
            "synchronousExecution": true,
            "modalBehavior": "fail"
        });
        if (result) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = async function() {
                    if (xhr.readyState == 4) {
                        const result = JSON.parse(xhr.response)
                        if (result) {

                            tooltip.setAttribute("open");
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    tooltip.removeAttribute("open");
                                    resolve(1);
                                }, 3000);
                            })

                        }
                    }
                }
                xhr.open('POST', 'http://localhost:5005');
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({ d: result[1].in._path }));
            } catch (error) {}

        }
    } catch (err) {
        Logger(this.name, error)
    }
}

function curves() {
    return {
        "_obj": "curves",
        "presetKind": {
            "_enum": "presetKindType",
            "_value": "presetKindDefault"
        }
    }
}

function exposure() {
    return {
        "_obj": "exposure",
        "presetKind": {
            "_enum": "presetKindType",
            "_value": "presetKindDefault"
        },
        "exposure": 0,
        "offset": 0,
        "gammaCorrection": 1
    }
}

function hueSaturation() {
    return {
        "_obj": "hueSaturation",
        "presetKind": {
            "_enum": "presetKindType",
            "_value": "presetKindDefault"
        },
        "colorize": false
    }
}


function colorBalance() {

    return {
        "_obj": "colorBalance",
        "shadowLevels": [
            0,
            0,
            0
        ],
        "midtoneLevels": [
            0,
            0,
            0
        ],
        "highlightLevels": [
            0,
            0,
            0
        ],
        "preserveLuminosity": true
    }


}

async function adjustMe(adjustment) {
    const adj = [curves(), colorBalance(), hueSaturation(), exposure()]
    const a = ["curves", "colorBalance", "hueSaturation", "exposure"];
    const result = await batchPlay(
        [{
            "_obj": "make",
            "_target": [{
                "_ref": "adjustmentLayer"
            }],
            "using": {
                "_obj": "adjustmentLayer",
                "type": adj[a.indexOf(adjustment)]
            },
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }, {
            "_obj": "groupEvent",
            "_target": [{
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }],
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }], {
            "synchronousExecution": true,
            "modalBehavior": "fail"
        });

}
async function oilPaintMeBitch() {
    // unsharp value 500 1000 255
    return await batchPlay(
        [{
            "_obj": "surfaceBlur",
            "radius": {
                "_unit": "pixelsUnit",
                "_value": 20
            },
            "threshold": 2,
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }, {
            "_obj": "unsharpMask",
            "amount": {
                "_unit": "percentUnit",
                "_value": 150
            },
            "radius": {
                "_unit": "pixelsUnit",
                "_value": 2
            },
            "threshold": 0,
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }, {
            "_obj": "oilPaint",
            "lightingOn": false,
            "stylization": 2, //10
            "cleanliness": 0.2, //10
            "brushScale": 0.1, //10
            "microBrush": 0, //10
            "lightDirection": -60,
            "specularity": 0,
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }], {
            "synchronousExecution": true,
            "modalBehavior": "fail"
        });

}


async function createNewDocument() {

    await batchPlay(
        [{
            "_obj": "make",
            "new": {
                "_obj": "document",
                "artboard": false,
                "autoPromoteBackgroundLayer": false,
                "preset": "Thumbnail"
            },
            "_isCommand": true,
            "_options": {
                "dialogOptions": "dontDisplay"
            }
        }], {
            "synchronousExecution": false,
            "modalBehavior": "fail"
        });

}