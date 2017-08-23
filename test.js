'use strict';

var m = require("./basic256");

console.log("Encrypting string \"foo\"...");
var encStr = m.encrypt("foo");
console.log("\nDecrypting the string below...\n" + encStr);
var decStr = m.decrypt(encStr);
console.log("\nResult: " + decStr);

if (decStr === "foo") {
	console.log("\nSUCCESS!");
	setTimeout(() => {process.exit(0);},853);
} else {
	console.error("\nFAILURE!");
	setTimeout(() => {process.exit(1);},853);
}
