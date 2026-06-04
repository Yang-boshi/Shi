if (document.getElementById('shortenForm')) {
    document.getElementById('shortenForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = document.getElementById('urlInput').value;
        const slug = document.getElementById('slugInput').value;
        
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, slug: slug || undefined })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                document.getElementById('result').classList.remove('hidden');
                document.getElementById('shortUrl').href = data.short_url;
                document.getElementById('shortUrl').textContent = data.short_url;
                document.getElementById('originalUrl').textContent = data.original_url;
                document.getElementById('qrCode').src = data.qr_code;
                document.getElementById('statsLink').href = `/stats/${data.slug}`;
            } else {
                alert(data.error || 'Failed to shorten URL');
            }
        } catch (err) {
            alert('Network error');
        }
    });
}

function copyUrl() {
    const url = document.getElementById('shortUrl').textContent;
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
    });
}

if (typeof SLUG !== 'undefined') {
    loadStats();
}

async function loadStats() {
    try {
        const response = await fetch(`/api/stats/${SLUG}`);
        const data = await response.json();
        
        if (!response.ok) return;
        
        document.getElementById('totalClicks').textContent = data.total_clicks;
        
        renderClicksChart(data.clicks_by_day);
        renderBrowsersChart(data.browsers);
        renderReferrersTable(data.top_referrers);
        renderClicksTable(data.recent_clicks);
    } catch (err) {
        console.error('Failed to load stats:', err);
    }
}

function renderClicksChart(clicksByDay) {
    const canvas = document.getElementById('clicksChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth - 48;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    
    if (clicksByDay.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No clicks yet', width / 2, height / 2);
        return;
    }
    
    const data = clicksByDay.reverse();
    const maxClicks = Math.max(...data.map(d => d.count), 1);
    const barWidth = Math.max(20, (width - 40) / data.length - 4);
    const chartHeight = height - 40;
    
    ctx.fillStyle = '#2563eb';
    data.forEach((d, i) => {
        const barHeight = (d.count / maxClicks) * chartHeight;
        const x = 20 + i * (barWidth + 4);
        const y = chartHeight - barHeight + 10;
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
    });
    
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
        const x = 20 + i * (barWidth + 4) + barWidth / 2;
        const label = d.date.slice(5);
        ctx.fillText(label, x, height - 5);
    });
}

function renderBrowsersChart(browsers) {
    const canvas = document.getElementById('browsersChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth - 48;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    
    if (browsers.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No data yet', width / 2, height / 2);
        return;
    }
    
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const total = browsers.reduce((sum, b) => sum + b.count, 0);
    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const radius = Math.min(width, height) / 2 - 30;
    
    let startAngle = -Math.PI / 2;
    
    browsers.forEach((browser, i) => {
        const sliceAngle = (browser.count / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        
        const midAngle = startAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(midAngle) * (radius + 20);
        const labelY = centerY + Math.sin(midAngle) * (radius + 20);
        
        ctx.fillStyle = '#1e293b';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${browser.browser} (${browser.count})`, labelX, labelY);
        
        startAngle += sliceAngle;
    });
}

function renderReferrersTable(referrers) {
    const tbody = document.querySelector('#referrersTable tbody');
    if (!tbody) return;
    
    if (referrers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:#64748b">No referrers yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = referrers.map(r => `
        <tr>
            <td>${escapeHtml(r.referrer || 'Direct')}</td>
            <td>${r.count}</td>
        </tr>
    `).join('');
}

function renderClicksTable(clicks) {
    const tbody = document.querySelector('#clicksTable tbody');
    if (!tbody) return;
    
    if (clicks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#64748b">No clicks yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = clicks.slice(0, 20).map(c => `
        <tr>
            <td>${new Date(c.clicked_at).toLocaleString()}</td>
            <td>${escapeHtml(c.ip_address || '-')}</td>
            <td>${escapeHtml(c.referrer || 'Direct')}</td>
        </tr>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
