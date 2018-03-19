import axios from 'axios';

const BASE_URL = 'http://fplalerts.com/api/fpl_lhs_17.php';

/**
 * Returns an array of upcoming premier league matches.
 * @returns Array of upcoming premier league matches.
 */
export const getFixtures = async (): Promise<any> => {
  const requestOpt = {
    method: 'GET',
    url: BASE_URL,
  };

  return axios(requestOpt)
    .then(res => res.data.nextgw)
    .catch(err => err);
};

/**
 * Returns a boolean signifying if the match is over or not.
 * @param index The index of the game in the api.
 * @returns Boolean signifying if the match is over or not.
 */
export const isFinished = async (index: number): Promise<boolean> => {
  const requestOpt = {
    method: 'GET',
    url: BASE_URL,
  };

  return axios(requestOpt)
    .then(res => res.data.scores[index].fin === '1')
    .catch(err => err);
};
