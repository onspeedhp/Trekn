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
import { supabase } from '../utils/supabaseClients';

export const mintCompressedNFT = async ({
  drop,
  userAddress,
  image,
  description,
  onSuccess,
  userId,
  onError = () => { },
}: {
  drop: any;
  userAddress: PublicKey;
  userId: any;
  image?: string;
  description?: string;
  onSuccess: (data: any, sig: any, userData: any) => void;
  onError: (error: any) => void;
}) => {
  // check if user is already mint
  const { data: minted, error: m_error } = await supabase
    .from('minted')
    .select('*')
    .eq('ownerId', userId)
    .eq('drop_id', drop.id);

  if (!minted || minted.length === 0) {
    // web3 side
    const serverKeypair = Keypair.fromSecretKey(
      base58.decode(process.env.REACT_APP_SERVER_SECRET_KEY!)
    );

    const connection = new WrappedConnection(
      serverKeypair,
      process.env.REACT_APP_HELIUS_RPC_URL!
    );

    const treeAddress = new PublicKey(process.env.REACT_APP_TREE_AUTHORITY!);
    const collectionMint = new PublicKey(
      process.env.REACT_APP_COLLECTION_MINT!
    );
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

    // Add minted to minted table

    await createMinted({
      userId: userId,
      drop: drop,
      ...(image && { image }),
      ...(description && { description }),

      onSuccess: async (data: any, { point, weeklyPoint }) => {
        let uri = `${process.env.REACT_APP_BACKEND}/drop/get-uri/${data.id}`;

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

          // web 2 side
          if (sig) {
            onSuccess(data, sig, { point, weeklyPoint });
          } else {
            onError('Cannot mint this NFT');
          }
        } catch (error) {
          onError(error);
        }
      },
      onError: () => {
        onError('Cannot mint this NFT');
      },
    });
  } else {
    onError('You have already collect this NFT');
  }
};
