'use strict';

let crypto = require('crypto');

function randomValueHex (len) {
  return crypto.randomBytes(Math.ceil(len/2))
    .toString('hex') // convert to hexadecimal format
    .slice(0,len);   // return required number of characters
};

let a = randomValueHex(32);
let b = randomValueHex(32);
console.log("{\n  \"key\": \"" + a + "\",\n  \"hmac_key\": \"" + b + "\"\n}");
setTimeout(function(){process.exit(0);}, 833);
