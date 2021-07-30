const { runbatchPlay, runCommand, runCommandID } = require("./batchplay")
async function bpList() {
    const batchplayGroup = document.querySelector(".batchplay-group")

    let bplist_token = null;
    async function addElementToDropdown(templates) {
        while (batchplayGroup.firstChild)
            batchplayGroup.removeChild(batchplayGroup.firstChild);
        await templates.forEach((tmplt) => {
            const element = document.createElement("div");
            element.className = "btn-main-panel"
            element.setAttribute("value", tmplt.name);
            element.innerText = tmplt.name.replace(".json", "").toLowerCase();
            batchplayGroup.appendChild(element);
            element.addEventListener("click", async(el) => {
                const name = el.target.innerText;
                batchplayGroup.style.display = "none";

                el.target.innerText = "Processing";
                if (bplist_token == null) {
                    await getBPListFolder();
                }

                await bplist_token.getEntry(el.target.getAttribute("value")).then(async(e) => {
                    const cmd = JSON.parse(await e.read());
                    try {
                        switch (cmd.mode) {
                            case "batchplay":
                                await runbatchPlay(...cmd.commands);
                                break;
                            case "command":
                                await runCommand(cmd.string)
                                break;
                            case "commandid":
                                await runCommandID(cmd.id)
                                break;
                            default:
                                break;
                        }
                        el.target.innerText = name;
                        batchplayGroup.style.display = "flex";
                    } catch (err) {
                        console.log(err)
                    }
                })
            })
        });

    }
    async function getBPListFolder(reset = false) {
        bplist_token = await getToken(TOKEN.BATCHPLAY, reset, false)


    }
    async function refreshLists(reset) {
        await getBPListFolder(reset);
        const templates = (await bplist_token.getEntries())
            .filter((tmplt) => tmplt.name.indexOf("json") > 0);
        addElementToDropdown(templates)
    }

    refreshLists(false);




}

module.exports = {
    bpList
}