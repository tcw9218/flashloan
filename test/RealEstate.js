const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('RealEstate', () => {
    let realEstate, escrow
    let deployer, seller, buyer
    let nftID = 1
    let purchasePrice = ether(100)
    let escrowAmount = ether(20)
    beforeEach(async () => {

        //setup accounts 
        accounts = await ethers.getSigners()
        console.log(accounts)
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]
        inspector = accounts[2]
        lender = accounts[3]

        // Load 
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')

        // deploy
        realEstate = await RealEstate.deploy()
    
        escrow = await Escrow.deploy(
            realEstate.target,
            nftID,
            purchasePrice,
            escrowAmount,
            seller.address,
            buyer.address,
            inspector.address,
            lender.address
        )
    // seller approves transcationi
        transaction = await realEstate.connect(seller).approve(escrow.target, nftID)
        await transaction.wait()
    })

    

    describe('Deployment', async () => {
        it('send  NFT to deployer / seller', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })

    describe('Selling realEstate', async () => {
        let balance, transaction
        it('executes a successful transaction', async () => {
            //expect seller to be the nft owner before the sell
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

            //buyer deposit earnest
            transaction = await escrow.connect(buyer).depositEarnest({ value: escrowAmount })
            
            //Check escrow balance
            balance = await escrow.getBalance()
            console.log("escrow balance: ", ethers.formatEther(balance))


            //Finale sell
            transaction =  await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("buyer finalize sell")

            //expect seller to be the nft buyer after the sell
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)
        })
    })

})