import time
import random
import re
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MOCK_RESPONSES = {
    'code': {
        'creative': "Here's a creative approach to your coding challenge:\n\n```python\n# Let's think outside the box!\ndef innovative_solution(data):\n    # Using a novel algorithm pattern\n    result = transform(data, mode='creative')\n    return optimize(result)\n```\n\nThis approach uses a hybrid strategy that balances readability with performance.",
        'precise': "Here's a precise implementation:\n\n```python\ndef solution(data):\n    \"\"\"Exact implementation matching requirements.\"\"\"\n    if not data:\n        return []\n    \n    result = []\n    for item in data:\n        if validate(item):\n            result.append(process(item))\n    return result\n```\n\nThis follows PEP 8 standards and includes proper error handling.",
        'balanced': "Here's a balanced solution:\n\n```python\ndef solve(data):\n    # Clean, maintainable code\n    return [process(x) for x in data if x.is_valid()]\n```\n\nThis balances clarity with conciseness."
    },
    'explain': {
        'creative': "Let me explain this concept using an analogy! 🎨\n\nImagine you're organizing a library. The concept you're asking about is like the Dewey Decimal System - it provides structure while allowing flexibility.\n\nHere's the key insight: just as books can be categorized multiple ways, this concept works by creating flexible relationships between components.",
        'precise': "Technical explanation:\n\n**Definition:** This concept refers to a systematic approach where components interact through well-defined interfaces.\n\n**Key components:**\n1. Input processing\n2. State management\n3. Output generation\n\n**Mathematical foundation:** O(n log n) complexity in typical cases.",
        'balanced': "Here's a clear explanation:\n\nThis concept is about organizing code/data in a way that's both efficient and maintainable. Think of it as building blocks - each piece has a specific purpose and connects to others in predictable ways.\n\nThe main benefits are:\n- Easier to understand\n- Simpler to debug\n- More maintainable long-term"
    },
    'write': {
        'creative': "Here's a creatively crafted piece:\n\n---\n\nIn the realm where bits dance and algorithms dream, there exists a delicate balance between order and chaos. Like a symphony composed in silicon, each line of code tells a story of human ingenuity meeting machine precision.\n\nThe art lies not in complexity, but in the elegant simplicity that emerges when we truly understand our craft.\n\n---\n\nWould you like me to explore a different tone or style?",
        'precise': "Here's a precisely structured response:\n\n**Objective:** Clear communication of the subject matter.\n\n**Structure:**\n- Introduction: Context setting (2-3 sentences)\n- Body: Key points with supporting evidence\n- Conclusion: Summary and call to action\n\n**Tone:** Professional, informative, audience-appropriate.",
        'balanced': "Here's a well-balanced piece:\n\nEvery great creation starts with understanding. Whether you're writing code, crafting prose, or solving problems, the key is to start with clarity about what you want to achieve.\n\nThe best approach combines structured thinking with creative exploration. Start with a clear framework, then allow room for innovation and unexpected insights."
    },
    'default': {
        'creative': "What an interesting prompt! Let me approach this with some creative thinking...\n\nI see several fascinating angles to explore here. Like looking at a prism from different perspectives, each angle reveals new possibilities and insights.\n\nLet me offer a fresh perspective that might spark some new ideas for you!",
        'precise': "Based on your prompt, here's my structured analysis:\n\n**Input Analysis:**\n- Topic identified\n- Intent classified\n- Complexity assessed\n\n**Response:**\nDirect answer to your query with supporting evidence and clear reasoning.\n\n**Confidence:** High (based on pattern matching)",
        'balanced': "Great question! Let me provide a thoughtful response.\n\nI'll break this down into key points:\n\n1. **Understanding** - First, let's make sure we're on the same page about what you're asking.\n2. **Analysis** - Here are the main considerations...\n3. **Recommendation** - Based on this, I'd suggest...\n\nWould you like me to elaborate on any of these points?"
    }
}

def detect_category(prompt):
    prompt_lower = prompt.lower()
    if any(kw in prompt_lower for kw in ['code', 'function', 'program', 'implement', 'debug', 'algorithm', 'python', 'javascript', 'api']):
        return 'code'
    elif any(kw in prompt_lower for kw in ['explain', 'what is', 'how does', 'describe', 'define', 'concept']):
        return 'explain'
    elif any(kw in prompt_lower for kw in ['write', 'essay', 'story', 'article', 'compose', 'create a']):
        return 'write'
    return 'default'

def generate_mock_response(prompt, model='balanced'):
    category = detect_category(prompt)
    response = MOCK_RESPONSES[category][model]
    
    variables = re.findall(r'\{\{(\w+)\}\}', prompt)
    if variables:
        var_note = "\n\n**Variables detected:** " + ", ".join(f"{{{{{v}}}}}" for v in variables)
        response += var_note
    
    return response

def estimate_tokens(text):
    return len(text.split()) * 1.3

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt', '')
    model = data.get('model', 'balanced')
    
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    latency = random.uniform(0.3, 1.5)
    time.sleep(min(latency, 0.5))
    
    response = generate_mock_response(prompt, model)
    
    input_tokens = int(estimate_tokens(prompt))
    output_tokens = int(estimate_tokens(response))
    
    return jsonify({
        'response': response,
        'model': model,
        'metrics': {
            'input_tokens': input_tokens,
            'output_tokens': output_tokens,
            'total_tokens': input_tokens + output_tokens,
            'latency_ms': int(latency * 1000)
        }
    })

@app.route('/api/models', methods=['GET'])
def get_models():
    return jsonify({
        'models': [
            {'id': 'creative', 'name': 'Creative', 'description': 'More imaginative, varied responses'},
            {'id': 'precise', 'name': 'Precise', 'description': 'Structured, technical responses'},
            {'id': 'balanced', 'name': 'Balanced', 'description': 'Mix of creativity and precision'}
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
