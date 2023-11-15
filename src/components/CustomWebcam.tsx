import React, { useState } from 'react';

export const CustomWebcam = () => {
  const [imgSrc, setImgSrc] = useState<any>(null);

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageSrc = URL.createObjectURL(file);
      setImgSrc(imageSrc);
    }
  };

  const retake = () => {
    setImgSrc(null);
  };

  return (
    <div className='container'>
      {imgSrc ? (
        <img src={imgSrc} alt='Captured' />
      ) : (
        <input
          type='file'
          accept='image/*'
          capture='environment'
          onChange={handleImageChange}
        />
      )}
      <div className='btn-container'>
        {imgSrc ? <button onClick={retake}>Retake photo</button> : null}
      </div>
    </div>
  );
};
