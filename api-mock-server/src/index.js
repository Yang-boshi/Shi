const { createServer } = require("./server");
const { parseConfig } = require("./parser");
const { generateData } = require("./generators");

module.exports = {
  createServer,
  parseConfig,
  generateData,
};
