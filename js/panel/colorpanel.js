const colorutils = require("./js/panel/colorutils.js");


// SECTION COLOR
const colorPreviewPanel = document.querySelector(".color-preview-panel");
const colorHistoryPanel = document.querySelector(".color-history-panel");
const sliderdistance = document.querySelector("#utility-slider-distance");
const sliderscale = document.querySelector("#utility-slider-scale");
const sliderhue = document.querySelector("#utility-slider-hue");
const mood = document.querySelector(".utility-mood");
const mode = document.querySelector(".utility-mode");
const mooditems = mood.querySelector(".utility-mood-items");
const modeitems = mode.querySelector(".utility-mode-items");
const controllerpanel = document.querySelector(".utility-controller-panel");
let activeLayer;

let distance = sliderdistance.value.mapme();
let hue = sliderhue.value;
let _mood = mooditems.children[mood.selectedIndex].value;
let _mode = modeitems.children[mode.selectedIndex].value;

const color = new colorutils.ColorUtils();
color.createColorScheme(colorPreviewPanel, _mode, distance, hue, _mood);

const ctrl_button = ["", "up", "", "left", "", "right", "", "down", ""];
ctrl_button.forEach((e) => {
    const ctrlButton = document.createElement("sp-action-button");
    ctrlButton.innerText = e;
    controllerpanel.appendChild(ctrlButton);
});
controllerpanel.children.forEach((e) => {
    if (e.innerText == "") {
        e.setAttribute("disabled");
    }
});
controllerpanel.children.forEach((c) => {
    var _timeoutId = 0;
    c.addEventListener("mousedown", async(e) => {
        const movevalue = 5;
        let moveme;
        switch (e.target.innerText) {
            case "up":
                moveme = [0, -movevalue]
                break;
            case "down":
                moveme = [0, movevalue]
                break;
            case "left":
                moveme = [-movevalue, 0]
                break;
            case "right":
                moveme = [movevalue, 0]
                break;
            default:
                break;
        }
        _timeoutId = setInterval(async function() {
            await app.activeDocument.activeLayers[0].nudge(moveme[0], moveme[1])
        }, 100);

    })
    c.addEventListener("mouseup", (e) => {
        clearInterval(_timeoutId);
    })
})

function initiateElementState() {
    const isInclude = ["triade", "tetrade", "analogic"].includes(_mode);
    isInclude
        ?
        sliderdistance.removeAttribute("disabled") :
        sliderdistance.setAttribute("disabled");
}

[sliderdistance, sliderhue, mood, mode].forEach((el) => {
    el.addEventListener("change", (e) => {
        distance = sliderdistance.value.mapme();
        hue = sliderhue.value;
        _mood = mooditems.children[mood.selectedIndex].value;
        _mode = modeitems.children[mode.selectedIndex].value;

        switch (el) {
            case sliderdistance:
                break;
            case sliderhue:
                break;
            case mood:
                break;
            case mode:
                initiateElementState();

                break;
            default:
                break;
        }
        color.createColorScheme(colorPreviewPanel, _mode, distance, hue, _mood);
    });
});
let sW, sH;
sliderscale.addEventListener("mousedown", async(e) => {

})

function calculateWidth(curvalue) {
    return ((1280 * curvalue) / sW) - 100;

}

function scale(number, outMin, outMax) {
    const inMin = 0,
        inMax = 100;
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

sliderscale.addEventListener("input", async(e) => {
    const layer = app.activeDocument.activeLayers[0];
    const l = layer.boundsNoEffects;
    sW = l.right - l.left;
    sH = l.bottom - l.top;
    if (sH < 100)
        sH = 100;
})
const scalefactor = 100;

function calculateHeight(curvalue) {
    return scale(curvalue, 0, (scalefactor / sH) * scalefactor);
}


sliderscale.addEventListener("change", async(e) => {


    const layer = app.activeDocument.activeLayers[0];
    const l = layer.bounds;
    const w = l.right - l.left;
    const h = l.bottom - l.top;

    const val = sliderscale.value;


    let calculate = (val < 0) ? -(calculateHeight(Math.abs(val))) : calculateWidth(val)

    await layer.scale(scalefactor + calculate, scalefactor + calculate);
    sliderscale.setAttribute("value", 0);
});
let marker = 0;
let arraydata = [];

function moveMarker(action, direction, arrdt) {
    if (!direction) {
        marker = (marker + 1) % arrdt.length;
    } else {
        marker = (marker + arrdt.length - 1) % arrdt.length;
    }
    action(arrdt[marker]);
}
const alltab = document.querySelectorAll(".sp-tab");

// SECTION Hotkey Event

document.addEventListener("keydown", async(event) => {

    if (event.key == "`") {
        moveMarker(async(button) => {
            button.click();
        }, false, alltab);
    }
    if (event.key == "F1") {
        document.getElementById("save").click();
    }
    if (event.key == "~") {

        if (arraydata.length > 0) {
            moveMarker(async(id) => {
                try {
                    doselectLayer(id);
                    activeLayer = await doc.activeLayers[0];

                } catch (error) {}
            }, true, arraydata);
        }

        if (arraydata.length == 0) {
            const layers = await app.activeDocument.layers;
            layers.forEach((layer) => {
                if (layer.name == "dcsmstext_tamper") {
                    arraydata.push(layer._id);
                }
            });
        }
    }
    if (["1", "2", "3", "4"].includes(event.key)) {
        console.log(parseInt((event.key).replace("F", "")) - 1)
        alltab[parseInt(event.key) - 1].click();
    }

});