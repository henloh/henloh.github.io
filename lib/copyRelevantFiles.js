const fs = require("fs");


var index = fs.readFileSync("./dist/index.html", {encoding: "utf-8"});
index = index.replace(/resources\/sap-ui-custom\.js/g, "buildt/sap-ui-custom.js");

fs.writeFileSync("./dist/index.html", index);

if(!fs.existsSync("./dist/buildt")) {
    fs.mkdirSync("./dist/buildt");
    console.log("Folder buildt created");
}

var pack = fs.readFileSync("package.json");
pack = JSON.parse(pack);
console.log(JSON.stringify(pack.ui5.relevantFiles));
pack = pack.ui5.relevantFiles;

for (const file of pack) {
    try {
        if (!fs.existsSync("./dist/"+file[0].replace("resources", "buildt"))) {
            fs.mkdirSync("./dist/"+file[0].replace("resources", "buildt"), { recursive: true })
        }
        fs.copyFileSync("./dist/"+file[0] + file[1], "./dist/" + file[0].replace("resources", "buildt") + file[1] );
    } catch (error) {
        console.log(" ");
        console.log(error);
        console.log(" ");
    }
}
