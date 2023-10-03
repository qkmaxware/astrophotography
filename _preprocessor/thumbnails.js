const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const filter = /\.(png|jpg|jpeg|bmp)$/i;
function scan(startPath, outFiles) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        if (files[i].startsWith("_")) {
            continue; // Skip jekyll hidden files
        }
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            scan(filename, outFiles); //recurse
        } else if (filter.test(filename)) {
            outFiles.push(filename);
        };
    };
};

module.exports.process = async function() {
    console.log("Generating thumbnails");

    // Read images
    let images = [];
    scan(".", images);

    for (var i = 0; i < images.length; i++) {
        let from = images[i];
        let to = "_site/generated/thumbnails/" + from;
        let dir = path.dirname(to);
        
        // Make directory if it doesn't exist
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        // Compute new size
        var ratio = 0.25;
        var meta = await sharp(from).metadata();
        var width = Math.max(1, Math.floor(meta.width * ratio));
        var height = Math.max(1, Math.floor(meta.height * ratio));

        // Do resize
        await sharp(from).resize({width: width, height: height}).toFile(to);
    }
}