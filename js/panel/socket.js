class MyWebSocket {
    constructor() {
        if (this.websocket != null)
            return this.websocket;
    }
    sendMessage(data) {
        if (this.websocket == null) {
            this.websocket = new WebSocket("ws://localhost:7898/Server", "ps-protocol")
            this.websocket.onopen = evt => {
                this.websocket.send(data);
            }

        } else {
            this.websocket.send(data);
        }

    }
    bind(element, listener) {
        if (this.websocket == null) {
            this.websocket = new WebSocket("ws://localhost:7898/Server", "ps-protocol")
            this.dothis(element, listener);
        } else {
            this.dothis(element, listener);
        }

    }
    dothis(element, listener) {
        this.websocket.onopen = evt => {
            console.log(evt);
            element.style.background = "green";
        }
        this.websocket.onclose = evt => {
            element.style.background = "red";
            this.websocket = null;

        }
        this.websocket.onmessage = evt => {
            const result = JSON.parse(evt.data);
            switch (result.type) {
                case "url":
                    element.style.background = "yellow";
                    listener(result.data)
                    break;
                default:
                    break;
            }
            // element.innerText = evt.data;
            // listener(evt.data)


        }
    }
    close() {
        if (this.websocket != null) {
            this.websocket.close()
        }
    }

}

module.exports = {
    MyWebSocket
}