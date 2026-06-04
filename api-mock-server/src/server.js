const express = require("express");
const cors = require("cors");
const { generateData, generateSingleItem } = require("./generators");

// In-memory store for increment IDs
const incrementCounters = {};

/**
 * Create and start the mock server
 * @param {object} config - Parsed config
 * @param {object} options - Server options
 */
async function createServer(config, options) {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (options.enableCors) {
    app.use(cors());
  }

  // Request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const statusColor = status >= 400 ? "\x1b[31m" : "\x1b[32m";
      console.log(
        `${req.method} ${req.originalUrl} ${statusColor}${status}\x1b[0m ${duration}ms`
      );
    });
    next();
  });

  // Apply delay middleware
  if (options.delay > 0) {
    app.use((req, res, next) => {
      setTimeout(next, options.delay);
    });
  }

  // Error simulation middleware
  if (options.errorRate > 0) {
    app.use((req, res, next) => {
      if (Math.random() * 100 < options.errorRate) {
        return res.status(500).json({
          error: "Internal Server Error",
          message: "Simulated error for testing",
        });
      }
      next();
    });
  }

  // Setup routes
  config.endpoints.forEach((endpoint) => {
    const fullPath = (config.base || "") + endpoint.path;
    const routePath = fullPath.replace(/:(\w+)/g, ":$1");

    const handler = createEndpointHandler(endpoint, config.base);

    switch (endpoint.method) {
      case "GET":
        app.get(routePath, handler);
        break;
      case "POST":
        app.post(routePath, handler);
        break;
      case "PUT":
        app.put(routePath, handler);
        break;
      case "PATCH":
        app.patch(routePath, handler);
        break;
      case "DELETE":
        app.delete(routePath, handler);
        break;
      default:
        console.warn(`Unsupported method: ${endpoint.method} for ${endpoint.path}`);
    }
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: "Not Found",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  });

  // Start server
  return new Promise((resolve) => {
    const server = app.listen(options.port, () => {
      resolve(server);
    });
  });
}

/**
 * Create handler for an endpoint
 */
function createEndpointHandler(endpoint, basePath) {
  return (req, res) => {
    // Static response
    if (endpoint.static) {
      return res.json(endpoint.static);
    }

    // Custom status code
    if (endpoint.status && endpoint.method !== "GET") {
      const responseData = endpoint.response || { message: "Success" };
      return res.status(endpoint.status).json(responseData);
    }

    // GET with count (list)
    if (endpoint.method === "GET" && endpoint.count > 0) {
      const key = `${basePath}${endpoint.path}`;
      if (!incrementCounters[key]) {
        incrementCounters[key] = 0;
      }

      const items = [];
      for (let i = 0; i < endpoint.count; i++) {
        incrementCounters[key]++;
        items.push(generateSingleItem(endpoint.fields, req.params, incrementCounters[key]));
      }

      return res.json(items);
    }

    // GET single item (with :id param)
    if (endpoint.method === "GET" && req.params.id) {
      const item = generateSingleItem(endpoint.fields, req.params, parseInt(req.params.id) || 1);
      return res.json(item);
    }

    // POST (create)
    if (endpoint.method === "POST") {
      const key = `${basePath}${endpoint.path}`;
      if (!incrementCounters[key]) {
        incrementCounters[key] = 0;
      }
      incrementCounters[key]++;

      const item = generateSingleItem(endpoint.fields, req.params, incrementCounters[key]);
      // Merge with request body
      Object.assign(item, req.body);
      return res.status(201).json(item);
    }

    // PUT/PATCH (update)
    if (endpoint.method === "PUT" || endpoint.method === "PATCH") {
      const item = generateSingleItem(endpoint.fields, req.params, parseInt(req.params.id) || 1);
      Object.assign(item, req.body);
      return res.json(item);
    }

    // DELETE
    if (endpoint.method === "DELETE") {
      return res.json({
        message: "Resource deleted successfully",
        id: req.params.id || null,
      });
    }

    // Default GET without count
    const item = generateSingleItem(endpoint.fields, req.params, 1);
    res.json(item);
  };
}

module.exports = { createServer };
