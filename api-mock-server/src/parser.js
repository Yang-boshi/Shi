const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Parse a YAML or JSON config file
 * @param {string} configPath - Path to config file
 * @returns {object} Parsed config
 */
function parseConfig(configPath) {
  const ext = path.extname(configPath).toLowerCase();
  const content = fs.readFileSync(configPath, "utf8");

  let config;

  if (ext === ".yaml" || ext === ".yml") {
    config = yaml.load(content);
  } else if (ext === ".json") {
    config = JSON.parse(content);
  } else {
    // Try YAML first, then JSON
    try {
      config = yaml.load(content);
    } catch {
      config = JSON.parse(content);
    }
  }

  return validateConfig(config);
}

/**
 * Validate and normalize config
 * @param {object} config - Raw config object
 * @returns {object} Validated config
 */
function validateConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid config: must be an object");
  }

  if (!config.endpoints || !Array.isArray(config.endpoints)) {
    throw new Error("Invalid config: 'endpoints' must be an array");
  }

  // Set defaults
  const validated = {
    port: config.port || 3000,
    base: config.base || "",
    delay: config.delay || 0,
    endpoints: [],
  };

  // Normalize base path
  if (validated.base && !validated.base.startsWith("/")) {
    validated.base = "/" + validated.base;
  }
  if (validated.base && validated.base.endsWith("/")) {
    validated.base = validated.base.slice(0, -1);
  }

  // Validate endpoints
  config.endpoints.forEach((endpoint, index) => {
    if (!endpoint.path) {
      throw new Error(`Endpoint ${index}: 'path' is required`);
    }

    const normalized = {
      path: endpoint.path,
      method: (endpoint.method || "GET").toUpperCase(),
      fields: endpoint.fields || {},
      count: endpoint.count || 0,
      status: endpoint.status || null,
      response: endpoint.response || null,
      static: endpoint.static || null,
    };

    // Ensure path starts with /
    if (!normalized.path.startsWith("/")) {
      normalized.path = "/" + normalized.path;
    }

    validated.endpoints.push(normalized);
  });

  return validated;
}

module.exports = { parseConfig, validateConfig };
