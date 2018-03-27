import { daemon } from './daemon';
import * as later from 'later';
import { everyDay } from './util/constants';
import { resumeTimers } from './util/ebeth-contract';

const startup = async () => {
  await resumeTimers();
  later.date.UTC();
  later.setInterval(daemon, everyDay);
};

startup();
