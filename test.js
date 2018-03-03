"use strict";

try {
    var base = require("./basic256");
} catch (error) {
    setTimeout(() => {
        console.error(`Huge error in library\n${error.stack}`);
        process.exit(1);
    }, 1000);
}

const basic256 = new base();

const testText = "Lorem ipsum dolor sit amet.";
let errCount = 0;
let successCount = 0;

var ciphertext, returningtext;

try {
    ciphertext = basic256.encrypt(testText);
    returningtext = basic256.decrypt(ciphertext);
    if (returningtext === testText) {
        successCount++;
        console.log("Initial example works.");
    }
} catch (e) {
    console.log("Initial example doesn't work.");
    errCount++;
}

try {
    ciphertext = basic256.encrypt(testText.split(" ")); // planned error.
    errCount++;
} catch (er) {
    console.log("String detection before encryption works.");
    successCount++;
}

try {
    ciphertext = basic256.encrypt(testText);
    returningtext = basic256.decrypt(ciphertext.slice(3)); // planned error.
    errCount++;
} catch (err) {
    console.log("Cipher text tampering detection works.");
    successCount++;
}

if (errCount === 0 && successCount === 3) {
    setTimeout(() => {
        console.log("Test passed.");
        process.exit(0);
    }, 2222);
} else {
    setTimeout(() => {
        console.log("Test failed.");
        process.exit(1);
    }, 2222);
}