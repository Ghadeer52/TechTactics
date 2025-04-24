/*

document.getElementById('contract-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const fileInput = document.getElementById('contract-image');
    const language = document.getElementById('language').value;
    const resultBox = document.getElementById('result-box');
    const backBtn = document.getElementById('back-btn');
    const loadingBox = document.getElementById('loading-box');
    const form = document.getElementById('contract-form');
  
    const file = fileInput.files[0];
    if (!file) {
      showMessage('⚠️ Please select a file.', true);
      return;
    }
  
    const formData = new FormData();
    formData.append('contract_image', file);
    formData.append('language', language);
  
    form.style.display = 'none';
    loadingBox.style.display = 'block';
    resultBox.style.display = 'none';
    backBtn.style.display = 'none';
  
    try {
      const response = await fetch('http://localhost:5004/contract-analysis', {
        method: 'POST',
        body: formData
      });
  
      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
  
      const analysis = tempDiv.querySelector('.results');
      if (analysis) {
        // Show only top 2-5 clauses
        const clauses = analysis.querySelectorAll('.clause-box');
        const resultHTML = [...clauses].slice(0, 5).map(box => box.outerHTML).join('');
        const downloadBtn = analysis.querySelector('.download-btn')?.outerHTML || '';
  
        resultBox.innerHTML = `<h2>📋 Analysis Results:</h2>${resultHTML}${downloadBtn}`;
        resultBox.style.display = 'block';
        loadingBox.style.display = 'none';
        backBtn.style.display = 'inline-block';
      } else {
        throw new Error("Unexpected server response.");
      }
    } catch (error) {
      console.error(error);
      showMessage('❌ Upload failed. Please try again.', true);
    }
  });
  
  function showMessage(message, isError = false) {
    const resultBox = document.getElementById('result-box');
    const loadingBox = document.getElementById('loading-box');
    const backBtn = document.getElementById('back-btn');
  
    loadingBox.style.display = 'none';
    resultBox.innerText = message;
    resultBox.style.display = 'block';
  
    resultBox.style.backgroundColor = isError ? '#5c1e1e' : '#263153';
    resultBox.style.color = '#fff';
    resultBox.style.padding = '15px';
    resultBox.style.borderRadius = '10px';
    resultBox.style.fontWeight = '600';
    resultBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  
    backBtn.style.display = 'inline-block';
  }
  
  function goBackContract() {
    document.getElementById('contract-form').style.display = 'block';
    document.getElementById('result-box').style.display = 'none';
    document.getElementById('loading-box').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('contract-image').value = '';
  }
 //
  document.getElementById('contract-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const fileInput = document.getElementById('contract-image');
    const langSelect = document.getElementById('language');
    const loadingBox = document.getElementById('loading-box');
    const resultBox = document.getElementById('result-box');
    const backBtn = document.getElementById('back-btn');
    const form = document.getElementById('contract-form');
  
    const file = fileInput.files[0];
    const lang = langSelect.value;
  
    if (!file) {
      showMessage('⚠️ Please select a contract file.', true);
      return;
    }
  
    const formData = new FormData();
    formData.append('contract_image', file);
    formData.append('language', lang);
  
    // UI Feedback
    form.style.display = 'none';
    loadingBox.style.display = 'block';
    resultBox.style.display = 'none';
    backBtn.style.display = 'none';
  
    try {
      const response = await fetch('http://localhost:5004/contract-analysis', {
        method: 'POST',
        body: formData,
      });
  
      const html = await response.text();
  
      // Temporary DOM to parse the response
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const resultDiv = tempDiv.querySelector('.results');
  
      if (resultDiv) {
        const limitedResults = resultDiv.querySelectorAll('.clause-box');
        let summaryHTML = `<h3>📋 Summary (Top 5 clauses)</h3>`;
        for (let i = 0; i < Math.min(5, limitedResults.length); i++) {
          summaryHTML += limitedResults[i].outerHTML;
        }
  
        const downloadLink = resultDiv.querySelector('a.download-btn');
        summaryHTML += `<br>${downloadLink.outerHTML}`;
  
        showMessage(summaryHTML, false, true);
      } else {
        showMessage('⚠️ No analysis results returned.', true);
      }
    } catch (err) {
      console.error(err);
      showMessage('❌ Upload failed. Please try again.', true);
    }
  });
  
  function showMessage(message, isError = false, isHTML = false) {
    const resultBox = document.getElementById('result-box');
    const loadingBox = document.getElementById('loading-box');
    const backBtn = document.getElementById('back-btn');
  
    loadingBox.style.display = 'none';
    resultBox.style.display = 'block';
    resultBox.style.backgroundColor = isError ? '#5c1e1e' : '#263153';
    resultBox.style.color = '#fff';
    resultBox.style.padding = '15px';
    resultBox.style.borderRadius = '10px';
    resultBox.style.fontWeight = '600';
    resultBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    resultBox.innerHTML = isHTML ? message : `<p>${message}</p>`;
  
    backBtn.style.display = 'inline-block';
  }
  
  function goBackContract() {
    document.getElementById('contract-form').style.display = 'block';
    document.getElementById('result-box').style.display = 'none';
    document.getElementById('loading-box').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('contract-image').value = '';
  }
*/
  document.getElementById('contract-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const fileInput = document.getElementById('contract-image');
    const language = document.getElementById('language').value;
    const resultBox = document.getElementById('result-box');
    const backBtn = document.getElementById('back-btn');
    const loadingBox = document.getElementById('loading-box');
    const form = document.getElementById('contract-form');
  
    const file = fileInput.files[0];
    if (!file) {
      showMessage('⚠️ Please select a file.', true);
      return;
    }
  
    const formData = new FormData();
    formData.append('contract_image', file);
    formData.append('language', language);
  
    form.style.display = 'none';
    loadingBox.style.display = 'block';
    resultBox.style.display = 'none';
    backBtn.style.display = 'none';
  
    try {
      const response = await fetch('http://127.0.0.1:5004/contract-analysis', {
        method: 'POST',
        body: formData
      });
  /*
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  */
      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("⚠️ Server returned non-JSON response:\n" + text.slice(0, 200));
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      const htmlClauses = data.results.map(item => `
        <div class="clause-box">
          <p><strong>Clause:</strong> ${item.clause}</p>
          <p><strong>Summary:</strong> ${item.summary}</p>
        </div>
      `).join('');
  
      resultBox.innerHTML = `
        <h2>📋 Analysis Results:</h2>
        ${htmlClauses}
        <a href="${data.pdf_url}" class="download-btn">📥 Download PDF Report</a>
      `;
  
      resultBox.style.display = 'block';
      loadingBox.style.display = 'none';
      backBtn.style.display = 'inline-block';
  
    } catch (error) {
      console.error(error);
      showMessage('⚠️ ' + error.message, true);
    }
  });
  
  function showMessage(message, isError = false) {
    const resultBox = document.getElementById('result-box');
    const loadingBox = document.getElementById('loading-box');
    const backBtn = document.getElementById('back-btn');
  
    loadingBox.style.display = 'none';
    resultBox.innerText = message;
    resultBox.style.display = 'block';
    resultBox.style.backgroundColor = isError ? '#5c1e1e' : '#263153';
    resultBox.style.color = '#fff';
    resultBox.style.padding = '15px';
    resultBox.style.borderRadius = '10px';
    resultBox.style.fontWeight = '600';
    resultBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    backBtn.style.display = 'inline-block';
  }
  
  function goBackContract() {
    document.getElementById('contract-form').style.display = 'block';
    document.getElementById('result-box').style.display = 'none';
    document.getElementById('loading-box').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('contract-image').value = '';
  }
  