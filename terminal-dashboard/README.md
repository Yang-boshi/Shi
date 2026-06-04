# Terminal Dashboard - System Monitor

[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)]()

A beautiful terminal-based system monitoring dashboard built with Python and Rich.

## Features

- Real-time CPU usage per core with bar charts
- Memory usage (RAM + Swap)
- Disk usage monitoring
- Network I/O statistics
- Top processes by CPU and memory usage
- Beautiful colorized terminal UI
- Auto-refreshing display

## Screenshot Description

The dashboard displays:
- **CPU Section**: Horizontal bar charts for each CPU core showing real-time usage %
- **Memory Section**: Progress bars for RAM and swap with used/total values
- **Disk Section**: Disk usage for all mounted partitions
- **Network Section**: Upload/download speeds with total traffic
- **Process Section**: Top 10 processes sorted by CPU/memory usage

## Installation

```bash
pip install -e .
```

## Usage

```bash
# Run the dashboard
sysmon

# Or run as module
python -m sysmon

# Run for specific duration (useful for testing)
timeout 10 sysmon
```

## Requirements

- Python 3.8+
- Rich library
- psutil library

## License

MIT
