import {getFixtures} from './league-api';
import {deploy} from './util/ebeth-contract';

let currentFixtures = [];

export const daemon = async () => {
  currentFixtures = await getFixtures().then(r => (r));
  console.log(currentFixtures);

  currentFixtures.forEach(fixture => {
    deploy(fixture);
  });

};