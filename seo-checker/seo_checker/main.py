#!/usr/bin/env python3
"""CLI entry point for SEO Checker."""

import argparse
import sys
import json
from urllib.parse import urlparse

from seo_checker.analyzer import SEOAnalyzer
from seo_checker.reporter import SEOReporter


def validate_url(url: str) -> str:
    """Validate and normalize URL."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    parsed = urlparse(url)
    if not parsed.netloc:
        raise argparse.ArgumentTypeError(f"Invalid URL: {url}")
    return url


def main():
    parser = argparse.ArgumentParser(
        prog="seo-check",
        description="Audit web pages for SEO issues and get actionable recommendations."
    )
    parser.add_argument(
        "url",
        type=validate_url,
        help="URL to analyze"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="json_output",
        help="Output results in JSON format"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show detailed analysis"
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=30,
        help="Request timeout in seconds (default: 30)"
    )
    parser.add_argument(
        "--no-links",
        action="store_true",
        help="Skip link checking (faster analysis)"
    )
    parser.add_argument(
        "--version",
        action="version",
        version="%(prog)s 1.0.0"
    )

    args = parser.parse_args()

    try:
        analyzer = SEOAnalyzer(timeout=args.timeout)
        results = analyzer.analyze(args.url, check_links=not args.no_links)

        if args.json_output:
            print(json.dumps(results, indent=2))
        else:
            reporter = SEOReporter(verbose=args.verbose)
            reporter.print_report(results)

        score = results.get("score", 0)
        if score >= 80:
            sys.exit(0)
        elif score >= 60:
            sys.exit(1)
        else:
            sys.exit(2)

    except KeyboardInterrupt:
        print("\nAnalysis cancelled.", file=sys.stderr)
        sys.exit(130)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(3)


if __name__ == "__main__":
    main()
