import * as later from 'later';
import { toScheduleFormat, minutesToMilliSeconds } from './utils';
const Web3 = require('web3');
let alreadyDeployed = {};

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

const managerAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';

const bettingContract = new web3.eth.Contract([
  {
    constant: true,
    inputs: [],
    name: 'creator',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_outcomeIndex', type: 'uint256' }],
    name: 'placeBet',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'outcomeOne',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'eventStarted',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'uint256' }],
    name: 'totalPools',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'outcomeTwo',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'kickOffTime',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'outcomeThree',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'bets',
    outputs: [
      { name: 'outcomeIndex', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'paid', type: 'bool' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'claimWinnings',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'state',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_outcomeIndex', type: 'uint256' }],
    name: 'eventOver',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'winningIndex',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_outcomeIndex', type: 'uint256' }],
    name: 'changeBet',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_outcomeOne', type: 'string' },
      { name: '_outcomeTwo', type: 'string' },
      { name: '_outcomeThree', type: 'string' },
      { name: '_kickOffTime', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
]);
const managerContract = new web3.eth.Contract([
  {
    constant: true,
    inputs: [],
    name: 'creator',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'uint256' }],
    name: 'betEvents',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'length',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'eventAddr', type: 'address' }],
    name: 'addEvent',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
]);
managerContract.options.address = managerAddress;

export const deploy = async fixture => {
  if (!(fixture.fid in alreadyDeployed)) {
    alreadyDeployed = { ...alreadyDeployed, [fixture.fid]: true };
    const startTime = new Date(fixture['ko_f']);
    const kickOffTime = startTime.getTime() / 1000;
    const accounts = await web3.eth.getAccounts();
    bettingContract.options.data =
      '0x606060405234156200001057600080fd5b60405162000e2838038062000e2883398101604052808051820191906020018051820191906020018051820191906020018051906020019091905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508360019080519060200190620000a492919062000131565b508260029080519060200190620000bd92919062000131565b508160039080519060200190620000d692919062000131565b50806004819055506004604051805910620000ee5750595b90808252806020026020018201604052506005908051906020019062000116929190620001b8565b50600560068190555060006007819055505050505062000232565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200017457805160ff1916838001178555620001a5565b82800160010185558215620001a5579182015b82811115620001a457825182559160200191906001019062000187565b5b509050620001b491906200020a565b5090565b828054828255906000526020600020908101928215620001f7579160200282015b82811115620001f6578251825591602001919060010190620001d9565b5b5090506200020691906200020a565b5090565b6200022f91905b808211156200022b57600081600090555060010162000211565b5090565b90565b610be680620002426000396000f3006060604052600436106100d0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f146100d557806310fe7c481461012a57806329f7c1f91461014257806330af5c56146101d057806338367f24146101e557806362031c461461021c5780636be705f0146102aa57806376f9bbad146102d357806389a78f1a14610361578063b401faf1146103c0578063c19d93fb146103d5578063c8839a1e146103fe578063de75be4e14610421578063edd7bb751461044a575b600080fd5b34156100e057600080fd5b6100e861046d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101406004808035906020019091905050610492565b005b341561014d57600080fd5b61015561058c565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561019557808201518184015260208101905061017a565b50505050905090810190601f1680156101c25780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101db57600080fd5b6101e361062a565b005b34156101f057600080fd5b610206600480803590602001909190505061068a565b6040518082815260200191505060405180910390f35b341561022757600080fd5b61022f6106ae565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561026f578082015181840152602081019050610254565b50505050905090810190601f16801561029c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102b557600080fd5b6102bd61074c565b6040518082815260200191505060405180910390f35b34156102de57600080fd5b6102e6610752565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561032657808201518184015260208101905061030b565b50505050905090810190601f1680156103535780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561036c57600080fd5b610398600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506107f0565b6040518084815260200183815260200182151515158152602001935050505060405180910390f35b34156103cb57600080fd5b6103d3610827565b005b34156103e057600080fd5b6103e8610a06565b6040518082815260200191505060405180910390f35b341561040957600080fd5b61041f6004808035906020019091905050610a0c565b005b341561042c57600080fd5b610434610a74565b6040518082815260200191505060405180910390f35b341561045557600080fd5b61046b6004808035906020019091905050610a7a565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006007541415156104a357600080fd5b60606040519081016040528082815260200134815260200160001515815250600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082015181600001556020820151816001015560408201518160020160006101000a81548160ff0219169083151502179055509050503460058281548110151561054857fe5b906000526020600020900160008282540192505081905550346005600381548110151561057157fe5b90600052602060002090016000828254019250508190555050565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106225780601f106105f757610100808354040283529160200191610622565b820191906000526020600020905b81548152906001019060200180831161060557829003601f168201915b505050505081565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156106885760016007819055505b565b60058181548110151561069957fe5b90600052602060002090016000915090505481565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107445780601f1061071957610100808354040283529160200191610744565b820191906000526020600020905b81548152906001019060200180831161072757829003601f168201915b505050505081565b60045481565b60038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107e85780601f106107bd576101008083540402835291602001916107e8565b820191906000526020600020905b8154815290600101906020018083116107cb57829003601f168201915b505050505081565b60086020528060005260406000206000915090508060000154908060010154908060020160009054906101000a900460ff16905083565b600080600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209150600654826000015414151561087f57600080fd5b60646063600560065481548110151561089457fe5b90600052602060002090015484600101548115156108ae57fe5b0460056006548154811015156108c057fe5b906000526020600020900154600560038154811015156108dc57fe5b9060005260206000209001540302028115156108f457fe5b048260010154019050600015158260020160009054906101000a900460ff16151514151561092157600080fd5b60018260020160006101000a81548160ff02191690831515021790555081600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201548160000155600182015481600101556002820160009054906101000a900460ff168160020160006101000a81548160ff0219169083151502179055509050503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501515610a0257600080fd5b5050565b60075481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610a71578060068190555060026007819055505b50565b60065481565b600080600754141515610a8c57600080fd5b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050806001015460058260000154815481101515610ae557fe5b9060005260206000209001600082825403925050819055508060010154600583815481101515610b1157fe5b90600052602060002090016000828254019250508190555081816000018190555080600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201548160000155600182015481600101556002820160009054906101000a900460ff168160020160006101000a81548160ff02191690831515021790555090505050505600a165627a7a72305820f6730a8ce26e5e803e9bed8db8690b54b5c71ee427ba2fc4fbc08db5bb336ae20029';
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
        console.log(`Created match id: ${fixture.fid}`);
        fixture['address'] = newContractInstance.options.address;
        managerContract.methods
          .addEvent(fixture.address)
          .send({ from: accounts[0] })
          .then(function(receipt) {
            console.log(receipt.transactionHash);
          })
          .catch(function(error) {
            console.log('Sending info to manager was cancelled due to error: ' + error);
          });
      })
      .catch(function(error) {
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
