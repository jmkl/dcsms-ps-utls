reloadPlugin = () => {
    window.location.reload();
}



entrypoints.setup({
    commands: {
        reloadPlugin: () => reloadPlugin()
    },
    panels: {
        dcsmsPanel: {
            show({ node } = {}) {

            },
            menuItems: [
                { id: "reloadPanelFlyout", label: "Reload Panel", checked: false, enabled: true },
                { id: "showDialog", label: "Show Dialog", checked: false, enabled: true }
            ],
            invokeMenu(id) {
                switch (id) {
                    case "reloadPanelFlyout":
                        reloadPlugin();
                        break;
                    case "showDialog":

                        break;
                }
            }
        }
    }
});