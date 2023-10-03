const path = require('path');
const fs = require('fs');
const yaml = require('yaml');

const emitDir = "objects";

function generateObjectPages() {
    process.stdout.write("Generating object pages...");

    // Make directory for emitted files
    if (!fs.existsSync(emitDir)){
        fs.mkdirSync(emitDir, { recursive: true });
    }

    // Create files for each entry in the object yaml
    var contents = fs.readFileSync("./_data/objects.yml", "utf8");
    var obj = yaml.parse(contents, null, { prettyErrors: true });
    for (const key in obj) {
var content = `---
title: ${key}
name: ${key}
layout: object
---`;
        fs.writeFileSync(emitDir + "/" + key.toLowerCase() + ".md", content);
    }
    console.log("done");
}

module.exports.process = async function() {
    generateObjectPages();
}