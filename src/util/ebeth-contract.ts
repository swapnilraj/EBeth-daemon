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

const managerAddress = '0x19ab6a9e79288f22e3a8536684991f0c2656d3fe';

bettingContract.options.data = bettingContractJSON['bytecode'];
managerContract.options.address = managerAddress;

let alreadyDeployed = {};

/**
 * Resumes the startMatch and stopMatch timers for matches that are already
 * managed by the BetManager.
 */
export const resumeTimers = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const betEvents = await _getAvailableBets(accounts[0]);
    for (const betEvent of betEvents) {
      bettingContract.options.address = betEvent;
      const fid = await bettingContract.methods.fid().call({ from: accounts[0] });
      alreadyDeployed = { ...alreadyDeployed, [fid]: true };
      const kickOff = await bettingContract.methods.kickOffTime().call({ from: accounts[0] });
      const startTime = new Date(parseInt(kickOff, 10));
      const index = await bettingContract.methods.jsonIndex().call({ from: accounts[0] });

      const fixture = { fid: fid, address: betEvent };

      later.setTimeout(() => {
        startMatch(fixture);
      }, toScheduleFormat(startTime));

      const stopTime = new Date(startTime.getTime() + minutesToMilliSeconds(105));

      const sch = later.parse
        .recur()
        .every(2)
        .minute();

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
    }
  } catch {}
};

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

      later.setTimeout(() => {
        startMatch(fixture);
      }, toScheduleFormat(startTime));

      const stopTime = new Date(startTime.getTime() + minutesToMilliSeconds(105));

      const sch = later.parse
        .recur()
        .every(2)
        .minute();

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

      console.log(`Match started: ${fixture.fid}`);
    } catch {}
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
  console.log(`Match started: ${fixture.fid}`);
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

/**
 * Returns the amount of BetEvents managed by the smart contract.
 * @param account the address of the user account.
 * @returns amount of BetEvents managed by the smart contract.
 */
const _getAmountOfBets = async (account: string): Promise<number> => {
  const length = await managerContract.methods.length().call({ from: account });
  return length;
};

/**
 * returns an array of addresses to Betting contracts managed by the smart contract.
 * @param account Address of the user account.
 * @returns Array of addresses of Betting contracts.
 */
const _getAllBets = async (account: string): Promise<string[]> => {
  const length = await _getAmountOfBets(account);
  const addresses: string[] = [];
  for (let i = 0; i < length; i++) {
    addresses[i] = await managerContract.methods.betEvents(i).call({ from: account });
  }
  return addresses;
};

/**
 * Returns an array of bets for which the event is not over.
 * @param account Address of the user account.
 * @returns Array of bets for which the event is not over.
 */
const _getAvailableBets = async (account: string): Promise<string[]> => {
  const availableBets: string[] = [];
  const betEvents = await _getAllBets(account);
  for (const betEvent of betEvents) {
    bettingContract.options.address = betEvent;
    const state = await bettingContract.methods.state().call({ from: account });
    if (state < 2) {
      availableBets.push(betEvent);
    }
  }
  return availableBets;
};
