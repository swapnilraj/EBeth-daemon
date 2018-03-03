import * as later from 'later';
import {toScheduleFormat} from './utils';
let alreadyDeployed = {};

export const deploy = (fixture) => {
  if(!(fixture.fid in alreadyDeployed)) {
    alreadyDeployed = {...alreadyDeployed, [fixture.fid]: true};
    console.log(fixture);

    const startTime = toScheduleFormat(new Date(fixture['ko_f']));
    later.setTimeout(() => { startMatch(fixture.fid)}, startTime);
  }
  // Currently only logs the fixture later it will deploy the contract
  // if not already deployed
};

export const startMatch = (fid) => {
  console.log(`Starting match id: ${fid}`);
  console.log(fid);
};

export const stopMatch = (fid) => {
  console.log(`Deleting ${fid} from alreadyDeployed`);
  delete alreadyDeployed[fid];
}