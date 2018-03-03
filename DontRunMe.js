"use strict";

const detectNewline = require("detect-newline");
const crypto = require("crypto"); // define crypto
const fs = require("fs"); // define filesys
let projectRoot = require("path").dirname(require.main.children[0].filename).replace(/[\/\\]node_modules[\/\\].*/g, ""); // eslint-disable-line no-useless-escape
let fetchedKey, fetchedHMAC, convertedConfig = false;

const exit = (msg) => {
    console.log(msg);
    return setTimeout(() => {
        process.exit(0);
    }, 2000);
};

const randomValueHex = (len) => {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString("hex") // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
};

const main = () => {
    if (fs.existsSync(`${projectRoot}/.gitignore`)) {
        var file = fs.readFileSync(`${projectRoot}/.gitignore`).toString();
        var newlineChar = detectNewline(file);
        if (!file.includes(".basic256rc.js")) fs.appendFileSync(`${projectRoot}/.gitignore`, `${newlineChar}.basic256rc.js${newlineChar}`);
    }

    if (fs.existsSync(`${projectRoot}/.basic256rc.js`)) {
        return exit("\n.basic256rc.js already exists, stopping setup.\n");
    }

    if (fs.existsSync("./config.js")) {
        try {
            var c = require("./config.js").k;
            if (c.key) fetchedKey = c.key;
            if (c.hmac_key) fetchedHMAC = c.hmac_key;
            convertedConfig = true;
        } catch (e) {
            fetchedKey = null,
            fetchedHMAC = null;
            console.warn(`\nThere is an old config.js file in package.\nHowever, reading of the keys have failed:\n\n${e.stack}\n`);
        }
    }

    const enduserconfig = {
        key: fetchedKey || randomValueHex(32), // create random hex val for enc key
        hmac_key: fetchedHMAC || randomValueHex(32) // create random hex val for hmac key
    };

    fs.appendFileSync(`${projectRoot}/.basic256rc.js`, `"use strict";

module.exports = ${JSON.stringify(enduserconfig, null, 4)}
`); // generate config file with necessary info

    if (convertedConfig) return exit("\nYour old configuration is saved to a file named .basic256rc.js has been created on the project root.\nDON'T FORGET TO BACK THIS UP.\n");
    return exit("\nA file named .basic256rc.js has been created on the project root. DON'T FORGET TO BACK THIS UP.\n");
};

main();
