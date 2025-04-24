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
  