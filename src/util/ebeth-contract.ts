import * as later from 'later';
import { toScheduleFormat, minutesToMilliSeconds } from './utils';
import { CONTRACT_LOCATION } from './constants';
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

const bettingContractJSON = require(CONTRACT_LOCATION + '/Betting.json');
const managerContractJSON = require(CONTRACT_LOCATION + '/BetManager.json');
const managerAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
const bettingContract = new web3.eth.Contract(bettingContractJSON['abi']);
const managerContract = new web3.eth.Contract(managerContractJSON['abi']);

bettingContract.options.data = bettingContractJSON['bytecode'];
managerContract.options.address = managerAddress;

let alreadyDeployed = {};

export const deploy = async fixture => {
  if (!(fixture.fid in alreadyDeployed)) {
    alreadyDeployed = { ...alreadyDeployed, [fixture.fid]: true };
    const startTime = new Date(fixture['ko_f']);
    const kickOffTime = startTime.getTime() / 1000;
    const accounts = await web3.eth.getAccounts();
    bettingContract
      .deploy({
        arguments: [fixture['tm_h'], 'Draw', fixture['tm_a'], kickOffTime],
      })
      .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '2000000000',
      })
      .then(function(newContractInstance) {
        fixture['address'] = newContractInstance.options.address;
        managerContract.methods
          .addEvent(fixture.address)
          .send({ from: accounts[0] })
          .then(function(receipt) {
            console.log(`Created match id: ${fixture.fid} Tx: ${receipt.transactionHash}`);
          })
          .catch(function(error) {
            delete alreadyDeployed[fixture.fid];
            console.log('Sending info to manager was cancelled due to error: ' + error);
          });
      })
      .catch(function(error) {
        delete alreadyDeployed[fixture.fid];
        console.log('Deplying contract was cancelled due to error: ' + error);
      });

    later.setTimeout(() => {
      startMatch(fixture.fid);
    }, toScheduleFormat(startTime));

    const stopTime = new Date(startTime.getTime() + minutesToMilliSeconds(100));
    later.setTimeout(() => {
      stopMatch(fixture.fid);
    }, toScheduleFormat(stopTime));
  }
};

export const startMatch = async fixture => {
  console.log(`Starting match id: ${fixture.fid}`);
  bettingContract.options.address = fixture.address;
  const accounts = await web3.eth.getAccounts();
  bettingContract.methods
    .eventStarted()
    .send({ from: accounts[0] })
    .then(function(receipt) {
      console.log(receipt.transactionHash);
    });
  console.log(fixture.fid);
};

export const stopMatch = async fixture => {
  console.log(`Deleting ${fixture.fid} from alreadyDeployed`);
  bettingContract.options.address = fixture.address;
  const accounts = await web3.eth.getAccounts();
  bettingContract.methods
    .eventOver(1)
    .send({ from: accounts[0] })
    .then(function(receipt) {
      console.log(receipt.transactionHash);
    });
  delete alreadyDeployed[fixture.fid];
};
