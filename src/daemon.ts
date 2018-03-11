import { getFixtures } from './league-api';
import { deploy } from './util/ebeth-contract';

let currentFixtures = [];

export const daemon = async () => {
  currentFixtures = await getFixtures().then(r => r);

  for (let i = 0; i < currentFixtures.length; i++) {
    await deploy(currentFixtures[i], i);
  }
};
