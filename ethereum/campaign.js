import web3 from './web3';
import compiledCampaign from './build/Campaign.json';

export default (campaignContractAddress) => {
  const instance = new web3.eth.Contract(compiledCampaign.abi, campaignContractAddress);
  return instance;
};
