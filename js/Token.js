async function getToken(key, reset, onlycheck) {

    if (reset != undefined && reset) {
        localStorage.removeItem(key);
    }



    const pte = localStorage.getItem(key)
    let entryobject;
    try {
        entryobject = await fs.getEntryForPersistentToken(pte);

    } catch (error) {
        if (onlycheck != undefined && onlycheck) {
            return;

        } else {
            await showYesNoDialog("Picking Folder from TOKEN", `for : ${key}`, async(result) => {
                if (result) {
                    entryobject = await fs.getFolder();
                    localStorage.setItem(key, await fs.createPersistentToken(entryobject));
                }
            })
        };


    }

    return Promise.resolve(entryobject);





    if (reset) localStorage.clear();
    const te = localStorage.getItem("persistent-token");
    let entry = null;

    try {
        entry = await fs.getEntryForPersistentToken(te);
    } catch (error) {
        entry = await fs.getFolder();
        localStorage.setItem("persistent-token", await fs.createPersistentToken(entry));
    }
    if (get) return entry;
    (async() => {
        const templates = (await entry.getEntries())
            .filter((tmplt) => tmplt.name.indexOf("psd") > 0);
        addElementToDropdown(templates);
    })();
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

        })
    })


}
module.exports = {
    getToken,
    getTokenFor
}