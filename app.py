from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_wtf.csrf import CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'mp3', 'wav'}

# Initialize CSRF protection
csrf = CSRFProtect(app)

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/submit_quiz', methods=['POST'])
@limiter.limit("5 per minute")
def submit_quiz():
    try:
        data = request.json
        if not data or 'answers' not in data:
            return jsonify({'error': 'Données invalides'}), 400
        score = calculate_quiz_score(data['answers'])
        return jsonify({'score': score})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/submit_contact', methods=['POST'])
@limiter.limit("3 per minute")
def submit_contact():
    try:
        data = request.form
        if not data:
            return jsonify({'error': 'Données invalides'}), 400
            
        # Validation des données
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Save message to a file (you should use a database in production)
        with open('messages.txt', 'a') as f:
            f.write(f"Name: {data['name']}\nEmail: {data['email']}\nMessage: {data['message']}\n\n")
        
        return jsonify({
            'status': 'success',
            'message': 'Message envoyé avec succès'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_quiz_score(answers):
    correct_answers = {
        'q1': 2,  # 70 substances cancérigènes
        'q2': 2,  # 70% des fumeurs
        'q3': 0   # 7 secondes
    }
    score = 0
    for q, a in answers.items():
        if int(a) == correct_answers[q]:
            score += 1
    return (score / len(correct_answers)) * 100

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False) 