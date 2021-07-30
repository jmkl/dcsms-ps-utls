browser.contextMenus.create({
    id: "push-to-ps",
    title: "Send to Photoshop",
    contexts: ["image"]
});

let socket = new WebSocket('ws://localhost:7898/Server');
browser.contextMenus.onClicked.addListener(async(info, tab) => {

    if (info.menuItemId != "push-to-ps") {
        return;
    }
    console.log(socket, socket.readyState);
    if (socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket('ws://localhost:7898/Server');
    }
    const data = JSON.stringify({ type: "url", data: info.srcUrl, fromserver: false });
    while (socket.readyState === 0) {

        await new Promise(resolve => {
            setTimeout(() => { resolve('') }, 200);
        })

    }

    socket.send(data);




    return info.srcUrl;

});