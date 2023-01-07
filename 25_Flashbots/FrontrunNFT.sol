// SPDX-License-Identifier: MIT
// By 0xAA from wtf.academy
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// A Simple ERC721 NFT
contract FlashbotsNFT is ERC721 {
    uint256 public totalSupply;

    // 构造函数，初始化NFT合集的名称、代号
    constructor() ERC721("WTF Flashbots NFT", "WTFFlashbots"){}

    // 铸造函数
    function mint() external {
        _mint(msg.sender, totalSupply); // mint
        totalSupply++;
    }
}
