const { runbatchPlay } = require("./batchplay")
async function bpList() {
    const bplist_items = document.querySelector(".batchplay_list_items");
    const bplist_button = document.querySelector(".batchplay_run");
    const bplist_refresh = document.querySelector(".batchplay_refresh");
    let bplist_token = null;

    async function addElementToDropdown(templates) {
        while (bplist_items.firstChild)
            bplist_items.removeChild(bplist_items.firstChild);
        await templates.forEach((tmplt) => {
            const element = document.createElement("sp-menu-item");
            element.classList = "bplist_items-item";
            element.value = tmplt.name;
            element.innerText = tmplt.name.replace(".psd", "").toUpperCase();
            bplist_items.appendChild(element);
        });
        bplist_items.selectedIndex = 0;
        template = bplist_items.childNodes[0].value;
    }
    async function getBPListFolder(reset = false) {
        bplist_token = await getToken(TOKEN.BATCHPLAY, reset, false)


    }

    await getBPListFolder();
    const templates = (await bplist_token.getEntries())
        .filter((tmplt) => tmplt.name.indexOf("json") > 0);
    addElementToDropdown(templates)
    bplist_refresh.addEventListener("click", async(e) => {
        await getBPListFolder(true);
        const templates = (await bplist_token.getEntries())
            .filter((tmplt) => tmplt.name.indexOf("json") > 0);
        addElementToDropdown(templates)
    })
    bplist_button.addEventListener("click", async(e) => {
        const template = bplist_items.childNodes[bplist_items.parentNode.selectedIndex].value;
        if (bplist_token == null) {
            await getBPListFolder();
        }

        await bplist_token.getEntry(template).then(async(e) => {
            const cmd = JSON.parse(await e.read());
            console.log(cmd);
            try {
                await runbatchPlay(...cmd);

            } catch (err) {
                console.log(err)
            }
        })



    })


}

module.exports = {
    bpList
}