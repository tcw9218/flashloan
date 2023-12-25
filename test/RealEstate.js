const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('RealEstate', () => {
    let realEstate, escrow
    let deployer, seller, buyer, inspector, lender
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

            balance = await ethers.provider.getBalance(seller.address)
            console.log('seller balance', ethers.formatEther(balance))
            //expect seller to be the nft owner before the sell
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

            //buyer deposit earnest
            transaction = await escrow.connect(buyer).depositEarnest({ value: escrowAmount })
            
            //Check escrow balance
            balance = await escrow.getBalance()
            console.log("escrow balance: ", ethers.formatEther(balance))

            //inspector update status
            transaction =  await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            console.log("inspection staus changed")

            //Buyer approval sell
            transaction =  await escrow.connect(buyer).approvalSale()
            await transaction.wait()
            console.log("Buyer approval sell")

            //Seller approval sell
            transaction =  await escrow.connect(seller).approvalSale()
            await transaction.wait()
            console.log("Seller approval sell")

            //Lender funds sale
            transaction = await lender.sendTransaction({ to: escrow, value: ether(80) })

            //Lender approval sell
            transaction =  await escrow.connect(lender).approvalSale()
            await transaction.wait()
            console.log("lender approval sell")

            //Finale sell
            transaction =  await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("buyer finalize sell")

            //expect buyer to be the nft owner after the sell
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)

            //expect seller to receive funds
            balance = await ethers.provider.getBalance(seller.address)
            console.log('seller balance', ethers.formatEther(balance))
        })
    })

})