const fs = require('fs');
const archiver = require('archiver');
const output = fs.createWriteStream(__dirname + '/tes_archiver.ccx');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});
const manifest = JSON.parse(fs.readFileSync("manifest.json"));
console.log(manifest);
archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });
archive.append("index.html", { name: 'index.html' });
archive.directory("css/", "css");
archive.directory("js/", "js");
archive.directory("icons/", "icons");
archive.pipe(output);
archive.finalize();