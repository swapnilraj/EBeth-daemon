import { getFixtures } from './league-api';
import { deploy } from './util/ebeth-contract';

let currentFixtures = [];

/**
 * Gets fixtures from the api and deploys them.
 */
export const daemon = async () => {
  currentFixtures = await getFixtures().then(r => r);
  currentFixtures.forEach(deploy);
};
