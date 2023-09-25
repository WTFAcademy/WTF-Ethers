import { ethers } from "ethers";

// 1. BigNumber class
console.group('\n1. BigNumber class');

const oneGwei = ethers.getBigInt("1000000000"); // Generate from decimal string
console.log(oneGwei)
console.log(ethers.getBigInt("0x3b9aca00")) // Generate from hex string
console.log(ethers.getBigInt(1000000000)) // Generate from number
// Cannot generate BigNumber from a number outside the maximum safe integer in JavaScript, the following code will throw an error
// ethers.getBigInt(Number.MAX_SAFE_INTEGER);
console.log("Maximum safe integer in JavaScript:", Number.MAX_SAFE_INTEGER)

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