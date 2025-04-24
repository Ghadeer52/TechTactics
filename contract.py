from flask import Flask, render_template_string, request, send_file, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
from transformers import pipeline
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from googletrans import Translator
import os
import uuid
from pdf2image import convert_from_path
from pathlib import Path
import shutil

app = Flask(__name__)
CORS(app)

pytesseract.pytesseract.tesseract_cmd = r'C:\\Users\\Ghade\\AppData\\Local\\Programs\\Tesseract-OCR\\tesseract.exe'
summarizer = pipeline("summarization", model="t5-small")

def extract_text(file_path):
    try:
        ext = Path(file_path).suffix
        safe_path = os.path.join("uploads", f"safe_{uuid.uuid4().hex}{ext}")
        shutil.copy(file_path, safe_path)

        if ext.lower() == ".pdf":
            poppler_path = r"C:\poppler-24.08.0\Library\bin"
            images = convert_from_path(safe_path, dpi=150, poppler_path=poppler_path, fmt='jpeg')
            text = ""
            for img in images:
                text += pytesseract.image_to_string(img, lang="eng+ara") + "\n"
            return text
        else:
            with Image.open(safe_path) as img:
                return pytesseract.image_to_string(img, lang="eng+ara")
    except Exception as e:
        print("OCR ERROR:", e)
        return f"Error processing file: {e}"

def summarize_clauses(text, lang="en"):
    translator = Translator()
    results = []

    for clause in text.split('\n'):
        clause = clause.strip()
        if clause:
            try:
                input_length = len(clause.split())
                max_len = min(50, max(10, int(input_length * 0.6)))
                summary = summarizer(clause, max_length=max_len, min_length=5, do_sample=False)[0]['summary_text']
                if lang == "ar":
                    summary = translator.translate(summary, dest="ar").text
                results.append({"clause": clause, "summary": summary})
            except Exception as e:
                results.append({"clause": clause, "summary": f"Summarization error: {str(e)}"})
    return results

def save_pdf(clauses, filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    y = height - 40
    c.drawString(40, y, "Contract Analysis Report")
    y -= 30
    for item in clauses:
        for line in [f"Clause: {item['clause']}", f"Summary: {item['summary']}", ""]:
            c.drawString(40, y, line)
            y -= 20
            if y < 50:
                c.showPage()
                y = height - 40
    c.save()

@app.route('/contract-analysis', methods=['POST'])
def analyze_contract():
    if 'contract_image' not in request.files:
        return jsonify({"error": "No file uploaded."})

    image = request.files['contract_image']
    lang = request.form.get('language', 'en')
    ext = os.path.splitext(image.filename)[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    image_path = os.path.join("uploads", unique_name)
    os.makedirs("uploads", exist_ok=True)
    image.save(image_path)

    extracted_text = extract_text(image_path)
    results = summarize_clauses(extracted_text, lang)

    if not results:
        return jsonify({"error": "No analysis results returned."})

    # Generate PDF
    pdf_name = f"analysis_{uuid.uuid4().hex}.pdf"
    pdf_path = os.path.join("uploads", pdf_name)
    save_pdf(results, pdf_path)

    return jsonify({
        "results": results[:3],  # Return only top 5
        "pdf_url": f"http://localhost:5004/download/{pdf_name}"
    })

@app.route('/download/<pdf_name>')
def download_pdf(pdf_name):
    path = os.path.join("uploads", pdf_name)
    return send_file(path, as_attachment=True)

if __name__ == "__main__":
    app.run(port=5004, debug=True)
