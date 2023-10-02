/* eslint-disable @typescript-eslint/no-unused-vars */
import { WrappedConnection } from './wrappedConnection';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import {
  createMintToCollectionV1Instruction,
  MetadataArgs,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from '@metaplex-foundation/mpl-bubblegum';
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from '@solana/spl-account-compression';
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import * as buffer from 'buffer';
window.Buffer = buffer.Buffer;

export const mintCompressedNft = async (
  connectionWrapper: WrappedConnection,
  nftArgs: MetadataArgs,
  ownerKeypair: AnchorWallet,
  treeAddress: PublicKey,
  collectionMint: PublicKey,
  collectionMetadata: PublicKey,
  collectionMasterEditionAccount: PublicKey
) => {
  const [treeAuthority, _bump] = await PublicKey.findProgramAddress(
    [treeAddress.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  const [bgumSigner, __] = await PublicKey.findProgramAddress(
    [Buffer.from('collection_cpi', 'utf8')],
    BUBBLEGUM_PROGRAM_ID
  );
  const mintIx = createMintToCollectionV1Instruction(
    {
      merkleTree: treeAddress,
      treeAuthority,
      treeDelegate: ownerKeypair.publicKey,
      payer: ownerKeypair.publicKey,
      leafDelegate: ownerKeypair.publicKey,
      leafOwner: ownerKeypair.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      collectionAuthority: ownerKeypair.publicKey,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMint: collectionMint,
      collectionMetadata: collectionMetadata,
      editionAccount: collectionMasterEditionAccount,
      bubblegumSigner: bgumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      metadataArgs: Object.assign(nftArgs, {
        collection: { key: collectionMint, verified: false },
      }),
    }
  );
  const tx = new Transaction().add(mintIx);
  tx.feePayer = ownerKeypair.publicKey;

  const blockhash = (await connectionWrapper.getLatestBlockhash()).blockhash;
  tx.recentBlockhash = blockhash;

  const transaction = await ownerKeypair.signTransaction(tx);

  const serialized = transaction.serialize({
    requireAllSignatures: true,
    verifySignatures: true,
  });

  try {
    const signature = await connectionWrapper.sendEncodedTransaction(
      serialized.toString('base64'),
      {
        maxRetries: 5,
        skipPreflight: true,
      }
    );

    return signature;
  } catch (e) {
    console.error('Failed to mint compressed NFT', e);
    throw e;
  }
};

export const getCompressedNftId = async (
  treeAddress: PublicKey,
  leafIndex: number
) => {
  const node = new BN.BN(leafIndex);
  const [assetId] = await PublicKey.findProgramAddress(
    [
      Buffer.from('asset', 'utf8'),
      treeAddress.toBuffer(),
      Uint8Array.from(node.toArray('le', 8)),
    ],
    BUBBLEGUM_PROGRAM_ID
  );
  return assetId;
};

export const createCompressNftTnx = async (
  connection: WrappedConnection,
  nftArgs: MetadataArgs,
  serverKeypair: Keypair,
  userAddress: PublicKey,
  treeAddress: PublicKey,
  collectionMint: PublicKey,
  collectionMetadata: PublicKey,
  collectionMasterEditionAccount: PublicKey
) => {
  const [treeAuthority, _bump] = await PublicKey.findProgramAddress(
    [treeAddress.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  const [bgumSigner, __] = await PublicKey.findProgramAddress(
    [Buffer.from('collection_cpi', 'utf8')],
    BUBBLEGUM_PROGRAM_ID
  );
  const mintIx = createMintToCollectionV1Instruction(
    {
      merkleTree: treeAddress,
      treeAuthority: treeAuthority,
      treeDelegate: serverKeypair.publicKey,
      payer: serverKeypair.publicKey,
      leafDelegate: userAddress,
      leafOwner: userAddress,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      collectionAuthority: serverKeypair.publicKey,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMint: collectionMint,
      collectionMetadata: collectionMetadata,
      editionAccount: collectionMasterEditionAccount,
      bubblegumSigner: bgumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      metadataArgs: Object.assign(nftArgs, {
        collection: { key: collectionMint, verified: false },
      }),
    }
  );

  const tx = new Transaction().add(mintIx);
  tx.feePayer = serverKeypair.publicKey;
  try {
    const sig = await sendAndConfirmTransaction(
      connection,
      tx,
      [serverKeypair],
      {
        commitment: 'confirmed',
        skipPreflight: true,
      }
    );
    return sig;
  } catch (e) {
    console.error('Failed to mint compressed NFT', e);
    throw e;
  }
};
