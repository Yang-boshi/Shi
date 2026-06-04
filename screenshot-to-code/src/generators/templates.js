export const templates = {
  dashboard: {
    name: 'Dashboard',
    emoji: '📊',
    description: 'Admin dashboard with sidebar, stats cards, and charts',
    generate: (opts) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${opts.bgColor || '#f1f5f9'}; color: #1e293b; }
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 250px; background: ${opts.primaryColor || '#1e293b'}; color: #fff; padding: 20px; }
    .sidebar h2 { font-size: 1.2rem; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .sidebar a { display: block; color: rgba(255,255,255,0.7); text-decoration: none; padding: 10px 15px; border-radius: 6px; margin-bottom: 5px; transition: all 0.2s; }
    .sidebar a:hover, .sidebar a.active { background: rgba(255,255,255,0.1); color: #fff; }
    .main { flex: 1; padding: 30px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .header h1 { font-size: 1.5rem; }
    .header input { padding: 8px 15px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-card .label { color: #64748b; font-size: 0.85rem; }
    .stat-card .value { font-size: 2rem; font-weight: 700; margin: 5px 0; color: ${opts.primaryColor || '#1e293b'}; }
    .stat-card .change { font-size: 0.85rem; }
    .stat-card .change.up { color: #22c55e; }
    .stat-card .change.down { color: #ef4444; }
    .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
    .card { background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h3 { margin-bottom: 15px; font-size: 1rem; }
    .chart-placeholder { height: 200px; background: linear-gradient(135deg, ${opts.primaryColor || '#38bdf8'}22, ${opts.primaryColor || '#38bdf8'}11); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
    .list-item { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
    .list-item:last-child { border-bottom: none; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: ${opts.primaryColor || '#38bdf8'}33; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
    .list-item .info { flex: 1; }
    .list-item .info .name { font-weight: 500; }
    .list-item .info .detail { color: #64748b; font-size: 0.85rem; }
    .badge { padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500; }
    .badge.success { background: #dcfce7; color: #16a34a; }
    .badge.warning { background: #fef3c7; color: #d97706; }
    .badge.error { background: #fee2e2; color: #dc2626; }
  </style>
</head>
<body>
  <div class="layout">
    <div class="sidebar">
      <h2>🏢 MyApp</h2>
      <a href="#" class="active">📊 Dashboard</a>
      <a href="#">👥 Users</a>
      <a href="#">📦 Products</a>
      <a href="#">📈 Analytics</a>
      <a href="#">⚙️ Settings</a>
    </div>
    <div class="main">
      <div class="header">
        <h1>Dashboard</h1>
        <input type="text" placeholder="Search...">
      </div>
      <div class="stats">
        <div class="stat-card">
          <div class="label">Total Users</div>
          <div class="value">12,345</div>
          <div class="change up">↑ 12% from last month</div>
        </div>
        <div class="stat-card">
          <div class="label">Revenue</div>
          <div class="value">$48,290</div>
          <div class="change up">↑ 8% from last month</div>
        </div>
        <div class="stat-card">
          <div class="label">Orders</div>
          <div class="value">1,423</div>
          <div class="change down">↓ 3% from last month</div>
        </div>
        <div class="stat-card">
          <div class="label">Conversion</div>
          <div class="value">3.2%</div>
          <div class="change up">↑ 0.5% from last month</div>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h3>Revenue Overview</h3>
          <div class="chart-placeholder">📈 Chart Visualization</div>
        </div>
        <div class="card">
          <h3>Recent Activity</h3>
          <div class="list-item"><div class="avatar">JD</div><div class="info"><div class="name">John Doe</div><div class="detail">Made a purchase • 2m ago</div></div><span class="badge success">$120</span></div>
          <div class="list-item"><div class="avatar">AS</div><div class="info"><div class="name">Alice Smith</div><div class="detail">Signed up • 15m ago</div></div><span class="badge warning">New</span></div>
          <div class="list-item"><div class="avatar">BJ</div><div class="info"><div class="name">Bob Johnson</div><div class="detail">Requested refund • 1h ago</div></div><span class="badge error">-$45</span></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
  },

  landing: {
    name: 'Landing Page',
    emoji: '🚀',
    description: 'Modern landing page with hero, features, and CTA',
    generate: (opts) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${opts.bgColor || '#fff'}; color: #1e293b; }
    .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; max-width: 1200px; margin: 0 auto; }
    .nav .logo { font-size: 1.3rem; font-weight: 700; color: ${opts.primaryColor || '#38bdf8'}; }
    .nav .links a { color: #64748b; text-decoration: none; margin-left: 25px; font-size: 0.95rem; }
    .nav .links a:hover { color: #1e293b; }
    .nav .cta { background: ${opts.primaryColor || '#38bdf8'}; color: #fff; padding: 8px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; }
    .hero { text-align: center; padding: 80px 5% 60px; max-width: 800px; margin: 0 auto; }
    .hero h1 { font-size: 3rem; line-height: 1.2; margin-bottom: 20px; }
    .hero h1 span { color: ${opts.primaryColor || '#38bdf8'}; }
    .hero p { font-size: 1.2rem; color: #64748b; margin-bottom: 30px; line-height: 1.6; }
    .hero .buttons { display: flex; gap: 15px; justify-content: center; }
    .btn { padding: 12px 30px; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; border: none; text-decoration: none; transition: all 0.2s; }
    .btn.primary { background: ${opts.primaryColor || '#38bdf8'}; color: #fff; }
    .btn.primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn.secondary { background: #f1f5f9; color: #1e293b; }
    .features { padding: 60px 5%; max-width: 1200px; margin: 0 auto; }
    .features h2 { text-align: center; font-size: 2rem; margin-bottom: 50px; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    .feature-card { padding: 30px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
    .feature-card .icon { font-size: 2rem; margin-bottom: 15px; }
    .feature-card h3 { margin-bottom: 10px; }
    .feature-card p { color: #64748b; line-height: 1.6; }
    .cta-section { text-align: center; padding: 60px 5%; background: linear-gradient(135deg, ${opts.primaryColor || '#38bdf8'}11, ${opts.primaryColor || '#38bdf8'}22); }
    .cta-section h2 { font-size: 2rem; margin-bottom: 15px; }
    .cta-section p { color: #64748b; margin-bottom: 25px; }
    footer { text-align: center; padding: 30px; color: #94a3b8; font-size: 0.9rem; }
  </style>
</head>
<body>
  <nav class="nav">
    <div class="logo">✨ MyApp</div>
    <div class="links">
      <a href="#">Features</a>
      <a href="#">Pricing</a>
      <a href="#">About</a>
      <a href="#" class="cta">Get Started</a>
    </div>
  </nav>
  <section class="hero">
    <h1>Build Something <span>Amazing</span> Today</h1>
    <p>The all-in-one platform that helps you ship faster, collaborate better, and scale with confidence.</p>
    <div class="buttons">
      <a href="#" class="btn primary">Start Free Trial</a>
      <a href="#" class="btn secondary">Watch Demo</a>
    </div>
  </section>
  <section class="features">
    <h2>Why Choose Us</h2>
    <div class="features-grid">
      <div class="feature-card"><div class="icon">⚡</div><h3>Lightning Fast</h3><p>Built for speed with optimized performance that keeps your users happy.</p></div>
      <div class="feature-card"><div class="icon">🔒</div><h3>Secure by Default</h3><p>Enterprise-grade security with end-to-end encryption and compliance built in.</p></div>
      <div class="feature-card"><div class="icon">📈</div><h3>Scale Effortlessly</h3><p>From startup to enterprise, our platform grows with your business needs.</p></div>
    </div>
  </section>
  <section class="cta-section">
    <h2>Ready to Get Started?</h2>
    <p>Join thousands of teams already building with us.</p>
    <a href="#" class="btn primary">Start Your Free Trial</a>
  </section>
  <footer>© 2024 MyApp. All rights reserved.</footer>
</body>
</html>`,
  },

  login: {
    name: 'Login Form',
    emoji: '🔐',
    description: 'Clean login/signup form with validation styling',
    generate: (opts) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${opts.bgColor || '#f1f5f9'}; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { display: flex; max-width: 900px; width: 100%; margin: 20px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
    .left { flex: 1; background: linear-gradient(135deg, ${opts.primaryColor || '#38bdf8'}, ${opts.primaryColor || '#38bdf8'}cc); color: #fff; padding: 50px; display: flex; flex-direction: column; justify-content: center; }
    .left h1 { font-size: 2rem; margin-bottom: 15px; }
    .left p { opacity: 0.9; line-height: 1.6; margin-bottom: 30px; }
    .left .features { list-style: none; }
    .left .features li { padding: 8px 0; display: flex; align-items: center; gap: 10px; }
    .right { flex: 1; background: #fff; padding: 50px; display: flex; flex-direction: column; justify-content: center; }
    .right h2 { font-size: 1.5rem; margin-bottom: 5px; }
    .right .subtitle { color: #64748b; margin-bottom: 30px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; }
    .form-group input { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; transition: all 0.2s; }
    .form-group input:focus { outline: none; border-color: ${opts.primaryColor || '#38bdf8'}; box-shadow: 0 0 0 3px ${opts.primaryColor || '#38bdf8'}22; }
    .form-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .form-row label { display: flex; align-items: center; gap: 6px; color: #64748b; font-size: 0.9rem; }
    .form-row a { color: ${opts.primaryColor || '#38bdf8'}; text-decoration: none; font-size: 0.9rem; }
    .submit-btn { width: 100%; padding: 12px; background: ${opts.primaryColor || '#38bdf8'}; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .submit-btn:hover { opacity: 0.9; }
    .divider { text-align: center; margin: 20px 0; color: #94a3b8; font-size: 0.85rem; position: relative; }
    .divider::before, .divider::after { content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: #e2e8f0; }
    .divider::before { left: 0; }
    .divider::after { right: 0; }
    .social-btns { display: flex; gap: 10px; }
    .social-btn { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; cursor: pointer; text-align: center; font-size: 0.9rem; transition: all 0.2s; }
    .social-btn:hover { background: #f8fafc; }
    .signup-link { text-align: center; margin-top: 20px; color: #64748b; font-size: 0.9rem; }
    .signup-link a { color: ${opts.primaryColor || '#38bdf8'}; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="left">
      <h1>Welcome Back!</h1>
      <p>Log in to access your dashboard and manage your projects.</p>
      <ul class="features">
        <li>✅ Unlimited projects</li>
        <li>✅ Team collaboration</li>
        <li>✅ Advanced analytics</li>
        <li>✅ Priority support</li>
      </ul>
    </div>
    <div class="right">
      <h2>Sign In</h2>
      <p class="subtitle">Enter your credentials to continue</p>
      <div class="form-group">
        <label>Email</label>
        <input type="email" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" placeholder="••••••••">
      </div>
      <div class="form-row">
        <label><input type="checkbox"> Remember me</label>
        <a href="#">Forgot password?</a>
      </div>
      <button class="submit-btn">Sign In</button>
      <div class="divider">or continue with</div>
      <div class="social-btns">
        <button class="social-btn">Google</button>
        <button class="social-btn">GitHub</button>
      </div>
      <p class="signup-link">Don't have an account? <a href="#">Sign up</a></p>
    </div>
  </div>
</body>
</html>`,
  },

  card: {
    name: 'Card Layout',
    emoji: '🃏',
    description: 'Product/content card grid with hover effects',
    generate: (opts) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Layout</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${opts.bgColor || '#f1f5f9'}; color: #1e293b; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { font-size: 2rem; margin-bottom: 10px; }
    .header p { color: #64748b; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; }
    .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.3s; cursor: pointer; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
    .card-image { height: 180px; background: linear-gradient(135deg, ${opts.primaryColor || '#38bdf8'}44, ${opts.primaryColor || '#38bdf8'}22); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .card-body { padding: 20px; }
    .card-body .tag { display: inline-block; padding: 3px 10px; background: ${opts.primaryColor || '#38bdf8'}15; color: ${opts.primaryColor || '#38bdf8'}; border-radius: 4px; font-size: 0.8rem; margin-bottom: 10px; }
    .card-body h3 { margin-bottom: 8px; font-size: 1.1rem; }
    .card-body p { color: #64748b; font-size: 0.9rem; line-height: 1.5; margin-bottom: 15px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #f1f5f9; }
    .card-footer .author { display: flex; align-items: center; gap: 8px; }
    .card-footer .avatar { width: 28px; height: 28px; border-radius: 50%; background: ${opts.primaryColor || '#38bdf8'}33; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; }
    .card-footer .name { font-size: 0.85rem; font-weight: 500; }
    .card-footer .date { color: #94a3b8; font-size: 0.8rem; }
    .filter-bar { display: flex; gap: 10px; justify-content: center; margin-bottom: 30px; flex-wrap: wrap; }
    .filter-btn { padding: 8px 18px; border: 1px solid #e2e8f0; background: #fff; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
    .filter-btn:hover, .filter-btn.active { background: ${opts.primaryColor || '#38bdf8'}; color: #fff; border-color: ${opts.primaryColor || '#38bdf8'}; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Latest Articles</h1>
    <p>Discover our latest content and insights</p>
  </div>
  <div class="filter-bar">
    <button class="filter-btn active">All</button>
    <button class="filter-btn">Technology</button>
    <button class="filter-btn">Design</button>
    <button class="filter-btn">Business</button>
    <button class="filter-btn">Lifestyle</button>
  </div>
  <div class="grid">
    <div class="card"><div class="card-image">🚀</div><div class="card-body"><span class="tag">Technology</span><h3>Building Scalable APIs</h3><p>Learn how to design APIs that can handle millions of requests with ease.</p><div class="card-footer"><div class="author"><div class="avatar">JD</div><span class="name">John Doe</span></div><span class="date">Dec 15</span></div></div></div>
    <div class="card"><div class="card-image">🎨</div><div class="card-body"><span class="tag">Design</span><h3>Modern UI Patterns</h3><p>Explore the latest design patterns that are shaping the web.</p><div class="card-footer"><div class="author"><div class="avatar">AS</div><span class="name">Alice Smith</span></div><span class="date">Dec 12</span></div></div></div>
    <div class="card"><div class="card-image">📊</div><div class="card-body"><span class="tag">Business</span><h3>Growth Strategies</h3><p>Proven strategies to scale your startup from zero to millions.</p><div class="card-footer"><div class="author"><div class="avatar">BJ</div><span class="name">Bob Johnson</span></div><span class="date">Dec 10</span></div></div></div>
    <div class="card"><div class="card-image">⚡</div><div class="card-body"><span class="tag">Technology</span><h3>Performance Tips</h3><p>Optimize your web apps for maximum speed and efficiency.</p><div class="card-footer"><div class="author"><div class="avatar">MK</div><span class="name">Mary Kim</span></div><span class="date">Dec 8</span></div></div></div>
    <div class="card"><div class="card-image">🎯</div><div class="card-body"><span class="tag">Lifestyle</span><h3>Productivity Hacks</h3><p>Simple tricks to get more done in less time every day.</p><div class="card-footer"><div class="author"><div class="avatar">TP</div><span class="name">Tom Park</span></div><span class="date">Dec 5</span></div></div></div>
    <div class="card"><div class="card-image">💡</div><div class="card-body"><span class="tag">Design</span><h3>Color Theory Guide</h3><p>Master the art of color to create stunning visual designs.</p><div class="card-footer"><div class="author"><div class="avatar">LR</div><span class="name">Lisa Ray</span></div><span class="date">Dec 3</span></div></div></div>
  </div>
</body>
</html>`,
  },

  pricing: {
    name: 'Pricing Page',
    emoji: '💰',
    description: 'SaaS pricing table with tiers and feature comparison',
    generate: (opts) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${opts.bgColor || '#f8fafc'}; color: #1e293b; }
    .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; max-width: 1200px; margin: 0 auto; }
    .nav .logo { font-size: 1.3rem; font-weight: 700; color: ${opts.primaryColor || '#38bdf8'}; }
    .nav a { color: #64748b; text-decoration: none; margin-left: 20px; }
    .hero { text-align: center; padding: 50px 5% 30px; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .hero p { color: #64748b; font-size: 1.1rem; }
    .toggle { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 30px 0; }
    .toggle span { color: #64748b; }
    .toggle span.active { color: #1e293b; font-weight: 600; }
    .toggle-switch { width: 48px; height: 24px; background: ${opts.primaryColor || '#38bdf8'}; border-radius: 12px; cursor: pointer; position: relative; }
    .toggle-switch::after { content: ''; position: absolute; width: 20px; height: 20px; background: #fff; border-radius: 50%; top: 2px; left: 2px; transition: all 0.2s; }
    .pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto; padding: 0 5% 60px; }
    .plan { background: #fff; border-radius: 16px; padding: 35px; border: 2px solid #e2e8f0; transition: all 0.3s; position: relative; }
    .plan:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
    .plan.popular { border-color: ${opts.primaryColor || '#38bdf8'}; }
    .plan.popular::before { content: 'Most Popular'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: ${opts.primaryColor || '#38bdf8'}; color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .plan .name { font-size: 1.1rem; color: #64748b; margin-bottom: 10px; }
    .plan .price { font-size: 3rem; font-weight: 700; margin-bottom: 5px; }
    .plan .price span { font-size: 1rem; color: #64748b; font-weight: 400; }
    .plan .desc { color: #94a3b8; font-size: 0.9rem; margin-bottom: 25px; }
    .plan .features { list-style: none; margin-bottom: 25px; }
    .plan .features li { padding: 8px 0; color: #475569; display: flex; align-items: center; gap: 8px; }
    .plan .features li::before { content: '✓'; color: ${opts.primaryColor || '#38bdf8'}; font-weight: 700; }
    .plan .btn { display: block; width: 100%; padding: 12px; border-radius: 8px; text-align: center; font-weight: 600; cursor: pointer; border: none; font-size: 1rem; transition: all 0.2s; }
    .plan .btn.outline { background: #fff; border: 2px solid #e2e8f0; color: #1e293b; }
    .plan .btn.outline:hover { border-color: ${opts.primaryColor || '#38bdf8'}; color: ${opts.primaryColor || '#38bdf8'}; }
    .plan .btn.filled { background: ${opts.primaryColor || '#38bdf8'}; color: #fff; }
    .plan .btn.filled:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <nav class="nav"><div class="logo">✨ MyApp</div><div><a href="#">Features</a><a href="#">Pricing</a><a href="#">Login</a></div></nav>
  <section class="hero"><h1>Simple, Transparent Pricing</h1><p>Choose the plan that fits your needs. Upgrade anytime.</p></section>
  <div class="toggle"><span class="active">Monthly</span><div class="toggle-switch"></div><span>Annual (Save 20%)</span></div>
  <div class="pricing">
    <div class="plan"><div class="name">Starter</div><div class="price">$9<span>/mo</span></div><div class="desc">Perfect for individuals</div><ul class="features"><li>5 Projects</li><li>1GB Storage</li><li>Basic Analytics</li><li>Email Support</li></ul><button class="btn outline">Get Started</button></div>
    <div class="plan popular"><div class="name">Professional</div><div class="price">$29<span>/mo</span></div><div class="desc">Best for growing teams</div><ul class="features"><li>Unlimited Projects</li><li>50GB Storage</li><li>Advanced Analytics</li><li>Priority Support</li><li>API Access</li></ul><button class="btn filled">Get Started</button></div>
    <div class="plan"><div class="name">Enterprise</div><div class="price">$99<span>/mo</span></div><div class="desc">For large organizations</div><ul class="features"><li>Everything in Pro</li><li>Unlimited Storage</li><li>Custom Integrations</li><li>Dedicated Manager</li><li>SLA Guarantee</li></ul><button class="btn outline">Contact Sales</button></div>
  </div>
</body>
</html>`,
  },
}

export const colorPresets = [
  { name: 'Blue', primary: '#38bdf8', bg: '#f8fafc' },
  { name: 'Purple', primary: '#a78bfa', bg: '#faf5ff' },
  { name: 'Green', primary: '#34d399', bg: '#f0fdf4' },
  { name: 'Pink', primary: '#f472b6', bg: '#fdf2f8' },
  { name: 'Orange', primary: '#fb923c', bg: '#fff7ed' },
  { name: 'Red', primary: '#f87171', bg: '#fef2f2' },
  { name: 'Teal', primary: '#2dd4bf', bg: '#f0fdfa' },
  { name: 'Indigo', primary: '#818cf8', bg: '#eef2ff' },
]
