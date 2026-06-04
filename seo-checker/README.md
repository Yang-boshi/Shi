# SEO Checker

A Python CLI tool that audits web pages for SEO issues and provides actionable recommendations.

## Features

- **Title Tag Analysis**: Checks presence, length (50-60 chars optimal)
- **Meta Description**: Validates presence and length (150-160 chars optimal)
- **Heading Hierarchy**: Ensures proper H1-H6 structure
- **Image Alt Attributes**: Finds images missing alt text
- **Link Analysis**: Checks for broken links, internal/external ratio
- **Open Graph Tags**: Validates og:title, og:description, og:image
- **Twitter Cards**: Checks twitter:card, twitter:title
- **Canonical URL**: Verifies canonical link tag
- **Robots Meta**: Checks robots directives
- **Page Size**: Warns if page exceeds recommended size
- **Mobile Viewport**: Validates viewport meta tag
- **Scoring System**: 0-100 score with letter grade (A-F)
- **Colored Output**: Easy-to-read terminal output with colors
- **JSON Mode**: Machine-readable output with `--json` flag

## Installation

```bash
pip install -e .
```

Or install dependencies directly:

```bash
pip install requests beautifulsoup4 lxml
```

## Usage

```bash
# Basic check
seo-check https://example.com

# JSON output
seo-check https://example.com --json

# Verbose mode with all details
seo-check https://example.com --verbose

# Check with custom timeout
seo-check https://example.com --timeout 30
```

## Sample Output

```
SEO Checker Report
==================

URL: https://example.com
Score: 85/100 (B)

✓ PASS  Title Tag: "Example Domain" (14 chars)
✓ PASS  Meta Description: Present (125 chars)
⚠ WARN  H1 Tag: Found 1 H1 tag
✓ PASS  Images: All 3 images have alt text
✗ FAIL  Open Graph: Missing og:image
✓ PASS  Viewport: Mobile viewport configured
✓ PASS  Canonical: Canonical URL set
⚠ WARN  Page Size: 45KB (acceptable)

Detailed Results:
  Title: "Example Domain" - Good length (14 chars)
  Description: "This is an example domain..." - Consider making it 150-160 chars
  Headings: H1(1) H2(3) H3(2) - Good hierarchy
  Links: 5 internal, 2 external, 0 broken
```

## Exit Codes

- `0`: Score >= 80 (good)
- `1`: Score >= 60 (needs improvement)
- `2`: Score < 60 (poor)
- `3`: Error (invalid URL, connection failed)

## License

MIT
