// SPDX-License-Identifier: MIT
// By 0xAA
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// We attempt to frontrun a Free mint transaction
contract FreeMint is ERC721 {
    uint256 public totalSupply;

    // Constructor, initilizes the name and symbol of the NFT collection
    constructor() ERC721("Free Mint NFT", "FreeMint"){}

    // Minting function
    function mint() external {
        totalSupply++;
        _mint(msg.sender, totalSupply); // mint
    }

}