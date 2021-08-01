const { runbatchPlay, runCommand, runCommandID } = require("./batchplay")
const tooltip = document.createElement("sp-tooltip");
tooltip.innerText = "templates";
tooltip.className = "tooltip_tool";
tooltip.setAttribute("placement", "bottom");
tooltip.setAttribute("variant", "positive");
document.querySelector(".footer").appendChild(tooltip);
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
            element.getIcon(tmplt);
            element.innerText = tmplt.name.replace(".json", "").toLowerCase();
            batchplayGroup.appendChild(element);
            element.addEventListener("click", async() => {

                batchplayGroup.style.display = "none";

                if (bplist_token == null) {
                    await getBPListFolder();
                }

                await bplist_token.getEntry(element.getAttribute("value")).then(async(e) => {
                    const cmd = JSON.parse(await e.read());
                    console.log(cmd)
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
                            case "mix":
                                const tasks = cmd.tasks;
                                for (t of tasks) {
                                    console.log(t.mode);
                                    if (t.mode == "batchplay") {
                                        await runbatchPlay(...t.commands)
                                    } else if (t.mode == "command") {
                                        await runCommand(t.string)
                                    } else if (t.mode == "commandid") {
                                        await runCommandID(t.id);
                                    }
                                }
                                break;
                        }

                        batchplayGroup.style.display = "flex";
                    } catch (err) {
                        console.log(err)
                    }
                })
            })

            element.addEventListener("mouseenter", e => {
                tooltip.setAttribute("open");
                tooltip.innerText = tmplt.name.replace(".json", "");
            })
            element.addEventListener("mouseleave", e => {
                tooltip.removeAttribute("open");
            })
        });


    }
    Element.prototype.getIcon = async function(data) {
        await bplist_token.getEntry(data.name).then(async(e) => {
            const cmd = JSON.parse(await e.read());
            if (cmd.icon) {
                try {
                    const result = await fetch(`https://fa-get.herokuapp.com/get?key=${cmd.icon}`).then((e) => {
                        return e.json();
                    }).then(async(e) => {
                        this.innerHTML = e.svg;
                    });

                } catch (err) {
                    console.log(err);
                }
            }
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