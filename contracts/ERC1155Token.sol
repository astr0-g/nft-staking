// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

error Not__Tyskos();

contract NFTMint is ERC1155, Ownable, ERC1155Burnable {
    address skakingpooladdress;
    uint256 public constant Drible = 0;
    constructor() ERC1155('') {
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setSkakingpooladdress(address _skakingpooladdress) public onlyOwner {
        skakingpooladdress = _skakingpooladdress;
    }

    function mint(
        address account,
        uint256 amount
    ) public {
        if (msg.sender != skakingpooladdress) revert Not__Tyskos();
        _mint(account, Drible, amount, "");
    }
}
