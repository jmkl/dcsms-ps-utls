class Pexels {
    static api_key = "563492ad6f91700001000001b7f8998eacb449ceba4325318182d154";
    static api_url = "https://api.pexels.com/v1/search"
    static duckduckgo = "https://hellogis.herokuapp.com/?key="

    constructor() {

    }
    doRequest(url) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            const method = "GET";
            req.timeout = 6000;
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
            if (isPexel)
                req.setRequestHeader('Authorization', Pexels.api_key);
            req.send();
        })
    }
    getImages(keyword, isPexel) {
        return new Promise(async(resolve, reject) => {
            const url = isPexel ? `${Pexels.api_url}?query=${keyword.replace(" ","+")}&per_page=60` : `${Pexels.duckduckgo}${keyword.replace(" ","%20")}`;
            try {
                const result = await this.doRequest(url);
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