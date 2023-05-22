const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledCampaignFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'pepper save cabbage morning frog spirit caught skate team casual suspect void',
  'https://goerli.infura.io/v3/a20b7fd180544a66bd0a97b1c7786080'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({data: compiledCampaignFactory.evm.bytecode.object})
    .send({gas: '3000000', from: accounts[0]});

  console.log('ABI for CampaignFactory contract', compiledCampaignFactory.abi);
  console.log('Campaign factory contract deployed to address:', result.options.address);

  provider.engine.stop();
};

deploy();
