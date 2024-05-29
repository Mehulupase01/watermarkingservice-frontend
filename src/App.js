import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [status, setStatus] = useState('');

  const gcfEndpoint = process.env.REACT_APP_GCF_BACKEND_URL;
  const k8sEndpoint = process.env.REACT_APP_K8S_BACKEND_URL;

  const [backendUrl, setBackendUrl] = useState(gcfEndpoint);

  const handleFileUpload = async () => {
    setStatus('Uploading files...');
    const formData = new FormData();
    formData.append('video', video);
    formData.append('image', image);

    try {
      const response = await axios.post(`${backendUrl}/api/watermark/upload`, formData);
      console.log('Response:', response.data);
      setResultUrl(response.data.url);
      setStatus('Watermark applied successfully');
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error uploading files');
    }
  };

  const handleUrlUpload = async () => {
    setStatus('Uploading URLs...');
    try {
      const response = await axios.post(`${backendUrl}/api/watermark/upload-url`, {
        videoUrl,
        imageUrl,
      });
      console.log('Response:', response.data);
      setResultUrl(response.data.url);
      setStatus('Watermark applied successfully');
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error uploading URLs');
    }
  };

  const handleBackendChange = (event) => {
    setBackendUrl(event.target.value);
  };

  return (
    <div>
      <h1>Video Watermarking Service</h1>
      <div>
        <label>
          <strong>Select Backend:</strong>
          <select onChange={handleBackendChange} value={backendUrl}>
            <option value={gcfEndpoint}>Google Cloud Function</option>
            <option value={k8sEndpoint}>Google Kubernetes Engine</option>
          </select>
        </label>
      </div>
      <div>
        <h2>Upload Files</h2>
        <label>
          <strong>Video:</strong>
          <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
        </label>
        <label>
          <strong>Image:</strong>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </label>
        <button onClick={handleFileUpload}>Upload</button>
      </div>
      <div>
        <h2>Or Provide URLs</h2>
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button onClick={handleUrlUpload}>Submit</button>
      </div>
      {status && <p>Status: {status}</p>}
      {resultUrl && (
        <div>
          <h2>Watermarked Video</h2>
          <a href={resultUrl} target="_blank" rel="noopener noreferrer">
            {resultUrl}
          </a>
          <video controls src={resultUrl} width="600"></video>
          <div>
            <a href={resultUrl} download="watermarked_video.mp4">
              <button>Download Video</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
