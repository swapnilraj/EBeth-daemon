let alreadyDeployed = {};

export const deploy = (fixture) => {
  if(!(fixture.fid in alreadyDeployed)) {
    alreadyDeployed = {...alreadyDeployed, [fixture.fid]: true};
    console.log(fixture)
  }
  // Currently only logs the fixture later it will deploy the contract
  // if not already deployed
}