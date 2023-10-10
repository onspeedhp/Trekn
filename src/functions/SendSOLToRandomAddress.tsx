import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Button } from "antd";
import React, { FC, useCallback } from "react";
import { Buffer } from "buffer";

export const SendSOLToRandomAddress: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const data = Buffer.alloc(4 + 8);
    data.writeUInt32LE(2, 0);
    data.writeUInt32LE(100000, 4);
    data.writeUInt32LE(0, 8);
    const receiver = new PublicKey(
      "AU54M8qrVBq48V7gjJBhifx3Dk2NwUjJSN1iDryAzwqg"
    );
    const ix = new TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: receiver,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: SystemProgram.programId,
      data: data,
    });
    const transaction = new Transaction();
    transaction.add(ix);

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();

    const signature = await sendTransaction(transaction, connection, {
      minContextSlot,
    });

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
  }, [publicKey, sendTransaction, connection]);

  return (
    <Button onClick={onClick} disabled={!publicKey}>
      Send SOL to a random address!
    </Button>
  );
};
