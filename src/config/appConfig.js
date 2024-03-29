/*
 * @copyRight by md sarwar hoshen.
 */

const appConfig = {
  STAGE: process.env.REACT_APP_APP_STAGE,
  SERVER_TEST: process.env.REACT_APP_API_URL_TEST,
  SERVER_LIVE: process.env.REACT_APP_API_URL_LIVE,
};
//
export const apiUrl = () =>{
    return appConfig.STAGE === 'LIVE' ? appConfig.SERVER_LIVE : appConfig.SERVER_TEST
}
//
export default appConfig;
