import { Keypair } from '@solana/web3.js';
import base58 from 'bs58';
import { WrappedConnection } from './wrappedConnection';
import fs from 'fs';
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from '@metaplex-foundation/js';
const dotenv = require('dotenv');
dotenv.config();

const dataURLToArrayBuffer = (dataURL: any) => {
  const base64 = dataURL.split(',')[1];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const createMetadata = async (dataURL: any, drop: any) => {
  const secretKey = process.env.REACT_SERVER_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      'Wallet secret key must be provided via SECRET_KEY env var'
    );
  }
  let decodedSecretKey;
  try {
    decodedSecretKey = base58.decode(secretKey);
  } catch {
    throw new Error(
      'Invalid secret key provided. Must be a base 58 encoded string.'
    );
  }

  const serverKeypair = Keypair.fromSecretKey(decodedSecretKey);

  const connection = new WrappedConnection(
    serverKeypair,
    process.env.REACT_APP_HELIUS_RPC_URL!
  );

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(serverKeypair))
    .use(
      bundlrStorage({
        address: 'http://node1.bundlr.network',
        providerUrl: 'https://api.mainnet-beta.solana.com',
        timeout: 60000,
      })
    );

  const buffer = dataURLToArrayBuffer(dataURL);
  const file = toMetaplexFile(buffer, 'image.png');

  const imageUri = await metaplex.storage().upload(file);

  const { uri } = await metaplex.nfts().uploadMetadata({
    name: drop.name,
    symbol: 'cNFT',
    description: drop.desc,
    image: imageUri,
    attributes: [
      {
        trait_type: 'Drop name',
        value: drop.name,
      },
      {
        trait_type: 'Collected time',
        value: drop.created_at,
      },
      {
        trait_type: 'Drop location',
        value: drop.location,
      },
      {
        trait_type: 'Drop desc',
        value: drop.desc,
      },
    ],
  });

  return uri;
};
