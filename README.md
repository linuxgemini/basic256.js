basic256.js
=========================

[![Build Status](https://travis-ci.org/linuxgemini/basic256.js.svg?branch=master)](https://travis-ci.org/linuxgemini/basic256.js)

A basic encryption/decryption script/API for resting data for Node.js users.

*Slightly* modified the work of [Levi Gross](http://www.levigross.com/2014/03/30/how-to-write-an-encrypt-and-decrypt-api-for-data-at-rest-in-nodejs/).

Usage without downloading from NPM
-----

Gather basic256.js first, copy all files inside to your project folder/direcory.

And do this on your terminalif you are not root:

        npm install

If you are running as root, do this:

		npm install --unsafe-perm

Then make your script connected. Example:

        var crypter = require("./basic256.js");
        
        var blob = crypter.enc.run("FOO"); // This encrypts the string "FOO".
        console.log(blob); // This will show the encrypted string.
        
        var unblob = crypter.dec.run(blob); // This decrypts the encrypted string.
        console.log(unblob); // This will show the decrypted string. (Which in this case, it is "FOO")
