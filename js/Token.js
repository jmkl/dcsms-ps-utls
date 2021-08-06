async function getToken(key, reset, onlycheck) {
    if (reset != undefined && reset) {
        localStorage.removeItem(key);
    }

    const pte = localStorage.getItem(key);
    let entryobject;
    try {
        entryobject = await fs.getEntryForPersistentToken(pte);
    } catch (error) {
        if (onlycheck != undefined && onlycheck) {
            return;
        } else {
            await showYesNoDialog(
                "Picking Folder from TOKEN",
                `for : ${key}`,
                async(result) => {
                    if (result) {
                        entryobject = await fs.getFolder();
                        localStorage.setItem(
                            key,
                            await fs.createPersistentToken(entryobject)
                        );
                    }
                }
            );
        }
    }

    return Promise.resolve(entryobject);
}

async function fetchSVG(key) {
    return new Promise(async(resolve, reject) => {
        await fetch(`https://fa-get.herokuapp.com/get?key=${key}`)
            .then((e) => {
                return e.json();
            })
            .then(async(e) => {
                resolve(e);
            })
            .catch((error) => {
                reject(0);
            });
    });
}

async function getIconSVG(icons) {
    //const url = await fetch(`https://fa-get.herokuapp.com/get?key=${key}`);


    return new Promise(async(resolve, reject) => {
        const token = await getToken("ICONFOLDER", false, false);
        let file = null;
        let lastCount = -1;
        let data = [];
        let fetchimages = async(fname, key) => {
            console.log("fetch images", fname, key);
            await fetch(`https://fa-get.herokuapp.com/get?key=${key}`)
                .then(async(e) => {
                    return e.json();
                })
                .then(async(e) => {
                    //await file.write(JSON.stringify(e));
                    //resolve(e);
                    data.push({ filename: fname, name: key, svg: e.svg })
                })
                .catch(async(error) => {
                    data.push({ filename: fname, name: key, svg: null })
                });
        };

        let createFile = async() => {
            file = await token.createFile("icons.json", { overwrite: true }).catch((e) => {
                reject(e);
            });
        }
        await token
            .getEntry("icons.json")
            .then(async(e) => {
                const icondata = await e.read();
                const ic_data = JSON.parse(icondata);
                lastCount = ic_data.length;
                if (lastCount == icons.length) {
                    for (let ic of ic_data) {
                        data.push(ic)
                    }
                } else {

                    for (let x = 0; x < icons.length; x++) {
                        const ic = icons[x];

                        const _localdata = ic_data.find(x => x.filename === ic.filename);
                        console.log("islocal", _localdata == undefined)
                        if (_localdata != undefined) {
                            data.push(_localdata)
                        } else {
                            await fetchimages(ic.filename, ic.icon);
                        }



                    }
                    await createFile();
                    await file.write(JSON.stringify(data));
                }
                resolve(data);

            })
            .catch(async(error) => {
                console.error(error);
                await createFile();
                for (var ic of icons) {
                    await fetchimages(ic.filename, ic.icon);
                }
                await file.write(JSON.stringify(data));
                resolve(data);
            });


    });
}

async function getTokenFor(doc) {
    return new Promise(async(resolve, reject) => {
        const layers = await doc.layers;
        layers.forEach(async(l) => {
            if (l.name.toLowerCase().includes("naufal")) {
                resolve(TOKEN.NAUFAL);
            } else if (l.name.toLowerCase().includes("refly")) {
                resolve(TOKEN.REFLY);
            } else if (l.name.toLowerCase().includes("neno")) {
                resolve(TOKEN.NENO);
            }
        });
    });
}
module.exports = {
    getToken,
    getTokenFor,
    getIconSVG,
};