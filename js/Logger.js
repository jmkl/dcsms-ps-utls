module.exports.Logger = (title, ...msg) => {
    console.log(`%c==============`, "color:#fd0");
    console.log(msg);
    console.log(`%c============== ${title}`, "color:#fd0");
}