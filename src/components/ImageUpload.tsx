import React, { useState } from 'react';

export const ImageUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setFiles((prevFiles) => [...prevFiles, file]);
      console.log('upload file ' + file.name);
    }
  };

  return (
    <form>
      <div>
        <h2>Upload images</h2>
      </div>
      <h3>Images</h3>
      <input type='file' onChange={fileSelectedHandler} />
    </form>
  );
};
