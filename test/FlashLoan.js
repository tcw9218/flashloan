const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('FlashLoan', () => {

    beforeEach(() => {

    })

    describe('Deployment',()=>{

        it('works', () => {
            expect(1+1).to.equal(2)
        })
    })
})