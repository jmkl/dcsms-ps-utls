const ColorScheme = require("./colorscheme.js");

class ColorUtils {
    colorkey = "COLOR";
    constructor() {
        setInterval(this.saveColor, 5 * 60 * 1000);

        this.readColor();

    }

    readColor() {
        const clr = localStorage.getItem("COLOR");
        for (let c of JSON.parse(clr)) {
            this.createPreview(`rgb(${c[0]},${c[1]},${c[2]})`, [c[0], c[1], c[2]]);
        }
    }
    saveColor() {

        const clr = document.querySelectorAll('.color-history');
        let val = Array.from(clr, node => node.getAttribute("value"));
        localStorage.setItem("COLOR", JSON.stringify(val))


    }

    hex2rgb(hex) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b]

    }
    createPreview(bg, rgb) {
        const div = document.createElement('div')
        div.width = '20px';
        div.className = `color-history`
        div.setAttribute("value", rgb);
        div.style.background = bg;
        colorHistoryPanel.appendChild(div);
        div.addEventListener('click', async(event) => {

            try {
                await applySingleColor(event.target.getAttribute("value"), event.altKey ? false : true)
            } catch (err) {
                Logger("applySingleColor", err)
            }
        })
        div.addEventListener('contextmenu', async(event) => {
            colorHistoryPanel.removeChild(event.target);
            await this.saveColor();
        })
    }

    createColorScheme(parent, mode, distance = 0.25, huevalue = 20, mood = "hard") {
        const cs = new ColorScheme();

        const rand = Math.floor(Math.random() * (360 - 0 + 1) + 0);
        // const distance = 0.25 + Math.random() * (0.5 + 0.1 - 0.25);


        let colors = cs
            .from_hue(huevalue)
            .scheme(mode)
            .distance(distance)
            .variation(mood)
            .add_complement(true)
            .colors();

        while (parent.firstChild) parent.removeChild(parent.firstChild);
        colors.forEach((col) => {
            const div = document.createElement("div");
            div.className = "color-preview";
            div.style.background = `#${col}`;
            parent.appendChild(div);
        });
        const grad_btn = document.querySelectorAll(".color-preview");
        grad_btn.forEach((btn) => {
            btn.addEventListener("contextmenu", async(event) => {
                const hexval = event.target.style.background;
                const [r, g, b] = this.hex2rgb(hexval);
                this.createPreview(`rgb(${r},${g},${b})`, [r, g, b]);
                await this.saveColor();
            })
            btn.addEventListener("click", (event) => {
                const hexval = event.target.style.background;
                const [r, g, b] = this.hex2rgb(hexval);
                applySingleColor([r, g, b], event.altKey ? false : true);
            });
        });
    }


}

module.exports = {
    ColorUtils

}