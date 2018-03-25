import * as later from 'later';
import { toScheduleFormat, minutesToMilliSeconds } from './utils';
import { CONTRACT_LOCATION } from './constants';
import { isFinished } from '../league-api';
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://0.0.0.0:8545'));

const bettingContractJSON = require(CONTRACT_LOCATION + '/Betting.json');
const managerContractJSON = require(CONTRACT_LOCATION + '/BetManager.json');
const bettingContract = new web3.eth.Contract(bettingContractJSON['abi']);
const managerContract = new web3.eth.Contract(managerContractJSON['abi']);

const managerAddress = '0x8ab07c51028d09d564fb4a55e537c5983373eea1';

bettingContract.options.data = bettingContractJSON['bytecode'];
managerContract.options.address = managerAddress;

let alreadyDeployed = {};

/**
 * Deploys a fixture as a smart contract and starts timers to manage the state of
 * the contract.
 * @param fixture An object containing information about the fixture.
 * @param index The index of the fixture in the api.
 */
export const deploy = async (fixture: any, index: number) => {
  if (!(fixture.fid in alreadyDeployed)) {
    try {
      alreadyDeployed = { ...alreadyDeployed, [fixture.fid]: true };
      const startTime = new Date(fixture['ko_t']);
      const accounts = await web3.eth.getAccounts();
      const jsonIndex = '' + index + '';

      const newContractInstance = await bettingContract
        .deploy({
          arguments: [
            fixture['tm_h'],
            'Draw',
            fixture['tm_a'],
            startTime.getTime(),
            jsonIndex,
            fixture.fid,
            managerAddress,
          ],
        })
        .send({
          from: accounts[0],
          gas: '4700000',
          gasPrice: '300000000000',
        });

      fixture['address'] = newContractInstance.options.address;
      //await sendToManager(fixture, accounts, startTime);

      later.setTimeout(() => {
        startMatch(fixture);
      }, toScheduleFormat(startTime));

      const stopTime = new Date(startTime.getTime() + minutesToMilliSeconds(105));

      const sch = later.parse.recur.every(2).minute();

      later.setTimeout(() => {
        const t = later.setInterval(() => {
          isFinished(index).then(res => {
            if (res === true) {
              stopMatch(fixture);
              t.clear();
            }
          });
        }, sch);
      }, toScheduleFormat(stopTime));
    } catch (e) {
      console.log('Deploying contract was cancelled due to error: ' + e + '\n');
    }
  }
};

/**
 * Send the address of the Betting smart contract to the BetManager smart contract.
 * @param fixture An object containing information about the fixture.
 * @param accounts An array of Ethereum accounts given by web3.
 * @param startTime The Date object for when the match is meant to start.
 */
const sendToManager = async (fixture, accounts, startTime) => {
  try {
    const receipt = await managerContract.methods.addEvent(fixture.address).send({ from: accounts[0] });
    console.log(`Created match id: ${fixture.fid} Tx: ${receipt.transactionHash}`);
  } catch (e) {
    console.log('Sending info for ' + fixture.fid + 'to manager was cancelled due to error: ' + e + '\n Trying again.');
    await sendToManager(fixture, accounts, startTime);
  }
};

/**
 * Signals the smart contract to stop accepting bets.
 * @param fixture An object containing information about the fixture.
 */
const startMatch = async fixture => {
  console.log(`Starting match id: ${fixture.fid}`);
  bettingContract.options.address = fixture.address;
  const accounts = await web3.eth.getAccounts();
  bettingContract.methods
    .eventStarted()
    .send({ from: accounts[0], gas: '200000', gasPrice: '300000000000' })
    .then(function(receipt) {
      console.log(receipt.transactionHash);
    })
    .catch(function(error) {
      console.log(error);
    });
  console.log('Match started: ' + fixture.fid);
};

/**
 * Signals the smart contract that the match is over.
 * @param fixture An object containing information about the fixture.
 */
const stopMatch = async fixture => {
  console.log(`Deleting ${fixture.fid} from alreadyDeployed`);
  bettingContract.options.address = fixture.address;
  const accounts = await web3.eth.getAccounts();
  bettingContract.methods
    .eventOver()
    .send({ from: accounts[0], value: '12000000000000000', gas: '200000', gasPrice: '300000000000' })
    .then(function(receipt) {
      console.log(receipt.transactionHash);
    })
    .catch(function(error) {
      console.log(error);
    });
  delete alreadyDeployed[fixture.fid];
};
