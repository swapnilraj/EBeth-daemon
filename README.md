# EBeth-daemon

Daemon which runs and deploys smart contracts for EBeth betting services and interacts with the contracts autonomously.

## Pre-requisites:
* node
* yarn
* npm

## How to run?
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