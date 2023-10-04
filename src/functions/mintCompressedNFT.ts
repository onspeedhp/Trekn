import { Keypair, PublicKey } from '@solana/web3.js';
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
  drop,
  userAddress,
  onSuccess,
  onError = () => {},
}: {
  drop: any;
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

  let uri = `${process.env.REACT_APP_BACKEND}/drop/get-uri/${drop.id}`;

  const nftArgs = {
    name: drop.name,
    symbol: 'TNFT',
    uri: uri,
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
  try {
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

    // // web 2 side

    if (sig) {
      await createMinted({
        minted: {
          who: userAddress.toString(),
          drop_id: drop.id,
        },
        onSuccess: () => {
          onSuccess(sig);
        },
        onError: () => {
          onError('');
        },
      });
    } else {
      onError('');
    }
  } catch (error) {
    onError(error);
  }
};
