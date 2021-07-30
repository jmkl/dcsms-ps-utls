const { getToken, getTokenFor } = require("./js/Token.js")
const btnGroupMain = document.getElementById("btn-main-group");
const dropdown = document.querySelector(".template-items");
const btnadjustment = document.querySelector("#btn-adjustment")
const btncurves = document.getElementById("curves");
const btncolorBalance = document.getElementById("colorBalance");
const btnexposure = document.getElementById("exposure");
const btnhueSaturation = document.getElementById("hueSaturation");
const btnoilPaint = document.getElementById("oilPaint");
const btnArrange = document.getElementById("arrange");
const trigger = document.querySelector(".trigger");
const wrapper = document.querySelector(".wrapper");
const tooltip = document.querySelector(".tooltip");


let savepathtoken = null;
document.addEventListener("mousemove", async(e) => {

})
trigger.addEventListener("mouseleave", (e) => {

});



function showsSaveDirStatus(message) { document.querySelector(".dir_info").innerHTML = message; }

(async() => {
    let token = await getToken(TOKEN.TEMPLATE, false, false);
    const templates = (await token.getEntries())
        .filter((tmplt) => tmplt.name.indexOf("psd") > 0);
    addElementToDropdown(templates)
})()
document.getElementById("content").value = "Lorem ipsum\r$dolor sit amet\rconsectetur adipisicing"


document.getElementById("btn-template").addEventListener("click", async(e) => {
    token = await getToken(TOKEN.TEMPLATE, false, false);
    console.log(token);
    const templates = (await token.getEntries())
        .filter((tmplt) => tmplt.name.indexOf("psd") > 0);
    addElementToDropdown(templates)
});


Array.from(document.querySelectorAll(".btn_main_panel")).forEach((btnMain) => {

    btnMain.addEventListener("click", async(e) => {
        switch (btnMain.id) {
            case "btn-select":
                bpmainSelectSubject();
                break;
            case "btn-paste":
                bpmainPaste();
                break;
            case "btn-save":
                bpmainSave();
                break;
            case "btn-explode":
                bpmainExplodeText();
                break;
            case "btn-create":
                bpmainCreateText(dropdown);
                break;
            case "btn-fit":
                await batchPlay(
                    [_alignhor(ALIGNME.VER), _alignhor(ALIGNME.HOR)], {
                        synchronousExecution: true,
                        modalBehavior: "fail",
                    }
                );

                bputilsFitLayer();
                break;
            case "btn-newdoc":
                await createNewDocument();
                document.dispatchEvent(new CustomEvent("donecreatingtext"))
                break;
            default:
                break;
        }
    });
});

async function addElementToDropdown(templates) {
    while (dropdown.firstChild)
        dropdown.removeChild(dropdown.firstChild);
    await templates.forEach((tmplt) => {
        const element = document.createElement("sp-menu-item");
        element.classList = "dropdown-item";
        element.value = tmplt.name;
        element.innerText = tmplt.name.replace(".psd", "").toUpperCase();
        dropdown.appendChild(element);
    });
    dropdown.selectedIndex = 0;
    template = dropdown.childNodes[0].value;
}



let topx = 0;
async function moveLayer(layer) {
    const lyr = await layer.boundsNoEffects;
    await layer.nudge(-lyr.left, (-lyr.top) + topx)
    topx = await lyr.bottom - await lyr.top;



}
btncurves.addEventListener("click", async(e) => await adjustMe("curves"))
btncolorBalance.addEventListener("click", async(e) => await adjustMe("colorBalance"))
btnexposure.addEventListener("click", async(e) => await adjustMe("exposure"))
btnhueSaturation.addEventListener("click", async(e) => await adjustMe("hueSaturation"))
btnoilPaint.addEventListener("click", async(e) => await oilPaintMeBitch())
btnArrange.addEventListener("click", async(e) => {

    const lyr = await app.activeDocument.layers;
    const texts = []
    let totalheight = 0;
    for (l of lyr) {
        if (l.name == "dcsmstext_tamper") {
            texts.push(l);
            totalheight += l.boundsNoEffects.bottom - l.boundsNoEffects.top;

        }
    }

    texts.sort((a, b) => b.boundsNoEffects.top - a.boundsNoEffects.top).reverse();
    let top = (720 - totalheight) / 2;
    for (l of texts) {

        top += await movealltext_id(l, top);



    }


})


var accItem = document.getElementsByClassName('accordionItem');
var accHD = document.getElementsByClassName('accordionItemHeading');
for (i = 0; i < accHD.length; i++) {
    accHD[i].addEventListener('click', toggleItem, false);
}

const textitems = require("./js/panel/textitems.js")