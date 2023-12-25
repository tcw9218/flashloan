// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _tokenId) external;
}

contract Escrow {
    address public nftAddress;
    uint256 public nftID;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable public seller;
    address payable public buyer;
    address public lender;
    address public inspector;

    constructor(address _nftADdress,
                uint256 _nftID,
                uint256 _purchasePrice,
                uint256 _escrowAmount,
                address payable _seller,
                address payable _buyer,
                address payable _lender,
                address payable _inspector
                ) {
        nftAddress = _nftADdress;
        nftID = _nftID;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        seller = _seller;
        buyer = _buyer;
        lender = _lender;
        inspector = _inspector;
    }

    function finalizeSale() public {
        //Transfer  owenerShip of property
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function depositEarnest() public payable{
        
    }
}