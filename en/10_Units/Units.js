import { ethers } from "ethers";

// 1. BigNumber class
console.group('\n1. BigNumber class');

// Generate from decimal string
const oneGwei = ethers.getBigInt("1000000000");
console.log(oneGwei);
// Generate from hex string
console.log(ethers.getBigInt("0x3b9aca00"));
// Generate from number
console.log(ethers.getBigInt(1000000000));
// Generating from a value exceeding JavaScript's maximum safe integer should not throw an error if you're using a Node.js environment with the `harmony` or `harmony-BigInt` flag enabled. The use of the native BigInt type allows for handling larger integers without encountering the expected error. This why the 'n' is displayed behind to indicate 'numeric' 
console.log(ethers.getBigInt(9007199254740991));
// Maximum safe integer in JavaScript:
console.log("Maximum safe integer in JavaScript:", Number.MAX_SAFE_INTEGER);

// Operations
console.log("Addition:", oneGwei + 1n)
console.log("Subtraction:", oneGwei - 1n)
console.log("Multiplication:", oneGwei * 2n)
console.log("Division:", oneGwei / 2n)
// Comparison
console.log("Is equal:", oneGwei == 1000000000n)


// 2. Formatting: Converting from small units to large units
// For example, converting wei to ether: formatUnits(variable, unit) where unit can be a digit (number) or a specified unit (string)
console.group('\n2. Formatting: Converting from small units to large units, formatUnits');
console.log(ethers.formatUnits(oneGwei, 0));
// '1000000000'
console.log(ethers.formatUnits(oneGwei, "gwei"));
// '1.0'
console.log(ethers.formatUnits(oneGwei, 9));
// '1.0'
console.log(ethers.formatUnits(oneGwei, "ether"));
// `0.000000001`
console.log(ethers.formatUnits(1000000000, "gwei"));
// '1.0'
console.log(ethers.formatEther(oneGwei));
// `0.000000001` same as formatUnits(value, "ether")
console.groupEnd();


// 3. Parsing: Converting from large units to small units
// For example, converting ether to wei: parseUnits(variable, unit), parseUnits defaults to ether as the unit
console.group('\n3. Parsing: Converting from large units to small units, parseUnits');
console.log(ethers.parseUnits("1.0").toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "ether").toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", 18).toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "gwei").toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseUnits("1.0", 9).toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseEther("1.0").toString());
// { BigNumber: "1000000000000000000" } same as parseUnits(value, "ether")
console.groupEnd();
