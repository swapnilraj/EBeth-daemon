import * as later from 'later';

export const everyDay = later.parse.recur().on('23:59:00').time();

export const CONTRACT_LOCATION = process.env['EBETH_CONTRACT'] || './test';