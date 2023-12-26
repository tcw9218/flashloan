// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


interface IReceiver {
    function receiveTokens(address tokenAddress, uint256 amount) external;
}
contract FlashLoan {
    using SafeMath for uint256;

    Token public token;
    uint256 public poolBalance;

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function depositTokens(uint256 _amount) external {
        require(_amount > 0);
        token.transferFrom(msg.sender, address(this), _amount);
        poolBalance = poolBalance.add(_amount);

    }

    function flashLoan(uint256 _borrowAmount) external {

        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= _borrowAmount, "not enough token in pool");
        assert(poolBalance == balanceBefore);
        //send token to receivers
        token.transfer(msg.sender, _borrowAmount); // sender is flashloan receiver

        //get paid back
        IReceiver(msg.sender).receiveTokens(address(token), _borrowAmount);

        //ensure loan paid back 
        uint256 balanceAfter =  token.balanceOf(address(this));
        require(balanceAfter >= balanceBefore, "flash loan haven't been paid back");
    }

}