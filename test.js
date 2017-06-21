'use strict';

var m = require("./basic256");

console.log("Encrypting string \"foo\"...");
var encStr = m.enc.run("foo");
console.log("\nDecrypting the string below...\n" + encStr);
var decStr = m.dec.run(encStr);
console.log("\n\nResult: " + decStr);

if (decStr === "foo") {
	console.log("\nSUCCESS!");
	setTimeout(function(){process.exit(0);},853);
} else {
	console.error("\nFAILURE!");
	setTimeout(function(){process.exit(1);},853);
}
