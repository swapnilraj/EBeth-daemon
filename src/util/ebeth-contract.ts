import * as later from 'later';
import { toScheduleFormat, minutesToMilliSeconds } from './utils';
import { CONTRACT_LOCATION } from './constants';
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://0.0.0.0:8545'));

const bettingContractJSON = require(CONTRACT_LOCATION + '/Betting.json');
const managerContractJSON = require(CONTRACT_LOCATION + '/BetManager.json');
const managerAddress = '0x72212ec4a000c3f7667661cf6b873d7e15e496f2';
const bettingContract = new web3.eth.Contract(bettingContractJSON['abi']);
const managerContract = new web3.eth.Contract(managerContractJSON['abi']);

bettingContract.options.data = bettingContractJSON['bytecode'];
managerContract.options.address = managerAddress;

let alreadyDeployed = {};

export const deploy = async (fixture, index) => {
  if (!(fixture.fid in alreadyDeployed)) {
    try {
      alreadyDeployed = { ...alreadyDeployed, [fixture.fid]: true };
      const startTime = new Date(fixture['ko_t']);
      const accounts = await web3.eth.getAccounts();
      const jsonIndex = '' + index + '';

      const newContractInstance = await bettingContract
        .deploy({
          arguments: [fixture['tm_h'], 'Draw', fixture['tm_a'], startTime.getTime(), jsonIndex],
        })
        .send({
          from: accounts[0],
          gas: 4700000,
          gasPrice: '300000000000',
        });

      fixture['address'] = newContractInstance.options.address;
      await sendToManager(fixture, accounts, startTime);
    } catch (e) {
      delete alreadyDeployed[fixture.fid];
      console.log('Deploying contract was cancelled due to error: ' + e + '\n Trying again.');
      await deploy(fixture, index);
    }
  }
};

const sendToManager = async (fixture, accounts, startTime) => {
  try {
    console.log('Sending to manager ' + fixture.fid + ':' + fixture['tm_h'] + ' vs ' + fixture['tm_a']);
    const receipt = await managerContract.methods.addEvent(fixture.address).send({ from: accounts[0] });

    console.log(`Created match id: ${fixture.fid} Tx: ${receipt.transactionHash}`);

    later.setTimeout(() => {
      startMatch(fixture);
    }, toScheduleFormat(startTime));

    const stopTime = new Date(startTime.getTime() + minutesToMilliSeconds(130));
    later.setTimeout(() => {
      stopMatch(fixture.fid);
    }, toScheduleFormat(stopTime));

    console.log('Fixture ' + fixture.fid + ' has been sent to manager.');
  } catch (e) {
    console.log('Sending info for ' + fixture.fid + 'to manager was cancelled due to error: ' + e + '\n Trying again.');
    await sendToManager(fixture, accounts, startTime);
  }
};

export const startMatch = async fixture => {
  console.log(`Starting match id: ${fixture.fid}`);
  bettingContract.options.address = fixture.address;
  const accounts = await web3.eth.getAccounts();
  bettingContract.methods
    .eventStarted()
    .send({ from: accounts[0], gas: 200000, gasPrice: '300000000000' })
    .then(function(receipt) {
      console.log(receipt.transactionHash);
    })
    .catch(function(error) {
      console.log(error);
    });
  console.log(fixture.fid);
};

export const stopMatch = async fixture => {
  console.log(`Deleting ${fixture.fid} from alreadyDeployed`);
  bettingContract.options.address = fixture.address;
  const accounts = await web3.eth.getAccounts();
  bettingContract.methods
    .eventOver()
    .send({ from: accounts[0], value: 6000000000000000, gas: 200000, gasPrice: '300000000000' })
    .then(function(receipt) {
      console.log(receipt.transactionHash);
    })
    .catch(function(error) {
      console.log(error);
    });
  delete alreadyDeployed[fixture.fid];
};
