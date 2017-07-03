'use strict';

let crypto = require('crypto'); // define crypto
let fs = require('fs'); // define filesys

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
};

if (fs.existsSync("./config.js")) {
    return setTimeout(function(){
        process.exit(0); // exit script if config already exists
    }, 833);
}

let key = randomValueHex(32); // create random hex val for enc key
let hmac = randomValueHex(32); // create random hex val for hmac key
let randFold = "./" + randomValueHex(32) + "/"; // create random hex val with filesys encoding for folder
let randFile = randomValueHex(32) + ".json"; // create random hex val with .json ending for file
let resSysop = randFold + randFile; // merge foldername and filename

fs.mkdirSync(randFold); // create folder
fs.appendFileSync(resSysop, "{\n  \"key\": \"" + key + "\",\n  \"hmac_key\": \"" + hmac + "\"\n}\n"); // create file with keys necessary
fs.appendFileSync("./config.js", "\'use strict\';\n\nvar k = require(\"" + resSysop + "\");\n\nmodule.exports = {\n  k\n};\n\n"); // generate config file with necessary info

setTimeout(function(){process.exit(0);}, 2000); // exit script
