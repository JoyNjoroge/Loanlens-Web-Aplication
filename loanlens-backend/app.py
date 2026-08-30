import os
import json
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.generativeai import configure, GenerativeModel
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
import fitz
import io
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if GOOGLE_API_KEY:
    configure(api_key=GOOGLE_API_KEY)

# Windows: uncomment and set pytesseract path if needed
# pytesseract.pytesseract.pytesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_pdf_selectable(pdf_buffer):
    """Try to extract selectable text from PDF using PyMuPDF (fitz)"""
    try:
        print('Trying PyMuPDF for selectable text...')
        pdf_document = fitz.open(stream=pdf_buffer, filetype='pdf')
        text = ''
        for page_num, page in enumerate(pdf_document):
            page_text = page.get_text()
            if page_text:
                text += page_text + '\n'
        
        pdf_document.close()
        text = text.strip()
        
        if text:
            # Quality check: count readable characters
            readable_chars = sum(1 for c in text if c.isalnum() or c.isspace() or c in '.,;:-()')
            readable_ratio = readable_chars / max(len(text), 1)
            
            print(f'PyMuPDF result: length={len(text)}, readableRatio={readable_ratio*100:.1f}%')
            
            # Accept if >100 chars and >60% readable
            if len(text) > 100 and readable_ratio > 0.6:
                print('✓ Text quality is good, using PyMuPDF result')
                return text
            else:
                print('✗ Text quality is poor. Falling back to OCR.')
        else:
            print('No text returned by PyMuPDF. Proceeding with OCR.')
    except Exception as e:
        print(f'PyMuPDF error: {e}. Falling back to OCR.')
    
    return None

def extract_text_from_pdf_ocr(pdf_buffer):
    """Convert PDF pages to images and run Tesseract OCR"""
    try:
        print('Converting PDF to images for OCR...')
        images = convert_from_bytes(pdf_buffer, dpi=300)
        print(f'Generated {len(images)} page(s) for OCR')
        
        full_text = ''
        languages = os.getenv('OCR_LANGS', 'eng+fra+spa+ita+swa')
        print(f'Using OCR languages: {languages}')
        
        for i, image in enumerate(images):
            print(f'OCRing page {i+1}/{len(images)}...')
            try:
                text = pytesseract.image_to_string(image, lang=languages)
                full_text += text + '\n\n'
            except Exception as page_error:
                print(f'Error on page {i+1}: {page_error}')
                continue
        
        if full_text.strip():
            print(f'✓ OCR complete, text length: {len(full_text)}')
            return full_text
        else:
            print('✗ OCR returned no text')
            return None
    except Exception as e:
        print(f'OCR error: {e}')
        return None

def extract_text_from_image(image_buffer):
    """Run Tesseract OCR on an image"""
    try:
        print('Running Tesseract OCR on image...')
        image = Image.open(io.BytesIO(image_buffer))
        languages = os.getenv('OCR_LANGS', 'eng+fra+spa+ita+swa')
        text = pytesseract.image_to_string(image, lang=languages)
        
        if text.strip():
            print(f'✓ OCR complete, text length: {len(text)}')
            return text
        else:
            print('✗ OCR returned no text')
            return None
    except Exception as e:
        print(f'Image OCR error: {e}')
        return None

def recover_json_from_text(text):
    """Try to recover JSON from potentially broken response"""
    # Find first { and last }
    start_idx = text.find('{')
    end_idx = text.rfind('}')
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        potential_json = text[start_idx:end_idx+1]
        try:
            return json.loads(potential_json)
        except json.JSONDecodeError:
            pass
    
    return None

@app.route('/analyze-loan', methods=['POST'])
def analyze_loan():
    try:
        print('=== Analyzing loan document ===')
        
        if not GOOGLE_API_KEY:
            return jsonify({'error': 'Google API key not configured'}), 500
        
        document_text = request.form.get('documentText', '').strip()
        file = request.files.get('file')
        
        if not document_text and not file:
            return jsonify({'error': 'Document text or file is required'}), 400
        
        # Extract text from file if provided
        if file:
            filename = file.filename
            file_content = file.read()
            
            print(f'File detected: {filename}, size: {len(file_content)} bytes')
            
            if filename.lower().endswith('.pdf'):
                print('Processing PDF...')
                document_text = extract_text_from_pdf_selectable(file_content)
                if not document_text:
                    print('Selectable text extraction failed, trying OCR...')
                    document_text = extract_text_from_pdf_ocr(file_content)
                if not document_text:
                    return jsonify({'error': 'Could not extract text from PDF (both selectable and OCR failed)'}), 400
                print(f'PDF text extracted, length: {len(document_text)}')
            
            elif file.content_type and file.content_type.startswith('image/'):
                print('Processing image...')
                document_text = extract_text_from_image(file_content)
                if not document_text:
                    return jsonify({'error': 'Could not extract text from image'}), 400
                print(f'Image OCR complete, length: {len(document_text)}')
            
            else:
                try:
                    document_text = file_content.decode('utf-8', errors='ignore')
                except Exception as decode_error:
                    print(f'File decode error: {decode_error}')
                    return jsonify({'error': 'Could not decode file'}), 400
        
        if not document_text or not document_text.strip():
            return jsonify({'error': 'No text could be extracted from document'}), 400
        
        # Limit text to avoid token overflow
        text_preview = document_text[:8000]
        
        # Simplified, more explicit prompt
        prompt = f"""Extract loan information from this document and return ONLY valid JSON with this exact structure:

{{
  "loanSummary": {{
    "loanAmount": 0,
    "interestRate": 0,
    "termMonths": 0,
    "lender": "string",
    "loanType": "string",
    "summary": "string"
  }},
  "fairnessScore": {{
    "score": 50,
    "breakdown": [
      {{"label": "Interest Rate", "score": 50}},
      {{"label": "Fee Structure", "score": 50}},
      {{"label": "Term Clarity", "score": 50}},
      {{"label": "Penalty Terms", "score": 50}}
    ]
  }},
  "repaymentBreakdown": {{
    "monthlyPayment": 0,
    "totalRepayment": 0,
    "totalInterest": 0,
    "numberOfInstallments": 0,
    "effectiveAPR": 0
  }},
  "predatoryTerms": [],
  "extractedText": "string"
}}

Document text:
{text_preview}"""
        
        print('Calling Gemini API for analysis...')
        model = GenerativeModel('gemini-3.6-flash')
        response = model.generate_content(prompt)
        content = response.text
        
        print(f'Response received, length: {len(content)}')
        print(f'Response preview: {content[:500]}')
        
        # Parse JSON response with recovery
        try:
            json_str = content.strip()
            
            # Remove markdown code blocks
            json_str = re.sub(r'^```json\s*', '', json_str)
            json_str = re.sub(r'^```\s*', '', json_str)
            json_str = re.sub(r'\s*```$', '', json_str)
            json_str = json_str.strip()
            
            print(f'Cleaned JSON length: {len(json_str)}')
            
            # Try direct parse first
            try:
                analysis_data = json.loads(json_str)
                print('✓ JSON parsed successfully!')
            except json.JSONDecodeError as first_error:
                print(f'First parse attempt failed: {first_error}')
                print('Attempting recovery...')
                
                # Try to recover from broken JSON
                recovered = recover_json_from_text(json_str)
                if recovered:
                    analysis_data = recovered
                    print('✓ JSON recovered successfully!')
                else:
                    print('❌ JSON recovery failed')
                    print(f'Error position: {first_error}')
                    return jsonify({'error': f'Failed to parse analysis: {str(first_error)}'}), 500
            
            # Ensure all required fields exist with defaults
            if 'loanSummary' not in analysis_data:
                analysis_data['loanSummary'] = {
                    'loanAmount': 0,
                    'interestRate': 0,
                    'termMonths': 0,
                    'lender': 'Unknown',
                    'loanType': 'Unknown',
                    'summary': 'No summary'
                }
            
            if 'fairnessScore' not in analysis_data:
                analysis_data['fairnessScore'] = {
                    'score': 50,
                    'breakdown': [
                        {'label': 'Interest Rate', 'score': 50},
                        {'label': 'Fee Structure', 'score': 50},
                        {'label': 'Term Clarity', 'score': 50},
                        {'label': 'Penalty Terms', 'score': 50}
                    ]
                }
            
            if 'repaymentBreakdown' not in analysis_data:
                analysis_data['repaymentBreakdown'] = {
                    'monthlyPayment': 0,
                    'totalRepayment': 0,
                    'totalInterest': 0,
                    'numberOfInstallments': 0,
                    'effectiveAPR': 0
                }
            
            if 'predatoryTerms' not in analysis_data:
                analysis_data['predatoryTerms'] = []
            
            analysis_data['extractedText'] = text_preview[:500]  # Store preview only
            
            print('✓ Analysis complete!')
            return jsonify(analysis_data), 200
        
        except Exception as e:
            print(f'JSON Parse Error: {e}')
            print(f'Content preview (start): {content[:500]}')
            print(f'Content preview (end): {content[-500:]}')
            return jsonify({'error': f'Failed to parse analysis: {str(e)}'}), 500
    
    except Exception as error:
        print(f'❌ Error: {error}')
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(error)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    print(f'Server running on http://localhost:{port}')
    app.run(debug=True, port=port, host='127.0.0.1')
