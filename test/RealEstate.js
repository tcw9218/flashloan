const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('RealEstate', () => {
    let realEstate, escrow
    let deployer, seller, buyer
    let transaction
    let nftID = 1
    beforeEach(async () => {

        //setup accounts 
        accounts = await ethers.getSigners()
        console.log(accounts)
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]

        // Load 
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')

        // deploy
        realEstate = await RealEstate.deploy()
    
        escrow = await Escrow.deploy(
            realEstate.target,
            nftID,
            seller.address,
            buyer.address
        )
    // seller approves transcationi
        seller
        transaction = await realEstate.connect(seller).approve(escrow.target, nftID)
        await transaction.wait()
    })

    

    describe('Deployment', async () => {
        it('send  NFT to deployer / seller', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })

    describe('Selling realEstate', async () => {
        it('executes a successful transaction', async () => {
            //expect seller to be the nft owner before the sell
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

            transaction =  await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("buyer finalize sell")

            //expect seller to be the nft buyer after the sell
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)
        })
    })

})