#!/usr/bin/env node

const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const { createServer } = require("../src/server");
const { parseConfig } = require("../src/parser");

program
  .name("mock-server")
  .description("Generate a mock REST API server from YAML/JSON config")
  .version("1.0.0")
  .option("-c, --config <path>", "Path to config file", "api.yaml")
  .option("-p, --port <port>", "Server port", "3000")
  .option("-d, --delay <ms>", "Response delay in milliseconds", "0")
  .option("-e, --error-rate <percent>", "Error simulation rate (0-100)", "0")
  .option("-w, --watch", "Watch config file for changes")
  .option("--no-cors", "Disable CORS")
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    const configPath = path.resolve(options.config);

    if (!fs.existsSync(configPath)) {
      console.error(`Error: Config file not found: ${configPath}`);
      console.error("\nCreate an api.yaml file or specify a config with --config");
      process.exit(1);
    }

    console.log(`Loading config from: ${configPath}`);
    const config = parseConfig(configPath);

    // Override config with CLI options
    const port = parseInt(options.port) || config.port || 3000;
    const delay = parseInt(options.delay) || config.delay || 0;
    const errorRate = parseInt(options.errorRate) || 0;
    const enableCors = options.cors !== false;

    const serverOptions = {
      port,
      delay,
      errorRate,
      enableCors,
      configPath,
      watch: options.watch || false,
    };

    await createServer(config, serverOptions);

    console.log(`\nMock API Server running at http://localhost:${port}`);
    if (config.base) {
      console.log(`Base path: ${config.base}`);
    }
    console.log(`Delay: ${delay}ms`);
    if (errorRate > 0) {
      console.log(`Error rate: ${errorRate}%`);
    }
    console.log(`CORS: ${enableCors ? "enabled" : "disabled"}`);
    console.log("\nEndpoints:");
    config.endpoints.forEach((ep) => {
      const method = (ep.method || "GET").toUpperCase().padEnd(7);
      const countInfo = ep.count ? ` (${ep.count} items)` : "";
      console.log(`  ${method} ${config.base || ""}${ep.path}${countInfo}`);
    });
    console.log("\nPress Ctrl+C to stop");

    if (options.watch) {
      console.log("\nWatching for config changes...");
      fs.watchFile(configPath, { interval: 1000 }, () => {
        console.log("\nConfig file changed, restarting...");
        process.exit(0); // Process manager will restart
      });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
