import { daemon } from './daemon';
import later from 'later';
import {everyDay} from './util/constants';

later.date.UTC();
later.setInterval(daemon, everyDay);