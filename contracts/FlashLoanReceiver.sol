// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./FlashLoan.sol";
import "./Token.sol";

contract FlashLoanReceiver {
    FlashLoan private pool;
    address private owner;
 
    event LoanReceived(address tokenAddress, uint256 amount);
    
    constructor (address _pooladdress) {
        pool = FlashLoan(_pooladdress);
        owner = msg.sender;
    }
    
    function receiveTokens(address _tokenAddress, uint256 _amount) external {

        require(msg.sender == address(pool),"Sender must be pool");
        require(Token(_tokenAddress).balanceOf(address(this)) == _amount);
        emit LoanReceived(_tokenAddress, _amount);

        //Do stuff with money


        //return funds to pool
        require(Token(_tokenAddress).transfer(msg.sender, _amount), "tranfer token fails");
    }

    function executeFlashLoan(uint _amount) external {
        require(msg.sender == owner,"only owner can execute");
        pool.flashLoan(_amount);
    }
}