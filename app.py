from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import os
import docx
from PyPDF2 import PdfReader
import spacy
from flask_cors import CORS
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Load SpaCy model
nlp = spacy.load('en_core_web_md')

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() or ''
        return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return ' '.join([para.text for para in doc.paragraphs])

def extract_keywords(text):
    doc = nlp(text)
    keywords = Counter()
    for token in doc:
        if not token.is_stop and not token.is_punct and (token.pos_ in ['NOUN', 'ADJ', 'PROPN'] or token.ent_type_):
            if len(token.lemma_) > 1 and not token.lemma_.isdigit():
                keywords[token.lemma_.lower()] += 1
    return keywords
    
def calculate_score(job_description, resume_text):
    # Combine job description and resume for TF-IDF calculation
    documents = [job_description, resume_text]

    # Initialize TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(stop_words='english')

    # Compute TF-IDF matrix
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    # Calculate cosine similarity between job description and resume
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

    # Convert cosine similarity to percentage
    score = cosine_sim * 100

    # Extract keywords from both documents
    job_keywords = extract_keywords(job_description)
    resume_keywords = extract_keywords(resume_text)

    # Keep counts from job description instead of resume
    matched_keywords = {key: job_keywords[key] for key in resume_keywords if key in job_keywords}
    missing_keywords = {key: job_keywords[key] for key in job_keywords if key not in resume_keywords}

    return {
        'score': score,
        'found_keywords': matched_keywords,
        'missing_keywords': missing_keywords
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'resume' not in request.files or 'job_description' not in request.form:
        return jsonify({'error': 'No file or job description provided'}), 400

    job_description = request.form['job_description']
    resume_file = request.files['resume']
    filename = secure_filename(resume_file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    resume_file.save(filepath)

    if filename.endswith('.pdf'):
        resume_text = extract_text_from_pdf(filepath)
    elif filename.endswith('.docx'):
        resume_text = extract_text_from_docx(filepath)
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

    result = calculate_score(job_description, resume_text)

    return jsonify({
        'score': result['score'],
        'found_keywords': dict(result['found_keywords']),
        'missing_keywords': dict(result['missing_keywords'])
    })

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True)
