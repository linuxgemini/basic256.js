// HELP ME MAKE THIS SHITTY CIPHER API GREAT AGAIN //

crypto = require('crypto');

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
};

var ALGORITHM, KEY, HMAC_ALGORITHM, HMAC_KEY;

ALGORITHM = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
HMAC_ALGORITHM = 'SHA256';
KEY = randomValueHex(32); // This key should be stored in somewhere
HMAC_KEY = randomValueHex(32); // This key should be stored in somewhere, again

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

    "enc": {
        run : function (plain_text) {

            var IV = new Buffer(randomValueHex(16)); // ensure that the IV (initialization vector) is random
            var cipher_text;
            var hmac;
            var encryptor;

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
        }
    },

    "dec": {
        run : function (cipher_text) {
            var cipher_blob = cipher_text.split("$");
            var ct = cipher_blob[0];
            var IV = new Buffer(cipher_blob[1], 'hex');
            var hmac = cipher_blob[2];
            var decryptor;

            chmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
            chmac.update(ct);
            chmac.update(IV.toString('hex'));

            if (!constant_time_compare(chmac.digest('hex'), hmac)) {
                console.log("Encrypted Blob has been tampered with...");
                return null;
            }

            decryptor = crypto.createDecipheriv(ALGORITHM, KEY, IV);
            var decryptedText = decryptor.update(ct, 'hex', 'utf8');
            return decryptedText + decryptor.final('utf-8');
        }
    }
}
