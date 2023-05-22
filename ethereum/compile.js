const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // removeSync() removes a directory or file based on path

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const src = fs.readFileSync(campaignPath, 'utf8'); // readFileSync() reads from file and encodes

const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: src
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

for (const contract in output.contracts['Campaign.sol']) {
  fs.outputJSONSync( // outputJSONSync() writes out a JSON file to a directory
    path.resolve(buildPath, contract + '.json'),
    output.contracts['Campaign.sol'][contract]
  );
}
