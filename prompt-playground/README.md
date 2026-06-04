# Prompt Engineering Playground

A web application for testing, comparing, and organizing LLM prompts with a simulated response system.

## Features

- **Prompt Editor** - Syntax-highlighted editor with monospace font
- **Side-by-Side Comparison** - Compare two prompts simultaneously
- **Mock LLM Responses** - Template-based responses that vary by keyword detection
- **Prompt Library** - Save/load prompts to localStorage
- **Response Metrics** - Token count estimates and simulated latency
- **Variable Templates** - Support for `{{variable}}` placeholders with form input
- **History** - Track previous runs
- **Export** - Export prompts as JSON

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py

# Open http://localhost:5001
```

## Mock LLM Behavior

The simulated LLM detects keywords and returns relevant responses:

- **Code keywords** (code, function, implement, etc.) - Returns code examples
- **Explain keywords** (explain, what is, describe, etc.) - Returns explanations
- **Write keywords** (write, essay, story, etc.) - Returns written content
- **Default** - Generic response

### Models

- **Balanced** - Mix of creativity and precision
- **Creative** - More imaginative, varied responses
- **Precise** - Structured, technical responses

## Usage

1. Type a prompt in the editor
2. Use `{{variable}}` syntax for template variables
3. Select a model (Balanced/Creative/Precise)
4. Click **Run** to generate a response
5. View metrics: token counts and simulated latency
6. Save prompts to your library for reuse
7. Use **Compare** mode to test two prompts side-by-side

## API

### Generate Response

```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "Explain {{concept}} in simple terms",
  "model": "balanced"
}
```

Response:
```json
{
  "response": "...",
  "model": "balanced",
  "metrics": {
    "input_tokens": 12,
    "output_tokens": 85,
    "total_tokens": 97,
    "latency_ms": 450
  }
}
```

### List Models

```http
GET /api/models
```

## Tech Stack

- Python 3 / Flask
- Vanilla JavaScript
- localStorage for persistence
