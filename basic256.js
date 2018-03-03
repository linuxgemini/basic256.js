"use strict";

let crypto = require("crypto");
let projectRoot = require("path").dirname(require.main.filename);

/**
 * A basic encryption/decryption script/API for resting data for Node.js users.
 * @class
 */
class basic256 {
    constructor() {
        try {
            var savedKeys = require(`${projectRoot}/.basic256rc.js`);
        } catch (e) {
            throw new Error("An error happened while loading the key");
        }

        this.ALGORITHM = "AES-256-CBC";
        this.HMAC_ALGORITHM = "SHA256";
        this.KEY = savedKeys.key;           // Use the automated script.
        this.HMAC_KEY = savedKeys.hmac_key; // Use the automated script.
    }

    encrypt(plain_text) {
        if (!plain_text || typeof (plain_text) !== "string") throw new Error("Plain text was not found.");

        var IV = Buffer.from(tools.randomValueHex(16)); // ensure that the IV (initialization vector) is random
        var encryptor, cipher_text, hmac;

        encryptor = crypto.createCipheriv(this.ALGORITHM, this.KEY, IV);
        encryptor.setEncoding("hex");
        encryptor.write(plain_text);
        encryptor.end();

        cipher_text = encryptor.read();

        hmac = crypto.createHmac(this.HMAC_ALGORITHM, this.HMAC_KEY);
        hmac.update(cipher_text);
        hmac.update(IV.toString("hex")); // ensure that both the IV and the cipher-text is protected by the HMAC

        // The IV isn't a secret so it can be stored along side everything else
        return cipher_text + "$" + IV.toString("hex") + "$" + hmac.digest("hex");
    }

    decrypt(cipher_text) {
        if (!cipher_text || typeof (cipher_text) !== "string" || !cipher_text.match(/\$/g)) throw new Error("A valid cipher text was not found.");

        var cipher_blob = cipher_text.split("$");

        if (cipher_blob.length !== 3) throw new Error("Cipher text is broken.");

        var ct = cipher_blob[0];
        var IV = Buffer.from(cipher_blob[1], "hex");
        var hmac = cipher_blob[2];
        var chmac, decryptor;

        chmac = crypto.createHmac(this.HMAC_ALGORITHM, this.HMAC_KEY);
        chmac.update(ct);
        chmac.update(IV.toString("hex"));

        if (!tools.constant_time_compare(chmac.digest("hex"), hmac)) {
            throw new Error("Encrypted Blob has been tampered with.");
        }

        decryptor = crypto.createDecipheriv(this.ALGORITHM, this.KEY, IV);
        var decryptedText = decryptor.update(ct, "hex", "utf-8");
        return decryptedText + decryptor.final("utf-8");
    }

}

class tools {
    static constant_time_compare(val1, val2) {
        var sentinel;

        if (val1.length !== val2.length) {
            return false;
        }

        for (var i = 0; i <= (val1.length - 1); i++) {
            sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
        }

        return sentinel === 0;
    }
    static randomValueHex(len) {
        return crypto.randomBytes(Math.ceil(len / 2))
            .toString("hex") // convert to hexadecimal format
            .slice(0, len);  // return required number of characters
    }
}

module.exports = basic256;
