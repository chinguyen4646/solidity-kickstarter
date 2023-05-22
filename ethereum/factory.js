import web3 from './web3';
import compiledCampaignFactory from './build/CampaignFactory.json';

const campaignFactoryContractAddress = '0x486F31358Eb91F68ae26f09F4A0311EeCE171A23';
const instance = new web3.eth.Contract(compiledCampaignFactory.abi, campaignFactoryContractAddress);

// this file gives us access to a local instance of our deployed contract instead of having to run the above commands everytime
export default instance;
