import React, { useEffect, useState } from "react";

interface ImagePreviewProps {
  imagePreview: string | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imagePreview }) => {
  return (
    <div className="mt-2 mb-3">
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-[200px] h-[200px] object-cover"
        />
      ) : (
        <img
          src="https://png.pngtree.com/png-vector/20231215/ourmid/pngtree-transaction-approved-png-image_11354742.png"
          alt="Placeholder"
          className="w-[200px] h-[200px] object-cover"
        />
      )}
    </div>
  );
};

export default ImagePreview;
