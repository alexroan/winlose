const HighOrLow = artifacts.require('HighOrLow')
const web3 = require('web3')

require('chai').use(require('chai-as-promised')).should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

function wadDiv(x, y) {
  return (x * WAD + y / 2) / y
}

contract('HighOrLow', (accounts) => {
  const [deployer, user1] = accounts

  WAD = 10 ** 18

  let hol

  beforeEach(async () => {})

  describe('deployment', async () => {})
})
