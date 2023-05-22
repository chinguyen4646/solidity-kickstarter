/* eslint-disable no-undef */
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let campaignFactory;
let accounts;
let campaignAddress;
let campaign;

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // deploy a new contract (use bytecode)
  campaignFactory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({
      data: compiledCampaignFactory.evm.bytecode.object
    })
    .send({from: accounts[0], gas: '3000000'});

  await campaignFactory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '3000000'
  });

  [campaignAddress] = await campaignFactory.methods.getDeployedCampaigns().call();

  // find an already deployed contract (use abi + contract address)
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(campaign.options.address);
    assert.ok(campaignFactory.options.address);
  });

  it('marks caller and campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('should mark account as approver after contribution', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether')
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributor);
  });

  it('requires a min amount of ether to contribute', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: web3.utils.toWei('20', 'wei')
      });
      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  it('allows manager to make payment request', async () => {
    await campaign.methods
      .createRequest('Buy apples', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '3000000'
      });

    const request = await campaign.methods.requests(0).call();

    assert.equal('Buy apples', request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({from: accounts[0], gas: '3000000'});

    await campaign.methods
      .approveRequest(0)
      .send({
        from: accounts[0],
        gas: '3000000'
      });

    await campaign.methods
      .finaliseRequest(0)
      .send({
        from: accounts[0],
        gas: '3000000'
      });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    console.log('3', balance);
    assert(balance > 100);
  });
});
