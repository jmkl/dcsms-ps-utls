const { Pexels, COL, ORIENTATION } = require("./js/panel/pexels.js");
const pexels = new Pexels();
const { MyWebSocket } = require("./js/panel/socket.js")
const md5 = require("./js/md5.js")
let pexelpaneltoken;
let searchEngine = null;
const SE = {
    pexels: "pexels",
    duckgo: "duckgo",
    google: "google"
}



//SECTION SEARCH
const searchImages = document.querySelector(".search-images");
const searchTextField = document.getElementById("search-textfield");
const loader = document.getElementById("search-loading");
const searchPanel = document.getElementById("search-panel");
const imagepreview = document.getElementById("image-preview");
const imagepreview_img = document.getElementById("image-preview-img");
const imageinfo = document.getElementById("image-info");
const imagedownload = document.getElementById("image-download");
const islarge = document.querySelector(".largeimage");

let enginemarker = 0;

function moveEngineMarker(action, direction, arrdt) {
    if (!direction) {
        enginemarker = (enginemarker + 1) % arrdt.length;
    } else {
        enginemarker = (enginemarker + arrdt.length - 1) % arrdt.length;
    }
    action(arrdt[enginemarker]);
}
searchSwitch();

function searchSwitch(isup) {
    const engine = document.querySelectorAll(".searchengine");
    for (e of engine) {
        e.style.display = "none";
        islarge.style.display = "none";
    }
    moveEngineMarker(async(button) => {
        button.style.display = "block";
        searchEngine = button.getAttribute("engine");
        if (searchEngine == SE.google)
            islarge.style.display = "flex";
    }, isup, engine);
}

searchTextField.addEventListener("keyup", (e) => {
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        searchSwitch(e.key == "ArrowUp" ? true : false);
    } else if (e.key == "Enter") {
        searchTextField.setAttribute("disabled")
        doSearchImages(searchTextField.value)
    }
});
document.querySelector(".overlay").addEventListener("mouseout", (e) => {
    searchTextField.setAttribute("disabled")
})
document.querySelector(".overlay").addEventListener("dblclick", (e) => {

    searchTextField.removeAttribute("disabled")
    setTimeout(() => {
        searchTextField.focus();
    }, 10);


})
searchTextField.addEventListener("focus", async(e) => {
    if (pexelpaneltoken == undefined) {

        pexelpaneltoken = await getToken(TOKEN.IMAGES, false, false);
    }

})
searchTextField.addEventListener("mouseexit", (e) => {
    searchTextField.setAttribute("disabled")
})

function doLoadonSearch(isloading) {
    loader.style.display = isloading ? "block" : "none";
    searchPanel.style.visibility = isloading ? "hidden" : "visible";
    searchImages.style.visibility = isloading ? "hidden" : "visible";

}

function doSearchImages(keyword) {

    doLoadonSearch(true);
    try {
        pexels.getImages(keyword, searchEngine, islarge.checked).then((result) => {
            doLoadonSearch(false);

            parseResult(result);
        })
    } catch (err) {
        console.log(err)
    }


}


function createImage(photo) {
    let thumb;
    let original;
    let detail;
    switch (searchEngine) {
        case "pexels":
            thumb = photo.src.tiny;
            original = photo.src.original;
            detail = `${photo.width} x ${photo.height} px`;
            break;
        case "duckgo":
            thumb = "https://external-content.duckduckgo.com/iu/?u=" + encodeURIComponent(photo.thumbnail);
            original = photo.image;
            detail = `${photo.width} x ${photo.height} px`;
            break;
        case "google":
            thumb = photo.thumbnail;
            original = photo.url;
            detail = `${photo.width} x ${photo.height} px`;
            break;
        default:
            break;
    }


    const div = document.createElement("figure");
    div.className = "search-img";
    const el = document.createElement("img");
    el.className = "thumbimage";
    el.setAttribute("value", original);
    el.setAttribute("info", detail)
    if (searchEngine == SE.duckgo) {
        el.setAttribute("dl-url", "https://external-content.duckduckgo.com/iu/?u=" + encodeURIComponent(original) + "&f=1&nofb=1")
    }
    el.src = thumb;
    div.appendChild(el)
    return div;
}

function parseResult(res) {
    while (searchImages.firstChild)
        searchImages.removeChild(searchImages.firstChild)
    const response = JSON.parse(res)
    const result = searchEngine == SE.pexels ? response.photos : response;

    for (let i = 0; i < result.length; i++) {
        const photo = result[i];
        const img = createImage(photo);
        searchImages.appendChild(img);
        img.addEventListener("click", async(event) => {
            imagepreview.style.display = "flex";
            imagepreview_img.setAttribute("src", event.target.getAttribute("src"))
            imagepreview_img.setAttribute("value", event.target.getAttribute("value"))
            imageinfo.innerText = event.target.getAttribute("info");
        })
    }
}
imagepreview_img.addEventListener("click", (e) => {
    imagepreview.style.display = "none";
})




async function imageDownloadListener(url) {

    if (pexelpaneltoken == null || pexelpaneltoken == undefined)
        pexelpaneltoken = await getToken(TOKEN.IMAGES, false, false);
    let imageurl = null;
    if (url == undefined)
        imageurl = searchEngine != SE.duckgo ? imagepreview_img.getAttribute("value") : "https://external-content.duckduckgo.com/iu/?u=" + encodeURIComponent(imagepreview_img.getAttribute("value")) + "&f=1&nofb=1";
    else
        imageurl = url;
    doLoadonSearch(true)
    const namafile = md5(imageurl) + ".jpg";
    try {
        console.log(await pexelpaneltoken.getEntry(namafile));
    } catch (err) {
        console.log(err)
    }


    await pexelpaneltoken.getEntry(namafile).then(async(response) => {
        console.log(response);
        placeImageonDocument(await fs.createSessionToken(response))
    }).catch(async(err) => {
        console.log(err);
        await fetch(imageurl).then((resp) => {

            if (!resp.ok) {
                throw new Error("Error :" + resp.status)
            }
            return resp.arrayBuffer();
        }).then(async(buffer) => {
            const newjpg = await pexelpaneltoken.createFile(namafile, { overwrite: true })
            await newjpg.write(buffer, { format: require('uxp').storage.formats.binary }).then(async(resp) => {

                const token = await fs.createSessionToken(newjpg);
                placeImageonDocument(token)
            })

        }).catch((er) => {
            doLoadonSearch(false);
            imagepreview.style.display = "none";
        })



    })
}
imagedownload.addEventListener("click", (e) => {
    imageDownloadListener()
})

async function placeImageonDocument(token) {
    await insertImage(token);
    await bputilsFitLayer(true);
    doLoadonSearch(false);
    imagepreview.style.display = "none";
    document.querySelector('.ws-status').style.background = "green";
}

const websocket = new MyWebSocket();
websocket.bind(document.querySelector('.ws-status'), imageDownloadListener)
document.querySelector('.ws-status').addEventListener('click', () => {
    websocket.bind(document.querySelector('.ws-status'), imageDownloadListener)

})