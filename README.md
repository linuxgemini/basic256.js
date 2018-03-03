basic256.js
=========================

WARNING
-------

**THIS PACKAGE SAVES IMPORTANT KEYS ON YOUR PROJECT, DON'T LOSE IT.**

[![Build Status](https://travis-ci.org/linuxgemini/basic256.js.svg?branch=master)](https://travis-ci.org/linuxgemini/basic256.js)

A basic encryption/decryption script/API for resting data for Node.js users.

*Slightly* modified the work of [Levi Gross](http://www.levigross.com/2014/03/30/how-to-write-an-encrypt-and-decrypt-api-for-data-at-rest-in-nodejs/).

Usage
-----

Open a terminal in your project folder and make sure that you have a package.json file.

And do this on your terminal if you are not root:

`
$ npm install --save basic256.js
`

If you are running as root, do this:

`
$ npm install --unsafe-perm --save basic256.js
`

Then make your script connected. Example:

```js
const b256 = require("basic256.js");
const basic256 = new b256();

var blob = basic256.encrypt("FOO"); // This encrypts the string "FOO".
console.log(blob);  // This will show the encrypted string.

var unblob = basic256.decrypt(blob); // This decrypts the encrypted string.
console.log(unblob);    // This will show the decrypted string. (Which in this case, it is "FOO")
```

**Don't forget to back your .basic256rc.js file as it contains your keys to encrypt and decrypt strings.**
