class Pexels {
    static api_key = "563492ad6f91700001000001b7f8998eacb449ceba4325318182d154";
    static api_url = "https://api.pexels.com/v1/search"
    static duckduckgo = "https://hellogis.herokuapp.com/?key="
        //static google = "https://dcsms-gis.herokuapp.com/?key="
    static google = "http://localhost:5000/?key="

    constructor() {

    }
    doRequest(url, searchEngine) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            const method = "GET";
            req.timeout = 15000;
            req.onload = () => {
                if (req.status === 200) {
                    try {
                        resolve(req.response);
                    } catch (err) {
                        reject(`Couldn't parse response. ${err.message}, ${req.response}`);
                    }
                } else {
                    reject(`Request had an error: ${req.status}`);
                }
            }
            req.ontimeout = () => {
                console.log("polling..")
                resolve(this.doRequest(url))

            }
            req.onerror = (err) => {
                console.log(err)
                reject(err)
            }
            req.open(method, url, true);
            if (searchEngine == "pexels")
                req.setRequestHeader('Authorization', Pexels.api_key);
            req.send();
        })
    }
    getImages(keyword, searchEngine, islarge) {
        return new Promise(async(resolve, reject) => {
            let url = "";
            switch (searchEngine) {
                case "pexels":
                    url = `${Pexels.api_url}?query=${keyword.replace(" ","+")}&per_page=60`;
                    break;
                case "duckgo":
                    url = `${Pexels.duckduckgo}${keyword.replace(" ","%20")}`;
                    break;
                case "google":
                    url = `${Pexels.google}${keyword.replace(" ","%20")}${islarge?"&size=l":""}`;
                    break;
                default:
                    break;
            }

            try {
                console.log(url);
                const result = await this.doRequest(url, searchEngine);
                resolve(result);
            } catch (err) {
                console.log(err)
            }
        })

    }




}



module.exports = {
    Pexels,
    COL: {
        red: ' red',
        orange: ' orange',
        yellow: ' yellow',
        green: ' green',
        turquoise: ' turquoise',
        blue: ' blue',
        violet: ' violet',
        pink: ' pink',
        brown: ' brown',
        black: ' black',
        gray: ' gray',
        white: ' white'
    },
    ORIENTATION: {
        landscape: "landscape",
        portrait: "portrait",
        square: "square"
    }
}