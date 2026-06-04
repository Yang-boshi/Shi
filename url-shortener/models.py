import sqlite3
from datetime import datetime
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'urls.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            original_url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            click_count INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS clicks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url_id INTEGER NOT NULL,
            clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            referrer TEXT,
            user_agent TEXT,
            ip_address TEXT,
            FOREIGN KEY (url_id) REFERENCES urls(id)
        );

        CREATE INDEX IF NOT EXISTS idx_slug ON urls(slug);
        CREATE INDEX IF NOT EXISTS idx_url_id ON clicks(url_id);
    ''')
    conn.commit()
    conn.close()

def create_url(slug, original_url):
    conn = get_db()
    try:
        conn.execute('INSERT INTO urls (slug, original_url) VALUES (?, ?)', (slug, original_url))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_url(slug):
    conn = get_db()
    url = conn.execute('SELECT * FROM urls WHERE slug = ?', (slug,)).fetchone()
    conn.close()
    return url

def record_click(url_id, referrer, user_agent, ip_address):
    conn = get_db()
    conn.execute('''
        INSERT INTO clicks (url_id, referrer, user_agent, ip_address)
        VALUES (?, ?, ?, ?)
    ''', (url_id, referrer, user_agent, ip_address))
    conn.execute('UPDATE urls SET click_count = click_count + 1 WHERE id = ?', (url_id,))
    conn.commit()
    conn.close()

def get_stats(slug):
    conn = get_db()
    url = conn.execute('SELECT * FROM urls WHERE slug = ?', (slug,)).fetchone()
    if not url:
        conn.close()
        return None

    url_id = url['id']
    
    total_clicks = conn.execute('SELECT COUNT(*) as count FROM clicks WHERE url_id = ?', (url_id,)).fetchone()['count']
    
    clicks_by_day = conn.execute('''
        SELECT DATE(clicked_at) as date, COUNT(*) as count
        FROM clicks WHERE url_id = ?
        GROUP BY DATE(clicked_at)
        ORDER BY date DESC
        LIMIT 30
    ''', (url_id,)).fetchall()
    
    top_referrers = conn.execute('''
        SELECT referrer, COUNT(*) as count
        FROM clicks WHERE url_id = ? AND referrer IS NOT NULL AND referrer != ''
        GROUP BY referrer
        ORDER BY count DESC
        LIMIT 10
    ''', (url_id,)).fetchall()
    
    browsers = conn.execute('''
        SELECT 
            CASE 
                WHEN user_agent LIKE '%Chrome%' AND user_agent NOT LIKE '%Edg%' THEN 'Chrome'
                WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
                WHEN user_agent LIKE '%Safari%' AND user_agent NOT LIKE '%Chrome%' THEN 'Safari'
                WHEN user_agent LIKE '%Edg%' THEN 'Edge'
                WHEN user_agent LIKE '%Opera%' OR user_agent LIKE '%OPR%' THEN 'Opera'
                ELSE 'Other'
            END as browser,
            COUNT(*) as count
        FROM clicks WHERE url_id = ?
        GROUP BY browser
        ORDER BY count DESC
    ''', (url_id,)).fetchall()
    
    recent_clicks = conn.execute('''
        SELECT clicked_at, referrer, user_agent, ip_address
        FROM clicks WHERE url_id = ?
        ORDER BY clicked_at DESC
        LIMIT 50
    ''', (url_id,)).fetchall()
    
    conn.close()
    
    return {
        'url': dict(url),
        'total_clicks': total_clicks,
        'clicks_by_day': [dict(row) for row in clicks_by_day],
        'top_referrers': [dict(row) for row in top_referrers],
        'browsers': [dict(row) for row in browsers],
        'recent_clicks': [dict(row) for row in recent_clicks]
    }
