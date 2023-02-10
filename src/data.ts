//"use strict";
import * as fs from 'fs';
import axios from 'axios';

import * as dotenv from 'dotenv';
dotenv.config(); // use .env for NODE_ENV variables

export const DATA_SOURCE_URL = 'https://financialmodelingprep.com/api/v3';
export const PATH = './generated/securities.json';
export const APIKEY = process.env.NODE_FMP_KEY ?? '';

if (!APIKEY) {
  const obj = JSON.stringify(process.env);
  console.log(`.env: ${obj}`);
  console.error(
    'UNABLE TO OBTAIN API KEY FROM ENV -- Ensure .env contains an entry for NODE_FMP_KEY'
  );

  throw new Error('NODE ENV MUST BE SET PROPERLY');
}

interface SymbolListData {
  symbol: string; // Transform to all upper-case
  name: string;
}

interface SymbolData extends SymbolListData {
  exchange: string;
  exchangeShortName: string; // Transform to all upper-case
  type: string; // Transform to all lower-case
}

/*
  EXAMPLE:
  {
    "symbol": "AMD",
    "name": "Advanced Micro Devices, Inc.",
    "price": 85.405,
    "exchange": "NASDAQ Global Select",
    "exchangeShortName": "NASDAQ",
    "type": "stock"
  }
*/
interface StockSymbolData extends SymbolData {
  price: number;
}

/*
  EXAMPLE:
  {
    "symbol": "GARD",
    "name": "Reality Shares Divcon Dividend Guard ETF",
    "price": 22.2855,
    "exchange": "BATS",
    "exchangeShortName": "ETF",
    "type": "etf"
  }
*/
interface EtfSymbolData extends SymbolData {
  price: number;
}

/*
  EXAMPLE:
  {
    "symbol": "MYREUR",
    "name": "MYR/EUR",
    "currency": "EUR",
    "stockExchange": "CCY",
    "exchangeShortName": "FOREX"
  }
*/
interface ForexSymbolData extends SymbolListData {
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

/*
  EXAMPLE:
  {
    "symbol": "NFTXUSD",
    "name": "NFTX",
    "currency": "USD",
    "stockExchange": "CCC",
    "exchangeShortName": "CRYPTO"
  }
*/
interface CryptoSymbolData extends SymbolListData {
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

export const URLS = new Map<string, string>([
  //['equities', `${DATA_SOURCE_URL}/stock/list?apikey=${APIKEY}`],
  //['forex', `${DATA_SOURCE_URL}/fx?apikey=${APIKEY}`],
  //['crypto', `${DATA_SOURCE_URL}/symbol/available-cryptocurrencies?apikey=${APIKEY}`]
  ['stock', `${DATA_SOURCE_URL}/stock/list`],
  ['etf', `${DATA_SOURCE_URL}/etf/list`],
  ['forex', `${DATA_SOURCE_URL}/symbol/available-forex-currency-pairs`],
  ['crypto', `${DATA_SOURCE_URL}/symbol/available-cryptocurrencies`],
]);

interface GetListInput {
  symType: string;
}

export const getSymbolsForType = async (input: GetListInput) => {
  const {symType} = input;
  if (!symType) {
    throw new Error('Argument can`t be empty!');
  }

  const url = URLS.get(symType);

  if (!url) {
    throw new Error('URLS.get() returned an undefined!');
  }

  try {
    const res = await axios.get(url, {
      params: {
        apikey: APIKEY,
      },
    });

    // Map each, depending on which type (switch statement)
    let data: SymbolData[];

    switch (symType) {
      case 'stock':
        data = res.data.reduce(
          (accumulator: SymbolData[], currentValue: StockSymbolData) => {
            /*
              EXAMPLE:
              {
                "symbol": "AMD",
                "name": "Advanced Micro Devices, Inc.",
                "price": 85.405,
                "exchange": "NASDAQ Global Select",
                "exchangeShortName": "NASDAQ",
                "type": "stock"
              }
            */
            const newSymbol: SymbolData = {
              exchange: currentValue.exchange ?? 'stock',
              exchangeShortName: currentValue.exchangeShortName,
              type: currentValue.type?.toLowerCase() ?? 'stock',
              symbol: currentValue.symbol,
              name: currentValue.name,
            };
            if (accumulator.length < 1) {
              accumulator = [newSymbol];
              return accumulator;
            } else {
              accumulator.push(newSymbol);
              return accumulator;
            }
          },
          [] as SymbolData[]
        );

        break;
      case 'etf':
        data = res.data.reduce(
          (accumulator: SymbolData[], currentValue: EtfSymbolData) => {
            const newSymbol: SymbolData = {
              exchange: currentValue.exchange,
              exchangeShortName: currentValue.exchangeShortName,
              type: currentValue.type.toLowerCase(),
              symbol: currentValue.symbol,
              name: currentValue.name,
            };
            if (accumulator.length < 1) {
              accumulator = [newSymbol];
              return accumulator;
            } else {
              accumulator.push(newSymbol);
              return accumulator;
            }
          },
          [] as SymbolData[]
        );

        break;
      case 'forex':
        data = res.data.reduce(
          (accumulator: SymbolData[], currentValue: ForexSymbolData) => {
            /*
              EXAMPLE:
              {
                "symbol": "MYREUR",
                "name": "MYR/EUR",
                "currency": "EUR",
                "stockExchange": "CCY",
                "exchangeShortName": "FOREX"
              }
            */
            const newSymbol: SymbolData = {
              exchange: currentValue.stockExchange,
              exchangeShortName: currentValue.exchangeShortName,
              type: currentValue.exchangeShortName.toLowerCase(),
              symbol: currentValue.symbol,
              name: currentValue.name,
            };
            if (accumulator.length < 1) {
              accumulator = [newSymbol];
              return accumulator;
            } else {
              accumulator.push(newSymbol);
              return accumulator;
            }
          },
          [] as SymbolData[]
        );

        break;
      case 'crypto':
        data = res.data.reduce(
          (accumulator: SymbolData[], currentValue: CryptoSymbolData) => {
            /*
              EXAMPLE:
              {
                "symbol": "NFTXUSD",
                "name": "NFTX",
                "currency": "USD",
                "stockExchange": "CCC",
                "exchangeShortName": "CRYPTO"
              }
            */
            const newSymbol: SymbolData = {
              exchange: currentValue.stockExchange,
              exchangeShortName: currentValue.exchangeShortName,
              type: currentValue.exchangeShortName.toLowerCase(),
              symbol: currentValue.symbol,
              name: currentValue.name,
            };
            if (accumulator.length < 1) {
              accumulator = [newSymbol];
              return accumulator;
            } else {
              accumulator.push(newSymbol);
              return accumulator;
            }
          },
          [] as SymbolData[]
        );

        break;
      default:
        throw new Error(
          `=> ERROR -- data.getSymbolsForType(): Unknown symbol type provided: ${symType}`
        );
    }

    return data;
  } catch (err) {
    console.error(
      `=> ERROR -- secListCreator(${symType}): Error prevented function \n${err}`
    );

    throw err;
  }
};

export const getSymbols = async () => {
  // Compile all records into one big one

  let allSymbols: SymbolData[] = [];

  console.log(`URL.keys() = ${URLS.keys()}`);
  //for (const type in URLS.keys()) {
  for (const record of URLS.keys()) {
    const items = await getSymbolsForType({
      symType: record,
    });
    if (!allSymbols.length) {
      allSymbols = items ?? [];
    } else {
      const enter = items ?? [];
      allSymbols = [...allSymbols, ...enter];
    }
  }

  return allSymbols;
};

//  Convert SymbolData type to JSON and put into file at PATH
export const saveToFile = async (data: SymbolData[]) => {
  fs.writeFile(PATH, '', err => {
    if (err) throw err;
    console.log('File is created successfully.');
  });
  const stream = fs.createWriteStream(PATH, {flags: 'w'});

  stream.write(JSON.stringify(data));

  stream.end();

  return;
};
