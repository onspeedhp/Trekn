import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaShare } from 'react-icons/fa';
import PointPlusItem from '../components/PointPlusItem';
import ReactCardFlip from 'react-card-flip';
import { prominent } from 'color.js';
import { useSelector } from 'react-redux';
import { formatLocation } from '../functions/text';
import { formatCurrentTime } from '../functions/time';

export const MintSuccess = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const { metadata, windowSize } = useAuthContext();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleError = () => {
    const modal = Modal.error({
      title: 'Error',
      content: 'Something was wrong',
      okButtonProps: {
        type: 'default',
        style: {
          background: 'red',
          color: 'white',
        },
      },
    });

    setTimeout(() => {
      modal.destroy();
      navigate('/map-view');
    }, 2000);
  };

  useEffect(() => {
    if (!metadata.sig || !metadata.image) {
      handleError();
    }
  });

  const [borderColor, setBorderColor] = useState<any>("");

  useEffect(() => {
    const getColorBorder = async (url: string) => {
      const color = await prominent(url, { amount: 1, format: 'hex' })
      setBorderColor(color);
    }
    getColorBorder(user.profileImage);
  }, [user])

  return (
    <div className='bg-black absolute w-full' style={{ minHeight: windowSize.height }}>
      <div className='mx-5 text-white font-semibold' style={{ marginTop: 58 }}>
        <div className='flex-col'>
          <PointPlusItem icon point='100' />
          <div className='text-2xl my-3 font-bold gap-3'>
            Checkin successful
          </div>
          <div className='text-[#FFFFFF80] font-medium text-base'>
            This experience has been stored in your custodial wallet. Check your Profile Assets.
          </div>
        </div>
        <div className={`my-8 mx-auto rounded-xl w-[339px] h-[339px] rounded-xl overflow-hidden relative`}>
          <ReactCardFlip isFlipped={isFlipped} containerClassName='w-full h-full'>
            <img
              src={metadata.image}
              alt='Uploaded'
              className='w-full h-full object-cover object-center'
            />
            <div className='w-full h-full bg-[#7D7D7D33] p-5'>
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-[1px] w-16 h-16 overflow-hidden border box-content flex-shrink-0`}
                  style={{ borderColor }}>
                  <img src={user.profileImage} alt="" className='w-full h-full object-center object-cover rounded-full' />
                </div>
                <p className="text-xl font-semibold leading-5 truncate ...">{user.name}</p>
              </div>
              <p className="mt-6 text-base font-medium leading-[11px]">
                Check in at{' '}
                <span className='underline font-semibold'>
                  {metadata.name}
                </span>
              </p>
              <p className="mt-6 text-base font-medium leading-[11px] text-[#C1C1C1] truncate ...">
                {formatLocation(metadata?.location)}
              </p>
              <p className="mt-4 text-base font-medium leading-[11px] text-[#C1C1C1] truncate ...">
                {formatCurrentTime()}
              </p>
              <div className="mt-6 flex items-center gap-2" onClick={() => {
                const url = `https://solscan.io/tx/${metadata.sig}`;
                // Open a new window or tab with the specified URL
                const newWindow = window.open(url, '_blank');

                // Focus on the new window (optional)
                if (newWindow) {
                  newWindow.focus();
                }
              }}>
                <FaExternalLinkAlt color='#FFFFFFB2' width={16} height={16} />
                <p className='text-[13px] font-semibold leading-4 tracking-[-0.08px]'>View on scanner</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="87" height="107" viewBox="0 0 87 107" fill="none" className='absolute bottom-0 left-0'>
                <g clip-path="url(#clip0_2372_11279)">
                  <path d="M87 0H-87V174H87V0Z" fill="#201F1F" />
                </g>
                <defs>
                  <clipPath id="clip0_2372_11279">
                    <rect x="-87" width="174" height="174" rx="87" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </ReactCardFlip>
          <div className="bg-[#434343] rounded-full w-11 h-11 flex items-center justify-center absolute bottom-5 right-5"
            onClick={() => setIsFlipped(prev => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18.3333 1.66667H8.33333C7.89131 1.66667 7.46738 1.84226 7.15482 2.15482C6.84226 2.46738 6.66667 2.89131 6.66667 3.33333V13.3333C6.66667 13.5543 6.57887 13.7663 6.42259 13.9226C6.26631 14.0789 6.05435 14.1667 5.83333 14.1667C5.61232 14.1667 5.40036 14.0789 5.24408 13.9226C5.0878 13.7663 5 13.5543 5 13.3333V3.33333C5 2.44928 5.35119 1.60143 5.97631 0.976311C6.60143 0.35119 7.44928 0 8.33333 0L18.3333 0C19.2174 0 20.0652 0.35119 20.6904 0.976311C21.3155 1.60143 21.6667 2.44928 21.6667 3.33333V13.3333C21.6667 13.5543 21.5789 13.7663 21.4226 13.9226C21.2663 14.0789 21.0543 14.1667 20.8333 14.1667C20.6123 14.1667 20.4004 14.0789 20.2441 13.9226C20.0878 13.7663 20 13.5543 20 13.3333V3.33333C20 2.89131 19.8244 2.46738 19.5118 2.15482C19.1993 1.84226 18.7754 1.66667 18.3333 1.66667ZM20 23.3333C20 23.7754 19.8244 24.1993 19.5118 24.5118C19.1993 24.8244 18.7754 25 18.3333 25H8.33333C7.89131 25 7.46738 24.8244 7.15482 24.5118C6.84226 24.1993 6.66667 23.7754 6.66667 23.3333V20C6.66667 19.779 6.57887 19.567 6.42259 19.4107C6.26631 19.2545 6.05435 19.1667 5.83333 19.1667C5.61232 19.1667 5.40036 19.2545 5.24408 19.4107C5.0878 19.567 5 19.779 5 20V23.3333C5 24.2174 5.35119 25.0652 5.97631 25.6904C6.60143 26.3155 7.44928 26.6667 8.33333 26.6667H18.3333C19.2174 26.6667 20.0652 26.3155 20.6904 25.6904C21.3155 25.0652 21.6667 24.2174 21.6667 23.3333V20C21.6667 19.779 21.5789 19.567 21.4226 19.4107C21.2663 19.2545 21.0543 19.1667 20.8333 19.1667C20.6123 19.1667 20.4004 19.2545 20.2441 19.4107C20.0878 19.567 20 19.779 20 20V23.3333ZM2.855 13.2567C3.05568 13.1641 3.21135 12.9955 3.28778 12.7881C3.3642 12.5808 3.3551 12.3515 3.2625 12.1508C3.21665 12.0515 3.15167 11.9621 3.07128 11.8878C2.99089 11.8136 2.89667 11.7559 2.79398 11.7181C2.5866 11.6416 2.35735 11.6507 2.15667 11.7433C1.57833 12.01 1.06667 12.3233 0.686667 12.6933C0.306667 13.07 0 13.565 0 14.1667C0 15.0767 0.68 15.7333 1.37167 16.1683C2.105 16.6317 3.11 17.0183 4.28 17.3283C6.63 17.955 9.83 18.3333 13.3333 18.3333C13.4983 18.3333 13.6617 18.3333 13.8233 18.33L11.91 20.2433C11.8325 20.3208 11.7711 20.4128 11.7291 20.514C11.6872 20.6153 11.6656 20.7238 11.6656 20.8333C11.6656 20.9429 11.6872 21.0514 11.7291 21.1526C11.7711 21.2539 11.8325 21.3459 11.91 21.4233C12.0665 21.5798 12.2787 21.6677 12.5 21.6677C12.6096 21.6677 12.7181 21.6461 12.8193 21.6042C12.9205 21.5623 13.0125 21.5008 13.09 21.4233L16.4233 18.09C16.5009 18.0126 16.5625 17.9206 16.6045 17.8194C16.6465 17.7181 16.6682 17.6096 16.6682 17.5C16.6682 17.3904 16.6465 17.2819 16.6045 17.1806C16.5625 17.0794 16.5009 16.9874 16.4233 16.91L13.09 13.5767C13.0125 13.4992 12.9205 13.4377 12.8193 13.3958C12.7181 13.3539 12.6096 13.3323 12.5 13.3323C12.3904 13.3323 12.2819 13.3539 12.1807 13.3958C12.0795 13.4377 11.9875 13.4992 11.91 13.5767C11.8325 13.6541 11.7711 13.7461 11.7291 13.8474C11.6872 13.9486 11.6656 14.0571 11.6656 14.1667C11.6656 14.2762 11.6872 14.3847 11.7291 14.486C11.7711 14.5872 11.8325 14.6792 11.91 14.7567L13.8183 16.6633L13.3333 16.6667C9.93333 16.6667 6.88333 16.2983 4.71 15.7183C3.61667 15.4267 2.79167 15.095 2.26 14.76C1.68667 14.3983 1.66667 14.1767 1.66667 14.1667C1.66667 14.1617 1.66667 14.0683 1.85333 13.8833C2.045 13.6967 2.37 13.48 2.85333 13.2567H2.855ZM24.51 11.7433C24.3093 11.6507 24.0801 11.6416 23.8727 11.7181C23.6653 11.7945 23.4968 11.9502 23.4042 12.1508C23.3116 12.3515 23.3025 12.5808 23.3789 12.7881C23.4553 12.9955 23.611 13.1641 23.8117 13.2567C24.2983 13.48 24.6217 13.6967 24.8117 13.885C25 14.0683 25 14.1617 25 14.1667C25 14.1717 25 14.275 24.7833 14.4783C24.5633 14.6817 24.1967 14.9117 23.655 15.145C22.58 15.6117 20.995 16.0167 19.05 16.29C18.8342 16.3243 18.6405 16.4421 18.5107 16.6178C18.3808 16.7936 18.3252 17.0133 18.3558 17.2297C18.3864 17.446 18.5008 17.6417 18.6743 17.7746C18.8477 17.9074 19.0665 17.9668 19.2833 17.94C21.3033 17.6567 23.05 17.2233 24.3167 16.6767C24.95 16.4033 25.505 16.0817 25.9167 15.6983C26.3267 15.3167 26.6667 14.8033 26.6667 14.1667C26.6667 13.5633 26.36 13.0667 25.98 12.695C25.6 12.3233 25.0883 12.01 24.51 11.7433Z" fill="white" />
            </svg>
          </div>
          {/* <div className="flex justify-center gap-6 text-[13px] font-bold">
            <div className='flex items-center'
              //   href={}
              onClick={() => {
                const url = `https://solscan.io/tx/${metadata.sig}`;
                // Open a new window or tab with the specified URL
                const newWindow = window.open(url, '_blank');

                // Focus on the new window (optional)
                if (newWindow) {
                  newWindow.focus();
                }
              }}
            >
              <FaExternalLinkAlt className='mr-2' />
              View on scanner
            </div>
            <div className='flex items-center'>
              <FaShare className='mr-2' />
              Share on social
            </div>
          </div> */}
        </div>
        <div className="flex items-center gap-3">
        <Button
            className='bg-[#2E2E2E] text-white border-0  w-1/4 h-12 rounded-3xl flex items-center justify-center hover:opacity-80'
          >
            <FaShare className='w-6 h-6' color='#FFFFFFB2'/>
          </Button>
          <Button
            className='bg-[#2E2E2E] text-white border-0  w-full h-12 rounded-3xl font-semibold text-base flex items-center justify-center'
            onClick={() => {
              navigate('/');
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
