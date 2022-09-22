// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ERC1155Token.sol";
import "./ERC721Token.sol";

error Not__Owner();
error No__Rewards();

contract Staking is ERC721Holder {
    NFTMint private NFTItem;
    IERC721 private token;
    uint256 private totalTokens;
    uint256 month = 2629743; //2629743 for a month

    struct StakedToken {
        address staker;
        uint256 tokenId;
    }

    struct Staker {
        uint256 amountStaked;
        StakedToken[] stakedTokens;
        address tokenOwner;
        uint256 Updateblocktime;
        uint256 unclaimedpoints;
    }

    mapping(address => Staker) public stakers;
    mapping(uint256 => address) public stakerAddress;

    constructor(address _token, address _NFTItem) {
        token = IERC721(_token);
        NFTItem = NFTMint(_NFTItem);
    }

    event Stake(address indexed owner, uint256 id, uint256 time);
    event UnStake(address indexed owner, uint256 id, uint256 time);
    event Claimed(address indexed owner, uint256 time, uint256 numOfRewardTokens);

    function calculatePoints(address _staker) internal view returns (uint256 _rewards) {
        return (
            (
                (
                    ((block.timestamp - stakers[_staker].Updateblocktime) *
                        stakers[_staker].amountStaked)
                )
            )
        );
    }

    function claimRewards() public {
        uint256 rewards = calculatePoints(msg.sender) + stakers[msg.sender].unclaimedpoints;
        uint256 numOfNft = rewards / month;
        if (numOfNft < 1) revert No__Rewards();
        if (numOfNft >= 1) stakers[msg.sender].Updateblocktime = block.timestamp;
        stakers[msg.sender].unclaimedpoints = rewards % month;
        NFTItem.mint(msg.sender, numOfNft);
        emit Claimed(msg.sender, block.timestamp, numOfNft);
    }

    function stakeNFT(uint256 _tokenId) public {
        if (token.ownerOf(_tokenId) != msg.sender) revert Not__Owner();
        StakedToken memory stakedToken = StakedToken(msg.sender, _tokenId);
        stakers[msg.sender].stakedTokens.push(stakedToken);
        stakers[msg.sender].amountStaked++;
        
        stakerAddress[_tokenId] = msg.sender;
        stakers[msg.sender].tokenOwner = msg.sender;
        stakers[msg.sender].Updateblocktime = block.timestamp;
        token.safeTransferFrom(msg.sender, address(this), _tokenId, "0x00");
        emit Stake(msg.sender, _tokenId, block.timestamp);
    }

    function unStakeNFT(uint256 _tokenId) public {
        if (stakerAddress[_tokenId] != msg.sender) revert Not__Owner();
        if (stakers[msg.sender].amountStaked < 1) revert Not__Owner();
        claimRewards();
        uint256 index = 0;
        for (uint256 i = 0; i < stakers[msg.sender].stakedTokens.length; i++) {
            if (
                stakers[msg.sender].stakedTokens[i].tokenId == _tokenId &&
                stakers[msg.sender].stakedTokens[i].staker != address(0)
            ) {
                index = i;
                break;
            }
        }

        stakers[msg.sender].stakedTokens[index].staker = address(0);

        stakers[msg.sender].amountStaked--;

        stakerAddress[_tokenId] = address(0);
        token.safeTransferFrom(address(this), msg.sender, _tokenId, "0x00");
        stakers[msg.sender].Updateblocktime = block.timestamp;

        emit UnStake(msg.sender, _tokenId, block.timestamp);
    }
}
