"""Main analysis engine for SEO Checker."""

import time
from typing import Dict, Any, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

from seo_checker.checks.meta import MetaChecker
from seo_checker.checks.structure import StructureChecker
from seo_checker.checks.performance import PerformanceChecker
from seo_checker.checks.links import LinksChecker


class SEOAnalyzer:
    """Main analyzer that coordinates all SEO checks."""

    def __init__(self, timeout: int = 30):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "SEOChecker/1.0 (SEO Analysis Tool)"
        })

    def fetch_page(self, url: str) -> requests.Response:
        """Fetch the page content."""
        response = self.session.get(url, timeout=self.timeout)
        response.raise_for_status()
        return response

    def analyze(self, url: str, check_links: bool = True) -> Dict[str, Any]:
        """Run full SEO analysis on a URL."""
        start_time = time.time()

        # Fetch the page
        response = self.fetch_page(url)
        soup = BeautifulSoup(response.text, "lxml")
        page_size = len(response.content)

        # Run all checks
        results = {
            "url": url,
            "status_code": response.status_code,
            "page_size_bytes": page_size,
            "checks": {}
        }

        # Meta checks
        meta_checker = MetaChecker(soup, url)
        results["checks"]["meta"] = meta_checker.run_all()

        # Structure checks
        structure_checker = StructureChecker(soup)
        results["checks"]["structure"] = structure_checker.run_all()

        # Performance checks
        perf_checker = PerformanceChecker(soup, page_size)
        results["checks"]["performance"] = perf_checker.run_all()

        # Link checks
        if check_links:
            links_checker = LinksChecker(soup, url, self.session)
            results["checks"]["links"] = links_checker.run_all()
        else:
            results["checks"]["links"] = {"skipped": True}

        # Calculate score
        results["score"] = self._calculate_score(results["checks"])
        results["grade"] = self._get_grade(results["score"])
        results["analysis_time"] = round(time.time() - start_time, 2)

        return results

    def _calculate_score(self, checks: Dict[str, Any]) -> int:
        """Calculate overall SEO score (0-100)."""
        score = 100
        deductions = []

        # Meta checks (40 points possible)
        meta = checks.get("meta", {})

        # Title (10 points)
        if not meta.get("title", {}).get("present"):
            score -= 10
            deductions.append("Missing title tag")
        elif not meta.get("title", {}).get("optimal_length"):
            score -= 3
            deductions.append("Title length not optimal")

        # Description (10 points)
        if not meta.get("description", {}).get("present"):
            score -= 10
            deductions.append("Missing meta description")
        elif not meta.get("description", {}).get("optimal_length"):
            score -= 3
            deductions.append("Description length not optimal")

        # Open Graph (10 points)
        og = meta.get("open_graph", {})
        og_missing = sum(1 for v in [og.get("title"), og.get("description"), og.get("image")] if not v)
        score -= og_missing * 3

        # Canonical (5 points)
        if not meta.get("canonical"):
            score -= 5
            deductions.append("Missing canonical URL")

        # Viewport (5 points)
        if not meta.get("viewport"):
            score -= 5
            deductions.append("Missing viewport meta")

        # Structure checks (30 points possible)
        structure = checks.get("structure", {})

        # H1 (10 points)
        h1_count = structure.get("headings", {}).get("h1_count", 0)
        if h1_count == 0:
            score -= 10
            deductions.append("No H1 tag found")
        elif h1_count > 1:
            score -= 5
            deductions.append("Multiple H1 tags")

        # Images alt text (10 points)
        images = structure.get("images", {})
        if images.get("total", 0) > 0:
            missing_ratio = images.get("missing_alt", 0) / images["total"]
            if missing_ratio > 0.5:
                score -= 10
            elif missing_ratio > 0:
                score -= int(missing_ratio * 10)

        # Semantic HTML (10 points)
        if not structure.get("semantic_html", {}).get("has_main"):
            score -= 3
        if not structure.get("semantic_html", {}).get("has_header"):
            score -= 2

        # Performance checks (20 points possible)
        perf = checks.get("performance", {})

        # Page size (10 points)
        if perf.get("page_size_kb", 0) > 5000:
            score -= 10
        elif perf.get("page_size_kb", 0) > 2000:
            score -= 5

        # Render blocking (10 points)
        blocking = perf.get("render_blocking", {})
        if blocking.get("scripts", 0) > 3:
            score -= 5
        if blocking.get("stylesheets", 0) > 3:
            score -= 5

        # Link checks (10 points possible)
        links = checks.get("links", {})
        if not links.get("skipped"):
            if links.get("broken_count", 0) > 0:
                score -= min(10, links["broken_count"] * 2)

        return max(0, min(100, score))

    def _get_grade(self, score: int) -> str:
        """Convert score to letter grade."""
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
