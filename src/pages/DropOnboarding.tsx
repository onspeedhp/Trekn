import { Button } from 'antd';
import { useNavigate } from 'react-router';
export const DropOnboarding = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className='relative bg-cover bg-center'
        style={{
          height: 812,
          backgroundImage: "url('./background_gradient.png')",
        }}
      >
        <div className='m-5 absolute text-white font-semibold'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='17'
            height='16'
            viewBox='0 0 17 16'
            fill='none'
            className='mb-6'
            onClick={() => {
              navigate('/home');
            }}
          >
            <path
              d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
              fill='white'
              fillOpacity='0.7'
            />
          </svg>

          <div className='mb-12'>
            <div className='text-white text-2xl font-bold mb-2'>
              Drop an Experience
            </div>
            <div className='text-white text-lg opacity-70'>
              Now, every moment you capture can become a part of the global
              Trekn community, immortalized on the blockchain as a collectible
              cNFT.
            </div>
          </div>

          <div className='mb-6'>
            <div
              className='bg-[#99FF48] text-black rounded-lg flex items-center pl-2 text-base mb-4'
              style={{ height: 38 }}
            >
              How Does It Works?
            </div>
            <div className='mb-3'>
              1. <span className='font-semibold'>Discover: </span>
              <span className='opacity-70'>
                Find a hidden gem—a café, a scenic viewpoint, a local
                event—anything that you think is share-worthy.
              </span>
            </div>
            <div className='mb-3'>
              2. <span className='font-semibold'>Create: </span>
              <span className='opacity-70'>
                Use the Trekn app to "Drop an Experience" at your current
                location. Add your photos, stories, or tips about this place.
              </span>
            </div>
            <div className='mb-3'>
              3. <span className='font-semibold'>Share & Claim: </span>
              <span className='opacity-70'>
                Once you've dropped an experience, anyone visiting that location
                can claim this cNFT, adding it to their own collection of
                treasured memories.
              </span>
            </div>
          </div>

          <Button
            className='bg-white w-full h-12 rounded-3xl font-semibold text-base'
            onClick={() => {
              navigate('/drop-onboarding/enter-name');
            }}
          >
            Start creating
          </Button>
        </div>
      </div>
    </>
  );
};
