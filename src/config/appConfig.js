/*
 * @copyRight by md sarwar hoshen.
 */

const config = {
  STAGE: process.env.REACT_APP_APP_STAGE,
  SERVER_TEST: process.env.REACT_APP_API_URL_TEST,
  SERVER_LIVE: process.env.REACT_APP_API_URL_LIVE,
  FETCH_LIMIT: 10
};
//
const apiUrl = () =>{
    return config.STAGE === 'LIVE' ? config.SERVER_LIVE : config.SERVER_TEST
}
//
export {apiUrl , config};
