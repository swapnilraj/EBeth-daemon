# EBeth-daemon

Daemon which runs and deploys smart contracts for EBeth betting services and interacts with the contracts autonomously.

## Pre-requisites:
* node
* yarn
* npm
* geth

## How to run?
Before running the daemon, a geth node must be run on the computer. This can be done using:
```
geth --testnet --rpc --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --syncmode "light" --rpccorsdomain '*' --rpcaddr 0.0.0.0 --rpcport 8545 --cache 8192
```

Note that it might take a while to find a peer since we are using the Ropsten test network with a light geth node.

The first account managed by the geth client must be unlocked to allow transactions to be sent. Firsly the geth javascript console must be started using:

```
geth attach http://0.0.0.0:8545
```

Unlock the account using:

```
personal.unlockAccount(eth.accounts[0],"password",0)
```

If an account has not been added to the geth client, it can be done as so:

```
personal.importRawKey("private key","password")
```

Other useful commands for the javascript console can be found [here](https://github.com/ethereum/go-ethereum/wiki/Management-APIs)

Before running export the location of the binary compiled version of your smart contract, like:
```
  export EBETH_CONTRACT=~/foo
```

Initialise dependecies
```
  yarn install
```
Run
```
  yarn start
```

## Workings

The daemon pulls the fixtures from a fantasy league API, and runs the deploy function periodically. The deploy function checks if a contract was already deployed for that fixture if not then it deploys the contract and schedules the `startMatch` function for it, the `startMatch` function schedules the `stopMatch` function for the fixture.
