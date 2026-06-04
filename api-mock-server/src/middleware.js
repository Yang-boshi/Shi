/**
 * Delay middleware - adds configurable delay to responses
 */
function delayMiddleware(ms) {
  return (req, res, next) => {
    if (ms > 0) {
      setTimeout(next, ms);
    } else {
      next();
    }
  };
}

/**
 * Error simulation middleware - randomly returns 500 errors
 */
function errorSimulationMiddleware(errorRate) {
  return (req, res, next) => {
    if (errorRate > 0 && Math.random() * 100 < errorRate) {
      return res.status(500).json({
        error: "Internal Server Error",
        message: "This error was randomly simulated for testing purposes",
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
}

/**
 * Request logging middleware
 */
function loggingMiddleware() {
  return (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    res.on("finish", () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const statusColor = status >= 400 ? "\x1b[31m" : "\x1b[32m";
      const resetColor = "\x1b[0m";

      console.log(
        `[${timestamp}] ${req.method} ${req.originalUrl} ${statusColor}${status}${resetColor} ${duration}ms`
      );
    });

    next();
  };
}

/**
 * Custom headers middleware
 */
function customHeadersMiddleware(headers = {}) {
  return (req, res, next) => {
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    next();
  };
}

/**
 * Rate limiting middleware (simple in-memory)
 */
function rateLimitMiddleware(options = {}) {
  const { windowMs = 60000, max = 100 } = options;
  const hits = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!hits.has(ip)) {
      hits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = hits.get(ip);

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count++;

    if (record.count > max) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Max ${max} requests per ${windowMs / 1000} seconds.`,
      });
    }

    next();
  };
}

/**
 * Pagination middleware helper
 */
function paginationMiddleware() {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    req.pagination = {
      page,
      limit: Math.min(limit, 100), // Cap at 100
      offset,
    };

    next();
  };
}

module.exports = {
  delayMiddleware,
  errorSimulationMiddleware,
  loggingMiddleware,
  customHeadersMiddleware,
  rateLimitMiddleware,
  paginationMiddleware,
};
