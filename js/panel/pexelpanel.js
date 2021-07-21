const { Pexels, COL, ORIENTATION } = require("./js/panel/pexels.js");
const pexels = new Pexels();
const md5 = require("./js/md5.js")
let pexelpaneltoken;
let isPexel = true;




//SECTION SEARCH
const searchImages = document.querySelector(".search-images");
const searchTextField = document.getElementById("search-textfield");
const loader = document.getElementById("search-loading");
const searchPanel = document.getElementById("search-panel");
const imagepreview = document.getElementById("image-preview");
const imagepreview_img = document.getElementById("image-preview-img");
const imageinfo = document.getElementById("image-info");
const imagedownload = document.getElementById("image-download");


searchSwitch();

function searchSwitch() {
    isPexel = !isPexel;
    document.querySelector(".icon_pexels").style.visibility = isPexel ?
        "visible" :
        "hidden";
    document.querySelector(".icon_pexels").style.display = isPexel ?
        "block" :
        "none";
    document.querySelector(".icon_ddg").style.visibility = !isPexel ?
        "visible" :
        "hidden";
    ``
    document.querySelector(".icon_ddg").style.display = !isPexel ?
        "block" :
        "none";
}

searchTextField.addEventListener("keyup", (e) => {
    if (e.key == "Tab") {
        e.preventDefault();
        searchSwitch();
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
        pexels.getImages(keyword, isPexel).then((result) => {
            doLoadonSearch(false);

            parseResult(result);
        })
    } catch (err) {
        console.log(err)
    }


}
(async() => {

    // const pluginfolder = await fs.getPluginFolder()
    // const file = await pluginfolder.getEntry("jokowi.json");
    // const jokowi = await file.read();
    // try {

    //     isPexel = false;
    //     parseResult(jokowi)
    // } catch (error) {
    //     console.log(error)

    // }


})()

function createImage(thumb, original, detail) {

    //     const div = document.createElement("figure");
    //     div.className = "search-img"
    //     const el = document.createElement("img");
    //     el.src = `img/${e}`;
    //     el.className = "img";
    //     div.appendChild(el);
    //     searchImages.appendChild(div);

    const div = document.createElement("figure");
    div.className = "search-img";
    const el = document.createElement("img");
    el.className = "thumbimage";
    el.setAttribute("value", original);
    el.setAttribute("info", detail)
    if (!isPexel) {
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
    const result = isPexel ? response.photos : response;

    for (let i = 0; i < result.length; i++) {
        const photo = result[i];
        const img = isPexel ? createImage(photo.src.tiny, photo.src.original, `${photo.width} x ${photo.height} px`) : createImage("https://external-content.duckduckgo.com/iu/?u=" + encodeURIComponent(photo.thumbnail), photo.image, `${photo.width} x ${photo.height} px`);
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
imagedownload.addEventListener("click", async(e) => {
    if (pexelpaneltoken)
        pexelpaneltoken = await getToken(TOKEN.IMAGES, false, false);


    let imageurl = isPexel ? imagepreview_img.getAttribute("value") : "https://external-content.duckduckgo.com/iu/?u=" + encodeURIComponent(imagepreview_img.getAttribute("value")) + "&f=1&nofb=1";
    doLoadonSearch(true)
    const namafile = md5(imageurl) + ".jpg";
    await pexelpaneltoken.getEntry(namafile).then(async(response) => {
        placeImageonDocument(await fs.createSessionToken(response))
    }).catch(async(err) => {

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

})

async function placeImageonDocument(token) {
    await insertImage(token);
    await bputilsFitLayer(true);
    doLoadonSearch(false);
    imagepreview.style.display = "none";
}