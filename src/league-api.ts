import axios from 'axios';

const BASE_URL = 'http://fplalerts.com/api/fpl_lhs_17.php';

export const getFixtures = async (): Promise<any> => {
  const requestOpt = {
    method: 'GET',
    url: BASE_URL,
  };

  return axios(requestOpt)
    .then(res => res.data.scores)
    .catch(err => err);
};
