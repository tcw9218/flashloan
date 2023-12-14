const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('RealEstate', () => {
    let realestate, escrow
    let deployer, seller
    let nftID = 1
    beforeEach(async () => {

        //setup accounts 
        accounts = await ethers.getSigners()
        console.log(accounts)
        deployer = accounts[0]
        seller = deployer

        // Load 
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')

        // deploy
        realestate = await RealEstate.deploy()
        escrow = await Escrow.deploy()
    })

    

    describe('Deploy', async () => {
        it('send  NFT to deployer', async () => {
            expect(await realestate.ownerOf(nftID)).to.equal(seller.address)
        })
    })

})