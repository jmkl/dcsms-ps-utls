async function include(...file) {
    return new Promise((resolve, reject) => {
        for (const f of file) {
            var script = document.createElement('script');
            script.src = f;
            script.type = 'text/javascript';
            script.defer = true;
            document.getElementsByTagName('head').item(0).appendChild(script);

        }
        resolve(1);
    })

}

include(
    "js/init.js",
    "js/index.js",
    "js/bpUtils.js",
    "js/globalUtils.js",
    "js/panel/mainpanel.js",
    "js/panel/batchplayMain.js",
    "js/panel/pexelpanel.js",
    "js/panel/colorpanel.js"

).then(() => {


    // attach event listeners for tabs
    Array.from(document.querySelectorAll(".sp-tab")).forEach((theTab) => {
        theTab.onclick = () => {
            localStorage.setItem("currentTab", theTab.getAttribute("id"));
            Array.from(document.querySelectorAll(".sp-tab")).forEach((aTab) => {
                if (aTab.getAttribute("id") === theTab.getAttribute("id")) {
                    aTab.classList.add("selected");
                } else {
                    aTab.classList.remove("selected");
                }
            });
            Array.from(document.querySelectorAll(".sp-tab-page")).forEach((tabPage) => {
                if (tabPage.getAttribute("id").startsWith(theTab.getAttribute("id"))) {
                    tabPage.classList.add("visible");
                } else {
                    tabPage.classList.remove("visible");
                }
            });
        };
    });








})