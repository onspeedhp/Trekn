/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Button, Slider } from 'antd';
import { Connection, Transaction, clusterApiUrl } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import Map from '../components/Map';
import { useParams } from 'react-router';
import { formatNumber, getStatusLocation } from '../utils/common.utils';
import { Carousel } from 'react-responsive-carousel';
import { CloseIcon, GroupIcon } from '../icons';
import { useWindowSize } from '../hooks/useWindownSize';
import { useAuthContext } from '../context/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { PopupMint } from '../components/PopupMint';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import MetalCoinImg from '../icons/metal-coin.png';
import request from '../axios';
import * as buffer from 'buffer';
window.Buffer = buffer.Buffer;

function Details() {
  const wallet = useAnchorWallet();
  const walletAddress = useWallet();
  const { coordsNow, getLocationDetail, locationDetail } = useAuthContext();

  const [openMintDrawer, setOpenMintDrawer] = useState(false);
  const [statusMint, setStatusMint] = useState('minting');
  const [photoLinkMintSuccess, setPhotoLinkMintSuccess] = useState<string>();
  const [isShowMore, setIsShowMore] = useState(false);
  const [actionButton, setActionButton] = useState<ReactNode>();
  const [isShowSlider, setShowSlider] = useState(true);

  const { width } = useWindowSize();
  const { id } = useParams();

  const { status } = useMemo(() => {
    return getStatusLocation(locationDetail?.distance, locationDetail?.radius);
  }, [locationDetail]);

  const { Icon, label, title } = useMemo(() => {
    return getStatusLocation(locationDetail?.distance, locationDetail?.radius);
  }, [locationDetail]);

  const handleSetDataPopup = (
    status: string,
    photoLink?: string,
    actionButton?: ReactNode
  ) => {
    setOpenMintDrawer(true);
    setStatusMint(status);
    setPhotoLinkMintSuccess(photoLink);
    setActionButton(actionButton);
  };

  const handleClick = async () => {
    setOpenMintDrawer(true);
    setStatusMint('minting');
    if (walletAddress.publicKey) {
      const res = await request.post('nft/mint', {
        address: walletAddress.publicKey?.toString(),
        locationId: id,
      });
      if (res.status === 200) {
        handleMint(res.data);
      } else {
        handleSetDataPopup('mintFailed', MetalCoinImg);
      }
    } else {
      handleSetDataPopup(
        'connectWallet',
        '',
        <WalletMultiButton
          startIcon={undefined}
          style={{
            width: '100%',
            height: 40,
            backgroundColor: 'black',
            color: 'white',
            fontSize: 12,
            borderRadius: 24,
            fontWeight: 'bold',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #00A868',
          }}
        />
      );
    }
  };

  const handleMint = async (data: IMintTransactionData) => {
    try {
      if (wallet && data.transaction) {
        const transactionBuffer = Buffer.from(data.transaction, 'base64');

        const connection = new Connection(
          process.env.REACT_APP_HELIUS_RPC_URL!
        );
        const transaction = Transaction.from(transactionBuffer);

        const { lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.lastValidBlockHeight = lastValidBlockHeight;

        const tx = await wallet.signTransaction(transaction);
        // const { blockhash } = await connection.getLatestBlockhash();
        // tx.recentBlockhash = blockhash;

        const serialized = tx.serialize({
          requireAllSignatures: true,
          verifySignatures: true,
        });
        const signature = await connection.sendEncodedTransaction(
          serialized.toString('base64'),
          { skipPreflight: true, maxRetries: 5 }
        );

        if (signature) {
          handleSetDataPopup(
            'mintSuccess',
            data.photoLink,
            <Button className='w-full rounded-[24px] bg-black text-white'>
              Share to socials
            </Button>
          );
          console.log(signature);
        }
      }
    } catch (error) {
      handleSetDataPopup(
        'mintFailed',
        MetalCoinImg,
        <Button
          className='w-full rounded-[24px] bg-black text-white'
          onClick={() => handleClosePopup()}
        >
          Retry
        </Button>
      );
      console.error('There was an error sending the request', error);
    }
  };

  const handleClosePopup = () => {
    setOpenMintDrawer(false);
    setPhotoLinkMintSuccess('');
    setActionButton(<div></div>);
  };

  useEffect(() => {
    if (id) {
      getLocationDetail(id);
    }
  }, [id, coordsNow]);

  return (
    <>
      {isShowSlider && (
        <div className='w-full h-auto bg-gradient-to-r from-green-400 to-green-100 px-[16px] pt-[10px] pb-[1px] relative'>
          <p className='text-[12px] font-medium'>
            Enjoy zero-fee mint for the first 100,000 cNFT
          </p>
          <Slider
            min={0}
            max={100000}
            value={3000}
            handleStyle={{ display: 'none' }}
            trackStyle={{ background: 'black' }}
            railStyle={{ background: 'white' }}
          />
          <CloseIcon
            className='absolute top-[4px] right-[4px] cursor-pointer'
            onClick={() => setShowSlider(false)}
          />
        </div>
      )}
      <div className='w-auto mb-[88px] px-[20px] sm:px-0'>
        <div
          style={{
            backgroundImage:
              width >= 640
                ? "url('https://vapa.vn/wp-content/uploads/2022/12/anh-canh-dep-001-1.jpg')"
                : '',
          }}
          className='mb-[40px] w-full bg-cover flex sm:items-center sm:justify-center sm:h-[264px] sm:mb-[60px]'
        >
          <div className='max-w-[870px] sm:w-[870px] sm:ml-auto sm:mr-auto'>
            <div className='sm:mb-6 w-full text-black sm:text-white'>
              <div className='w-[130px] mt-[10px] font-medium	text-xs rounded-[60px] h-6 flex justify-center items-center border-[1px] border-solid border-black sm:border-white'>
                <Icon stroke='white' />
                <div className='ml-1'>{label}</div>
              </div>

              <div className='mt-3 text-[34px] font-bold font-sans'>
                {locationDetail?.name}
              </div>
              <div className='mt-3 flex text-xs font-medium'>
                <p>{`${locationDetail?.address} • ${formatNumber(
                  locationDetail?.nftMintedCount
                )} minted`}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='max-w-[870px] ml-auto mr-auto'>
          <div className='mb-[60px]'>
            <div className='flex items-center mb-[24px]'>
              <GroupIcon />
              <p className='font-bold text-[28px] ml-[10px]'>{title}</p>
            </div>
            <div
              className='rounded-xl mb-10'
              style={{
                width: '100%',
                height: 335,
              }}
            >
              <Map data={locationDetail} coordsNow={coordsNow} />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-[24px] items-start sm:grid-cols-2 '>
            <div>
              <Carousel
                showArrows={true}
                emulateTouch={true}
                dynamicHeight={true}
                showStatus={false}
                showThumbs={false}
              >
                {locationDetail?.locationPhotos?.map((currentSlide, index) => (
                  <img src={currentSlide.photoLink} alt='' key={index} />
                ))}
              </Carousel>
            </div>

            <div>
              {locationDetail?.description?.length < 70 ? (
                <div className='text-base text-[#71717A] w-[100%] mb-3'>
                  {locationDetail?.description}
                </div>
              ) : (
                <>
                  <div
                    className={`text-base text-[#71717A] w-[100%] mb-3 ${
                      !isShowMore && 'line-clamp-6'
                    }`}
                  >
                    {locationDetail?.description}
                  </div>
                  {!isShowMore && locationDetail?.description && (
                    <div
                      className='flex w-full font-semibold text-base	text-[#00A868] mb-10 cursor-pointer'
                      onClick={() => setIsShowMore(true)}
                    >
                      View more
                    </div>
                  )}
                </>
              )}

              <div className='w-full p-[20px] bg-white fixed bottom-0 left-0 z-50 sm:static'>
                <Button
                  className='w-full h-12 rounded-3xl  flex items-center justify-center text-base font-bold bg-black text-white mb-[12px]'
                  onClick={() => handleClick()}
                  disabled={status === 'readyToMint' ? false : true}
                >
                  {status === 'readyToMint' ? ' Mint proof' : 'Go here to mint'}
                </Button>
                <Button
                  className='h-12 rounded-3xl w-full flex items-center justify-center text-base font-bold bg-black text-white'
                  disabled
                >
                  Mint all collections
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopupMint
        status={statusMint}
        isOpenPopup={openMintDrawer}
        onClosePopup={() => handleClosePopup()}
        linkPhoto={photoLinkMintSuccess}
        buttonAction={actionButton}
      />
    </>
  );
}

export default Details;

interface IMintTransactionData {
  transaction: string;
  name: string;
  collectionName: string;
  rarity: number;
  photoLink: string;
  description: string;
  author: string;
  session: number;
}
