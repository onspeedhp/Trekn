import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import base58 from 'bs58';
import {
  Collection,
  TokenProgramVersion,
  TokenStandard,
} from '@metaplex-foundation/mpl-bubblegum';
import { createCompressNftTnx } from './utils';
import { WrappedConnection } from './wrappedConnection';
import { createMinted } from '../middleware/data/minted';

export const mintCompressedNFT = async ({
  dropId,
  userAddress,
  onSuccess,
  onError = () => {},
}: {
  dropId: number;
  userAddress: PublicKey;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  // web3 side
  const serverKeypair = Keypair.fromSecretKey(
    base58.decode(process.env.REACT_APP_SERVER_SECRET_KEY!)
  );

  const connection = new WrappedConnection(
    serverKeypair,
    process.env.REACT_APP_HELIUS_RPC_URL!
  );

  const treeAddress = new PublicKey(process.env.REACT_APP_TREE_AUTHORITY!);
  const collectionMint = new PublicKey(process.env.REACT_APP_COLLECTION_MINT!);
  const collectionMetadataAccount = new PublicKey(
    process.env.REACT_APP_COLLECTION_METADATA_ACCOUNT!
  );
  const collectionMasterEditionAccount = new PublicKey(
    process.env.REACT_APP_COLLECTION_MASTER_EDITOR!
  );

  const collection: Collection = {
    verified: false,
    key: collectionMint,
  };
  const nftArgs = {
    name: 'Imperial Citadel of Thang Long',
    symbol: 'CSI',
    uri: 'https://arweave.net/kDRgLIHeVP4kko_UXv4CSJGkniVtHwylc4o3FoOOWc8',
    creators: [],
    editionNonce: 253,
    tokenProgramVersion: TokenProgramVersion.Original,
    tokenStandard: TokenStandard.NonFungible,
    uses: null,
    collection: collection,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    isMutable: false,
  };

  const sig = await createCompressNftTnx(
    connection,
    nftArgs,
    serverKeypair,
    userAddress,
    treeAddress,
    collectionMint,
    collectionMetadataAccount,
    collectionMasterEditionAccount
  );

  // web 2 side

  if (sig) {
    await createMinted({
      minted: {
        who: userAddress.toString(),
        drop_id: dropId,
      },
      onSuccess: (data) => {
        onSuccess({
          sig,
          data,
        });
      },
      onError: () => {
        onError('');
      },
    });
  } else {
    onError('');
  }
};
