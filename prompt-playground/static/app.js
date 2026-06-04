let currentModel = 'balanced';
let history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
let savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');

const promptEditor = document.getElementById('promptEditor');
const responseOutput = document.getElementById('responseOutput');
const metricsDiv = document.getElementById('metrics');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const variablesForm = document.getElementById('variablesForm');

document.querySelectorAll('.model-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentModel = btn.dataset.model;
    });
});

promptEditor.addEventListener('input', () => {
    updateCounts();
    detectVariables();
});

function updateCounts() {
    const text = promptEditor.value;
    charCount.textContent = `${text.length} chars`;
    wordCount.textContent = `${text.trim() ? text.trim().split(/\s+/).length : 0} words`;
}

function detectVariables() {
    const text = promptEditor.value;
    const vars = [...new Set(text.match(/\{\{(\w+)\}\}/g) || [])];
    
    if (vars.length === 0) {
        variablesForm.innerHTML = '<p class="empty-state">Use {{variable}} in prompts</p>';
        return;
    }
    
    variablesForm.innerHTML = vars.map(v => {
        const name = v.replace(/\{\{|\}\}/g, '');
        const existing = document.querySelector(`[data-var="${name}"]`);
        const val = existing ? existing.value : '';
        return `<div class="variable-input">
            <label>${name}:</label>
            <input type="text" data-var="${name}" value="${val}" placeholder="value...">
        </div>`;
    }).join('');
}

function getProcessedPrompt() {
    let prompt = promptEditor.value;
    document.querySelectorAll('.variable-input input').forEach(input => {
        const regex = new RegExp(`\\{\\{${input.dataset.var}\\}\\}`, 'g');
        prompt = prompt.replace(regex, input.value || `{{${input.dataset.var}}}`);
    });
    return prompt;
}

document.getElementById('runBtn').addEventListener('click', async () => {
    const prompt = getProcessedPrompt();
    if (!prompt.trim()) return;
    
    const btn = document.getElementById('runBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Running...';
    responseOutput.innerHTML = '<p class="placeholder">Generating response...</p>';
    metricsDiv.classList.add('hidden');
    
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, model: currentModel })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseOutput.innerHTML = formatResponse(data.response);
            
            document.getElementById('inputTokens').textContent = data.metrics.input_tokens;
            document.getElementById('outputTokens').textContent = data.metrics.output_tokens;
            document.getElementById('latency').textContent = data.metrics.latency_ms;
            metricsDiv.classList.remove('hidden');
            
            addToHistory(prompt, data.response, data.metrics);
        } else {
            responseOutput.innerHTML = `<p style="color: var(--error);">${data.error}</p>`;
        }
    } catch (err) {
        responseOutput.innerHTML = `<p style="color: var(--error);">Network error</p>`;
    }
    
    btn.disabled = false;
    btn.textContent = '▶ Run';
});

function formatResponse(text) {
    return text
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function addToHistory(prompt, response, metrics) {
    history.unshift({
        timestamp: Date.now(),
        prompt: prompt.substring(0, 50),
        model: currentModel,
        tokens: metrics.total_tokens
    });
    history = history.slice(0, 20);
    localStorage.setItem('promptHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history');
    if (history.length === 0) {
        container.innerHTML = '<p class="empty-state">No history yet</p>';
        return;
    }
    
    container.innerHTML = history.map((h, i) => `
        <div class="history-item" data-index="${i}">
            <div class="title">${escapeHtml(h.prompt)}...</div>
            <small style="color: var(--text-secondary);">${h.model} · ${h.tokens} tokens</small>
        </div>
    `).join('');
    
    container.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            promptEditor.value = history[item.dataset.index].prompt;
            updateCounts();
            detectVariables();
        });
    });
}

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    history = [];
    localStorage.setItem('promptHistory', '[]');
    renderHistory();
});

document.getElementById('savePromptBtn').addEventListener('click', () => {
    const prompt = promptEditor.value.trim();
    if (!prompt) return;
    
    const name = prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '');
    savedPrompts.push({ name, prompt, timestamp: Date.now() });
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
    renderSavedPrompts();
});

function renderSavedPrompts() {
    const container = document.getElementById('savedPrompts');
    if (savedPrompts.length === 0) {
        container.innerHTML = '<p class="empty-state">No saved prompts yet</p>';
        return;
    }
    
    container.innerHTML = savedPrompts.map((p, i) => `
        <div class="saved-item" data-index="${i}">
            <span class="delete-btn" data-delete="${i}">✕</span>
            <div class="title">${escapeHtml(p.name)}</div>
        </div>
    `).join('');
    
    container.querySelectorAll('.saved-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                savedPrompts.splice(parseInt(e.target.dataset.delete), 1);
                localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
                renderSavedPrompts();
                return;
            }
            promptEditor.value = savedPrompts[item.dataset.index].prompt;
            updateCounts();
            detectVariables();
        });
    });
}

document.getElementById('compareBtn').addEventListener('click', () => {
    document.getElementById('comparisonSection').classList.toggle('hidden');
});

document.getElementById('closeCompareBtn').addEventListener('click', () => {
    document.getElementById('comparisonSection').classList.add('hidden');
});

document.getElementById('runCompareBtn').addEventListener('click', async () => {
    const promptA = document.getElementById('promptA').value;
    const promptB = document.getElementById('promptB').value;
    
    if (!promptA || !promptB) return;
    
    const responseAEl = document.getElementById('responseA');
    const responseBEl = document.getElementById('responseB');
    responseAEl.textContent = 'Generating...';
    responseBEl.textContent = 'Generating...';
    
    const [resultA, resultB] = await Promise.all([
        fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptA, model: currentModel })
        }).then(r => r.json()),
        fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptB, model: currentModel })
        }).then(r => r.json())
    ]);
    
    responseAEl.innerHTML = formatResponse(resultA.response || resultA.error);
    responseBEl.innerHTML = formatResponse(resultB.response || resultB.error);
});

document.getElementById('clearBtn').addEventListener('click', () => {
    promptEditor.value = '';
    responseOutput.innerHTML = '<p class="placeholder">Run a prompt to see the response</p>';
    metricsDiv.classList.add('hidden');
    updateCounts();
    detectVariables();
});

document.getElementById('exportBtn').addEventListener('click', () => {
    const data = {
        savedPrompts,
        history,
        exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompts-export.json';
    a.click();
    URL.revokeObjectURL(url);
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

renderHistory();
renderSavedPrompts();
updateCounts();
