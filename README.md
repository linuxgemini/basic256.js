Basic256.js
=========================

A basic encryption/decryption script/API for Node.js users.

Based on the work by [Levi Gross](http://www.levigross.com/2014/03/30/how-to-write-an-encrypt-and-decrypt-api-for-data-at-rest-in-nodejs/).

Usage
-----

Gather Basic256.js first, copy all files inside to your project folder/direcory.

And do these:
        chmod +x runMeFirst.sh
        ./runMeFirst.sh

Then make your script connected. Example:

        var crypter = require("./Basic256.js");
        
        var blob = crypter.enc.run("FOO"); // This encrypts the string "FOO".
        console.log(blob); // This will show the encrypted string.
        
        var unblob = crypter.dec.run(blob); // This decrypts the encrypted string.
        console.log(unblob); // This will show the decrypted string. (Which in this case, it is "FOO")
