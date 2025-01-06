import React, { useRef, useState } from 'react';

const Cloud = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = async () => {
    const files = fileInputRef.current.files;
  
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("file", files[0]); // Ensure that you're sending a single file
  
      setLoading(true);
  
      try {
        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          setUploadedFiles([data.file]); // Update the uploaded files state
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("An unexpected error occurred during file upload.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select a file to upload.");
    }
  };
  
  

  return (
    <>
      <h2>Upload Multiple Files to Google Drive</h2>

      <input type="file" multiple ref={fileInputRef} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Submit"}
      </button>

      {uploadedFiles.length > 0 && (
        <div>
          <h3>Uploaded Files:</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name} (ID: {file.id})</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Cloud;
