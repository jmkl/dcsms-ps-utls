const { getToken } = require('/js/Token.js');
const { MyWebSocket } = require("./socket.js")
const websocket = new MyWebSocket();
let folderbahan;
const tblbahan = document.querySelector(".bahan-convert");
const listbahan = document.querySelector(".bahan-list");

async function cekforLayerName(folder, layername) {

    return new Promise(async(resolve, reject) => {



        await folder.getEntry(layername + ".psb").then((entry) => {
            folder.getEntries().then(allfiles => {
                const files = allfiles.map(file => file.name);
                const nama = files.map((file) => {
                    const filename = file.replace(".psb", "");
                    const num = filename.split("_");
                    return parseInt(num[num.length - 1]);
                }).filter(n => !isNaN(n));
                let num = Math.max(...nama);
                if (num == -Infinity)
                    resolve(layername + "_" + 0 + ".psb")
                else
                    resolve(layername + "_" + (num + 1) + ".psb")

            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            resolve(layername + ".psb")
            return;
        });



    })
}
async function loadBahan() {
    folderbahan = await getToken(TOKEN.BAHAN, false, false);
    await folderbahan.getEntry("thumbnail.json").then(async(res) => {
        const str = JSON.parse(await res.read());
        let allpsb = (await folderbahan.getEntries()).map(entry => entry.name).filter(entry => entry.includes("psb"));
        while (listbahan.firstChild) listbahan.removeChild(listbahan.firstChild);
        for (s of str) {
            if (allpsb.includes(s.name + ".psb")) {
                const label = document.createElement("sp-label");
                const div = document.createElement("div")
                div.className = "bahan-parent"
                label.className = "bahan-label"
                const img = document.createElement("img");
                img.className = "bahan-thumb";
                img.setAttribute("src", `data:image/png;base64,${s.image64}`);
                img.setAttribute("value", s.name);
                label.innerText = (s.name);
                div.appendChild(img);
                div.appendChild(label)
                listbahan.appendChild(div);

            }
        }

    }).catch((err) => { console.log(err) })

    Array.from(document.querySelectorAll(".bahan-parent")).forEach(imgbahan => {
        imgbahan.addEventListener("mouseover", () => {

            const lbl = imgbahan.childNodes[1];
            lbl.style.display = "flex";

        })
        imgbahan.addEventListener("mouseout", () => {

            const lbl = imgbahan.childNodes[1];
            lbl.style.display = "none";

        })
        imgbahan.addEventListener("contextmenu", async() => {
            const nama = imgbahan.childNodes[1].innerText;
            const token = await folderbahan.getEntry(`${nama}.psb`);
            websocket.sendMessage(JSON.stringify({
                type: "deletethumb",
                fromserver: false,
                data: await token.nativePath
            }));
            websocket.websocket.onmessage = evt => {
                const result = JSON.parse(evt.data);
                if (result.fromserver && result.type == "deletethumb") {
                    loadBahan();
                }
            }

        })

        imgbahan.addEventListener("click", async(e) => {
            const nama = imgbahan.childNodes[1].innerText;
            const token = await folderbahan.getEntry(`${nama}.psb`);
            const result = await require("photoshop").action.batchPlay([{
                _obj: "placeEvent",
                target: {
                    _path: await fs.createSessionToken(token),
                    _kind: "local",
                },
                "linked": true
            }], {
                "synchronousExecution": true,
                "modalBehavior": "fail"
            });
            console.log(result);
        })
    })
}
loadBahan();



tblbahan.addEventListener("click", async function(e) {


    const layer = await app.activeDocument.activeLayers[0];
    const isSmartObject = false; // layer.kind == 5 ? true : false;
    let layerName = await cekforLayerName(folderbahan, layer.name);


    const newpsb = await folderbahan.createFile(layerName, { overwrite: false })

    const token = fs.createSessionToken(newpsb);
    try {
        let cmd = [];
        if (!isSmartObject) {
            cmd.push({
                "_obj": "newPlacedLayer",
                "_isCommand": true
            })
        }
        cmd.push({
            "_obj": "placedLayerConvertToLinked",
            "_target": [{
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }],
            "using": {
                "_path": token,
                "_kind": "local"
            },
            "_isCommand": true
        })
        const result = await require("photoshop").action.batchPlay(cmd, {
            "synchronousExecution": true,
            "modalBehavior": "fail"
        });
        postCreateThumbnail(result[result.length - 1]);

    } catch (err) {

    }
})
async function findObj(entireObj, keyToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind]) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}

async function postCreateThumbnail(result) {
    const path = await findObj(result, "_path");
    websocket.sendMessage(JSON.stringify({
        type: "createthumb",
        fromserver: false,
        data: path._path
    }));
    websocket.websocket.onmessage = evt => {
        const result = JSON.parse(evt.data);
        if (result.fromserver && result.type == "createthumb") {
            loadBahan();
        }
    }
}