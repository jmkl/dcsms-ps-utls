const { cmd, runbatchPlay } = require("./batchplay.js");

const textlists = document.querySelector(".textlist");

function createTextListItem(data) {
    const item = document.createElement("div");
    const _cblayer = document.createElement("sp-checkbox")
    item.className = "textlist-item";
    const textitem = document.createElement("sp-textfield");
    const textsize = document.createElement("div");
    textitem.className = "textitem";
    textitem.setAttribute("size", "XS")
    textsize.className = "textsize";
    textsize.classList.add(data[2].toString());
    textitem.type = "text";
    textsize.setAttribute("step", 4);
    textsize.innerText = Math.round(data[1]);
    textitem.setAttribute("value", data[0]);
    textitem.setAttribute("data-id", data[2]);
    _cblayer.setAttribute("id", "cb_" + data[2]);
    _cblayer.className = "cb_layer";
    textsize.setAttribute("data-id", data[2]);
    item.appendChild(_cblayer)
    item.appendChild(textitem);
    item.appendChild(textsize);
    textlists.appendChild(item);
    setTimeout(() => {
        textitem.focus();

    }, 100);
}

async function rearrangeLayer() {
    return;
    const layer = await app.activeDocument.layers;
    layer.sort((a, b) => b.bounds.top - a.bounds.top).reverse();
    let texts = []
    for (l of layer) {
        if (l.kind == 3 && l.name == "dcsmstext_tamper") {
            texts.push(l);
        }
    }
    for (let x = 0; x < texts.length; x++) {
        const l = texts[x];
        if (x > 0) {
            l.moveBelow(texts[x - 1])
        }
    }
}

async function initiateQueries(isdcsmstext) {
    isdcsmstext ? document.getElementById("content").classList.add("hide") : document.getElementById("content").classList.remove("hide");
    const _textsize = document.querySelectorAll(".textsize");
    const _textitem = document.querySelectorAll(".textitem");
    for (_ts of _textsize) {
        _ts.addEventListener("change", (e) => {

        });
        _ts.addEventListener("valuechangebud", async(e) => {
            const val = parseInt(e.target.innerText);
            const _id = parseInt(e.target.getAttribute("data-id"));
            try {
                await runbatchPlay(cmd.setTextSize(_id, val)).then((result) => {})

            } catch (err) {
                console.log(err);
            }
        });
    }

    let isrun = false;

    function waitforme(milisec) {
        return new Promise(resolve => {
            setTimeout(() => { resolve('') }, milisec);
        })
    }


    for (let x = 0; x < _textitem.length; x++) {
        _textitem[x].addEventListener("change", async(e) => {
            await runbatchPlay(cmd.setText(e.target.getAttribute("data-id"), e.target.value))
        });
        _textitem[x].addEventListener("keyup", (e) => {

            if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                const ev = new CustomEvent("valuechangebud");
                _textsize[x].dispatchEvent(ev);
            }
        });


        _textitem[x].addEventListener("keydown", async(e) => {
            if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                if (isrun)
                    return;
                isrun = true;
                const num = 2;
                if (e.key == "ArrowUp") {
                    _textsize[x].innerText = parseInt(_textsize[x].innerText) + num;
                } else if (e.key == "ArrowDown") {
                    _textsize[x].innerText = parseInt(_textsize[x].innerText) - num;
                }
                isrun = false;

            }


        });
    }
    rearrangeLayer();
    const activeLayers = await app.activeDocument.activeLayers;
    for (l of activeLayers) {
        if (l.kind == 3) {
            document.getElementById("cb_" + l._id).checked = true;
        }
    }
}

async function getLayerInfo(layer) {
    try {
        const result = await batchPlay([_get(layer._id)], {
            synchronousExecution: true,
            modalBehavior: "fail",
        });

        const text = result[0].textKey.textKey;
        const size = result[0].textKey.textStyleRange[0].textStyle.size._value;
        return [text, size, layer._id];
    } catch (err) {
        console.log(err);
    }
}

async function getTextLayerData() {
    let isdcsmstext = false;
    const layers = await app.activeDocument.layers;
    if (layers.length > 0) {
        while (textlists.firstChild) textlists.removeChild(textlists.firstChild);
    } else {
        return;
    }
    for (layer of layers.reverse()) {
        if (layer.kind == 3 && layer.name == "dcsmstext_tamper") {
            createTextListItem(await getLayerInfo(layer));
            isdcsmstext = true;
        }
    }
    initiateQueries(isdcsmstext);
}

getTextLayerData();
document.addEventListener("donecreatingtext", () => {
    getTextLayerData();
});

var listener = (e, d) => {
    if (e == "move") {
        rearrangeLayer();
    }
    if ((e == "select" && d._target[0]._ref == "document") || e == "close" || e == "delete") {
        try {
            getTextLayerData();
        } catch (err) {
            console.log(err);
        }
    }
};

require("photoshop").action.addNotificationListener(
    [
        { event: "select" },
        { event: "open" },
        { event: "make" },
        {
            event: "close"
        },
        {
            event: "save",
        },
        { event: "close" },
        { event: "delete" }, { event: "move" },
    ],
    listener
);
let _layerids = [];
(async() => {
    const _lyr = await app.activeDocument.layers;
    for (l of _lyr) {
        if (l.name == "dcsmstext_tamper") {
            _layerids.push(l._id);
        }
    }



})()

const buttonAlign = document.getElementById("btn-align");
const cb_align = document.createElement("sp-checkbox");
const divider = document.createElement("div")
divider.className = "btn-menu-divider";
["left", "mid", "right",
    "top", "midhor", "bottom",
    "resizemin", "resizemax", "fitimage", "paste", "explode", "save", "select", "create", "newdoc"
].forEach((str) => {
    const div = document.createElement("div");
    div.className = "btn-main-panel";
    div.setAttribute("id", str);
    const image = document.createElement("img");
    image.src = `icons/${str}.png`
    image.height = "18"

    const divider = document.createElement("div")
    divider.className = "btn-menu-divider";
    if (str == "fitimage" || str == "left")
        buttonAlign.appendChild(divider)
    buttonAlign.appendChild(div);
    div.addEventListener("click", async(e) => {
        const cb_layers = [...document.querySelectorAll(".cb_layer")].filter((e) => {

            if (e.checked) {
                return parseInt((e.getAttribute("id")).replace("cb_", ""));
            }

        })
        let alignmebitch = null;
        const currentactiveLayer = await app.activeDocument.activeLayers[0];
        switch (e.target.id) {
            case "left":
                alignmebitch = cmd.alignTexts(ALIGNME.LEFT, cb_align.checked);
                break;
            case "mid":
                alignmebitch = cmd.alignTexts(ALIGNME.HOR, cb_align.checked);
                break;
            case "right":
                alignmebitch = cmd.alignTexts(ALIGNME.RIGHT, cb_align.checked);
                break;
            case "top":
                alignmebitch = cmd.alignTexts(ALIGNME.TOP, cb_align.checked);
                break;
            case "midhor":
                alignmebitch = cmd.alignTexts(ALIGNME.VER, cb_align.checked);
                break;
            case "bottom":
                alignmebitch = cmd.alignTexts(ALIGNME.BOT, cb_align.checked);
                break;
            case "resizemin":


                alignmebitch = cmd.scaleLayer(95);
                break;
            case "resizemax":
                alignmebitch = cmd.scaleLayer(105);
                break;
            case "fitimage":

                const width = currentactiveLayer.bounds.right - currentactiveLayer.bounds.left;
                const height = currentactiveLayer.bounds.bottom - currentactiveLayer.bounds.top;
                let isWidth = width == 1280;

                await runbatchPlay(isWidth ? cmd.scaleLayer((720 / height) * 100) : cmd.scaleLayer((1280 / width) * 100),
                    cmd.alignTexts(ALIGNME.VER, true),
                    cmd.alignTexts(ALIGNME.HOR, true)
                )

                break;
            case "paste":
                await runbatchPlay(cmd.insertClipboard());
                break;
            case "select":
                await runbatchPlay(cmd.selectSubject(), cmd.createMask(), cmd.applyEffectMinimum())

                break;
            case "explode":
                if (currentactiveLayer.kind == 3) {
                    await runbatchPlay(cmd.getLayer(currentactiveLayer._id)).then(async(result) => {
                        const texts = (result[0].textKey.textKey).split("\r");
                        if (texts.length > 1) {
                            let top = 0;
                            for (text of texts) {
                                const newtext = await currentactiveLayer.duplicate();
                                newtext.name = currentactiveLayer.name;

                                try {
                                    const result = await runbatchPlay(cmd.setText(newtext._id, text));
                                    await runbatchPlay(cmd.selectLayer(newtext._id)).then(async() => {
                                        await runbatchPlay(cmd.moveLayer(top, 0));
                                        top += newtext.bounds.bottom - newtext.bounds.top;
                                    })


                                } catch (err) {
                                    console.log(err)
                                }

                            }
                            await currentactiveLayer.delete();
                        }

                    })

                }
                break;
            case "save":
                break;
            case "create":
                top_pos = 0;

                const index = dropdown.parentNode.selectedIndex;
                const template = dropdown.childNodes[index].value;
                const newtexts = document.getElementById("content").value.trim().split("\r").reverse();
                const token = await getToken(TOKEN.TEMPLATE)
                const theTemplate = await token.getEntry(template);
                const temptoken = fs.createSessionToken(theTemplate);
                const result = await runbatchPlay(...cmd.insertTemplate(temptoken)).then(async() => {

                    const layers = await app.activeDocument.layers;

                    for (let x = 0; x < layers.length; x++) {
                        const layer = layers[x];
                        if (layer.name == "dcsmstext") {

                            const texts = newtexts.filter((e) => !e.includes("$"));
                            console.log(texts);
                            await insertTexts(layer, texts)
                        } else if (layer.name == "dcsmstext_alt") {
                            const texts = newtexts.filter((e) => e.includes("$"));
                            await insertTexts(layer, texts)
                        }
                    }

                }).catch((error) => {
                    console.log(error)
                })


                //await bputilsDoText(newtexts);

                break;
            case "newdoc":
                await runbatchPlay(cmd.newDocument())
                break;
            default:
                break;
        }
        if (cb_layers.length > 0) {
            await runbatchPlay(cmd.selectNoLayer(), cmd.selectLayers(cb_layers.map((e) => parseInt(e.getAttribute("id").replace("cb_", "")))), alignmebitch)
        } else {
            if (alignmebitch) {
                await runbatchPlay(alignmebitch)
            }
        }
    });
    div.appendChild(image)

})
let top_pos = 0;
async function insertTexts(layer, newtexts) {

    for (txt of newtexts) {
        if (txt.includes("$")) txt = txt.replace("$", "")
        const newlayer = await layer.duplicate();
        newlayer.name = "dcsmstext_tamper";
        const result = await runbatchPlay(cmd.setText(newlayer._id, txt),
            cmd.getLayer(newlayer._id))
        console.log(result[1]);
        const _fs = result[1].textKey.textStyleRange[0].textStyle.impliedFontSize._value;
        const _w = (result[1].boundsNoEffects.width._value);
        const _txtcount = result[1].textKey.textStyleRange[0].to - 1;
        const sizer = (_txtcount < 19) ? cmd.scaleAlgo(_txtcount) : 1280;
        const factor = _fs / (_w / _txtcount); //3.04583723105706
        const newsize = ((sizer / _txtcount) * factor) - 10;
        await runbatchPlay(cmd.selectLayer(newlayer._id),
            cmd.setTextSize(newlayer._id, newsize),
            cmd.alignTexts(ALIGNME.TOP, true), cmd.alignTexts(ALIGNME.LEFT, true),
            cmd.getLayer(newlayer._id));
        await runbatchPlay(cmd.selectLayer(newlayer._id)).then(async() => {
            await runbatchPlay(cmd.showLayer(), cmd.moveLayer(top_pos, 0));
            top_pos += newlayer.boundsNoEffects.bottom - newlayer.boundsNoEffects.top;
        })

    }
    layer.delete();
}

cb_align.className = "cb-align";
cb_align.innerText = "to Canvas";
buttonAlign.appendChild(divider)
buttonAlign.appendChild(cb_align);


document.addEventListener("keydown", async(e) => {
    if (e.shiftKey) {
        if (e.key == "A")
            await runbatchPlay(cmd.scaleLayer(95));
        if (e.key == "S")
            await runbatchPlay(cmd.scaleLayer(105));
    }
})