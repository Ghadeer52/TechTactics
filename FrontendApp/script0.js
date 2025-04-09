async function uploadVideo() {
    const fileInput = document.getElementById('upload-video');
    const uploadBtn = document.getElementById('upload-btn');
    const loadingBox = document.getElementById('loading-box');
    const resultBox = document.getElementById('result-box');
    const backBtn = document.getElementById('back-btn');
  
    const video = fileInput.files[0];
  
    if (!video) {
      showMessage('⚠️ Please select a video before uploading.', true);
      return;
    }
  
    const formData = new FormData();
    formData.append('video', video);
  
    // Hide input and button while uploading
    fileInput.style.display = 'none';
    uploadBtn.style.display = 'none';
  
    loadingBox.style.display = 'block';
    resultBox.style.display = 'none';
    backBtn.style.display = 'none';
  
    try {
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }
  
      if (data.prediction) {
        showMessage(`✅ Video uploaded! Prediction: ${data.prediction}`);
        sessionStorage.setItem('lastUploadedVideo', video.name);
        sessionStorage.setItem('predictionResult', data.prediction);
      } else {
        showMessage('⚠️ Unexpected server response.', true);
      }
    } catch (error) {
      console.error(error);
      showMessage('❌ Upload failed. Please try again.', true);
    }
  }
  
  function showMessage(message, isError = false) {
    const resultBox = document.getElementById('result-box');
    const loadingBox = document.getElementById('loading-box');
    const backBtn = document.getElementById('back-btn');
  
    loadingBox.style.display = 'none';
    resultBox.innerText = message;
    resultBox.style.display = 'block';
  
    // Styling
    resultBox.style.backgroundColor = isError ? '#5c1e1e' : '#263153';
    resultBox.style.color = '#fff';
    resultBox.style.padding = '15px';
    resultBox.style.borderRadius = '10px';
    resultBox.style.fontWeight = '600';
    resultBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  
    backBtn.style.display = 'inline-block';
  }
  
  function goBack() {
    const fileInput = document.getElementById('upload-video');
    const uploadBtn = document.getElementById('upload-btn');
    const loadingBox = document.getElementById('loading-box');
    const resultBox = document.getElementById('result-box');
    const backBtn = document.getElementById('back-btn');
  
    fileInput.style.display = 'block';
    uploadBtn.style.display = 'inline-block';
    resultBox.style.display = 'none';
    loadingBox.style.display = 'none';
    backBtn.style.display = 'none';
    fileInput.value = '';
  }
  