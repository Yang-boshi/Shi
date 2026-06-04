import string
import random
import io
import base64
from urllib.parse import urlparse
from flask import Flask, request, redirect, jsonify, render_template, abort
from flask_cors import CORS
import qrcode
from models import init_db, create_url, get_url, record_click, get_stats

app = Flask(__name__)
CORS(app)

init_db()

def generate_slug(length=6):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/shorten', methods=['POST'])
def shorten():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
    
    url = data['url'].strip()
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    if not is_valid_url(url):
        return jsonify({'error': 'Invalid URL'}), 400
    
    slug = data.get('slug', '').strip() or generate_slug()
    
    if not all(c in string.ascii_letters + string.digits + '-_' for c in slug):
        return jsonify({'error': 'Slug can only contain letters, numbers, hyphens and underscores'}), 400
    
    if create_url(slug, url):
        short_url = f"{request.host_url}{slug}"
        
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(short_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return jsonify({
            'short_url': short_url,
            'slug': slug,
            'original_url': url,
            'qr_code': f"data:image/png;base64,{qr_base64}"
        })
    else:
        return jsonify({'error': 'Slug already exists'}), 409

@app.route('/<slug>')
def redirect_url(slug):
    url = get_url(slug)
    if not url:
        abort(404)
    
    record_click(
        url['id'],
        request.referrer or '',
        request.user_agent.string or '',
        request.remote_addr
    )
    return redirect(url['original_url'])

@app.route('/stats/<slug>')
def stats_page(slug):
    url = get_url(slug)
    if not url:
        abort(404)
    return render_template('stats.html', slug=slug, original_url=url['original_url'])

@app.route('/api/stats/<slug>')
def stats_api(slug):
    stats = get_stats(slug)
    if not stats:
        return jsonify({'error': 'URL not found'}), 404
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
