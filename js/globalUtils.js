const showYesNoDialog = async(title, content, action) => {
    const theDialog = document.createElement("sp-dialog");
    const theForm = document.createElement("form");
    const theHeading = document.createElement("sp-heading");
    const theDivider = document.createElement("sp-divider");
    const theBody = document.createElement("sp-body");
    const theFooter = document.createElement("footer");
    const theActionButton = document.createElement("sp-button");
    const theCancelButton = document.createElement("sp-button");

    theHeading.textContent = title;
    theDivider.setAttribute("size", "large");
    theBody.textContent = content;
    theActionButton.textContent = "Ok";
    theActionButton.setAttribute("variant", "cta");
    theCancelButton.textContent = "Cancel";
    theCancelButton.setAttribute("quiet", "true");
    theCancelButton.setAttribute("variant", "secondary");

    theActionButton.onclick = () => {
        theDialog.close();
        action(true);
    };
    theCancelButton.onclick = () => {
        theDialog.close();
        action(false);
    };

    theFooter.appendChild(theCancelButton);
    theFooter.appendChild(theActionButton);

    theForm.appendChild(theHeading);
    theForm.appendChild(theDivider);
    theForm.appendChild(theBody);
    theForm.appendChild(theFooter);
    theDialog.appendChild(theForm);
    document.body.appendChild(theDialog);

    const r = await theDialog.uxpShowModal({
        title: "Hello",
        resize: "none", // "both", "horizontal", "vertical",
        size: {
            width: 480,
            height: 240,
        },
    });
    theDialog.remove();
};

async function showDialog(content) {
    return new Promise(async(resolve, reject) => {
        const dlg = document.querySelector(".dialog");
        dlg.querySelector(".dialog-content").innerText = content;
        dlg.querySelector(".dialog-ok").addEventListener("click", () => {
            resolve(666)
            dlg.close();
        })

        dlg.querySelector(".dialog-cancel").addEventListener("click", () => {
            reject(new Error("Uft!"));
            dlg.close();
            return;
        })

        const uxpmodal = await dlg.uxpShowModal({ size: { width: 480, height: 360 } }).then()



    })
}


Number.prototype.mapme = function(min = 0.0, max = 1.0) {

    return (this - 0) * (max - min) / (100 - 0) + min;
}