'use strict';

let crypto = require('crypto');

try {
    var savedKeys = require("./config.js").k;
} catch (e) {
    return Promise.reject('No Configuration Exists!');
}

var ALGORITHM, KEY, HMAC_ALGORITHM, HMAC_KEY;

ALGORITHM = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
HMAC_ALGORITHM = 'SHA256';
KEY = savedKeys.key; // Use the automated script.
HMAC_KEY = savedKeys.hmac_key; // Use the automated script.

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
};

var constant_time_compare = function (val1, val2) {
    var sentinel;

    if (val1.length !== val2.length) {
        return false;
    }


    for (var i = 0; i <= (val1.length - 1); i++) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }

    return sentinel === 0
};

module.exports = {

    "encrypt": function (plain_text) {
        if (!plain_text || typeof(plain_text) !== "string") return Promise.reject("Plain text was not found.");

        var IV = Buffer.from(randomValueHex(16)); // ensure that the IV (initialization vector) is random
        var encryptor, cipher_text, hmac;

        encryptor = crypto.createCipheriv(ALGORITHM, KEY, IV);
        encryptor.setEncoding('hex');
        encryptor.write(plain_text);
        encryptor.end();

        cipher_text = encryptor.read();

        hmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
        hmac.update(cipher_text);
        hmac.update(IV.toString('hex')); // ensure that both the IV and the cipher-text is protected by the HMAC

        // The IV isn't a secret so it can be stored along side everything else
        return cipher_text + "$" + IV.toString('hex') + "$" + hmac.digest('hex') 
    },

    "decrypt": function (cipher_text) {
        if (!cipher_text || typeof(cipher_text) !== "string" || !cipher_text.match(/\$/g)) return Promise.reject("A valid cipher text was not found.");

        var cipher_blob = cipher_text.split("$");
        var ct = cipher_blob[0];
        var IV = Buffer.from(cipher_blob[1], 'hex');
        var hmac = cipher_blob[2];
        var chmac, decryptor;

        chmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
        chmac.update(ct);
        chmac.update(IV.toString('hex'));

        if (!constant_time_compare(chmac.digest('hex'), hmac)) {
            return Promise.reject("Encrypted Blob has been tampered with.");
        }

        decryptor = crypto.createDecipheriv(ALGORITHM, KEY, IV);
        var decryptedText = decryptor.update(ct, 'hex', 'utf-8');
        return decryptedText + decryptor.final('utf-8');
    }

}
