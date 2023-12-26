const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('FlashLoan', () => {
    let token, flashLoan, flashLoanReceiver
    let deployer, anyone

    beforeEach( async() => {
        let transaction
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        anyone = accounts[1]

        //Load counts
        const FlashLoan = await ethers.getContractFactory('FlashLoan')
        const FlashLoanReceiver = await ethers.getContractFactory('FlashLoanReceiver')
        const Token = await ethers.getContractFactory('Token')

        //Deploy
        token = await Token.deploy('wuDapp', 'Dapp', 100000)
        flashLoan = await FlashLoan.deploy(token.target)
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.target)

        //approve before 
        transaction = await token.connect(deployer).approve(flashLoan.target, tokens(10000))
        await transaction.wait()

        //deposit to pool
        transaction = await flashLoan.connect(deployer).depositTokens(tokens(10000))
        await transaction.wait()

      
    })

    describe('Deployment',()=>{

        it('send tokens to flashloan pool contract', async() => {
            expect( await token.balanceOf(flashLoan.target)).to.equal(tokens(10000))
        })
    })

    describe('Borrowing Funds', () => {
        it('borrow funds from pool', async() => {
            let amount = tokens(100)
            let transaction = await flashLoanReceiver.connect(deployer).executeFlashLoan(amount)
            await transaction.wait()

            await expect(transaction).to.emit(flashLoanReceiver, 'LoanReceived')
                    .withArgs(token.target, amount)
        })
    })
})