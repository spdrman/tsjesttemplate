//import * as dotenv from "dotenv";
//dotenv.config(); // use .env for NODE_ENV variables

import {getSymbols} from './data';

const DATA_SOURCE_URL = 'https://financialmodelingprep.com/api/v3';
const PATH = './src/generated/securities.json';
const APIKEY = process.env.NODE_FMP_KEY ?? undefined;

if (!APIKEY) {
  console.error(
    'UNABLE TO OBTAIN API KEY FROM ENV -- Ensure .env contains an entry for NODE_FMP_KEY'
  );
}

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
const URLS = new Map([
  //['equities', `${DATA_SOURCE_URL}/stock/list?apikey=${APIKEY}`],
  //['forex', `${DATA_SOURCE_URL}/fx?apikey=${APIKEY}`],
  //['crypto', `${DATA_SOURCE_URL}/symbol/available-cryptocurrencies?apikey=${APIKEY}`]
  ['equities', `${DATA_SOURCE_URL}/stock/list`],
  ['forex', `${DATA_SOURCE_URL}/fx`],
  ['crypto', `${DATA_SOURCE_URL}/symbol/available-cryptocurrencies`],
]);

class App {
  /** Entry point of our app */
  public static async start() {
    getSymbols().then(data => {
      console.log(data);
    });
  }
}

App.start();
