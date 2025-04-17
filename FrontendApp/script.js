// Function for uploading talent video
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
    const response = await fetch('http://localhost:5003/smart-predict', {
    //const response = await fetch('http://localhost:5001/predict', {
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
      backBtn.style.display = 'inline-block'; // Show back button after successful upload
    } else {
      showMessage('⚠️ Unexpected server response.', true);
    }
  } catch (error) {
    console.error(error);
    showMessage('❌ Upload failed. Please try again.', true);
  }
}

// Show message function for different states
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

  backBtn.style.display = 'inline-block'; // Show the back button
}

// Back button functionality for talent video
function goBackTalent() {
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
  fileInput.value = ''; // Reset the file input
}

// Function for predicting player value
async function predictValue(event) {
  event.preventDefault();

  const age = document.getElementById('age').value;
  const height = document.getElementById('height_cm').value;
  const weight = document.getElementById('weight_kgs').value;
  const overall = document.getElementById('overall').value;
  const potential = document.getElementById('potential').value;

  const loadingBox = document.getElementById('loading-box');
  const resultBox = document.getElementById('result-box');
  const backBtn = document.getElementById('back-btn');
  const form = document.getElementById('prediction-form');

  loadingBox.style.display = 'block';
  resultBox.style.display = 'none';
  backBtn.style.display = 'none';
  form.style.display = 'none';

  try {
    const response = await fetch('http://localhost:5002/predict-value', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: Number(age),
        height_cm: Number(height),
        weight_kgs: Number(weight),
        overall_rating: Number(overall),
        potential: Number(potential),
      })
    });

    const data = await response.json();
    console.log(data); // Debugging log to see server response

    if (!response.ok) {
      throw new Error(data.error || 'Server error');
    }

    if (data.predicted_value_eur !== undefined && data.predicted_value_eur !== null) {
      showMessage(`✅ Estimated Player Value: ${data.predicted_value_eur.toFixed(2)} SAR`, false);
      backBtn.style.display = 'inline-block'; // Show back button after successful prediction
    } else {
      showMessage('⚠️ Unexpected response from server.', true);
    }
  } catch (error) {
    console.error(error);
    showMessage('❌ Prediction failed. Please try again.', true);
  }
}

// Back button functionality for player value
function goBackPlayer() {
  const resultBox = document.getElementById('result-box');
  const backBtn = document.getElementById('back-btn');
  const form = document.getElementById('prediction-form');

  resultBox.style.display = 'none';
  backBtn.style.display = 'none';
  form.style.display = 'block';
}
