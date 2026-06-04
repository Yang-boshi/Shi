"""Formats and outputs SEO analysis results."""

from typing import Dict, Any


class Colors:
    """ANSI color codes for terminal output."""
    RESET = "\033[0m"
    BOLD = "\033[1m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    WHITE = "\033[97m"
    GRAY = "\033[90m"


class SEOReporter:
    """Formats and prints SEO analysis results."""

    def __init__(self, verbose: bool = False):
        self.verbose = verbose

    def print_report(self, results: Dict[str, Any]):
        """Print formatted report to terminal."""
        score = results.get("score", 0)
        grade = results.get("grade", "F")
        url = results.get("url", "")

        # Header
        print(f"\n{Colors.BOLD}{Colors.CYAN}SEO Checker Report{Colors.RESET}")
        print(f"{Colors.CYAN}{'=' * 50}{Colors.RESET}\n")

        # URL and Score
        print(f"{Colors.BOLD}URL:{Colors.RESET} {url}")
        score_color = self._get_score_color(score)
        print(f"{Colors.BOLD}Score:{Colors.RESET} {score_color}{score}/100 ({grade}){Colors.RESET}")
        print(f"{Colors.BOLD}Analysis Time:{Colors.RESET} {results.get('analysis_time', 0)}s")
        print()

        # Score bar
        self._print_score_bar(score)
        print()

        # Summary
        print(f"{Colors.BOLD}Summary:{Colors.RESET}")
        self._print_summary(results.get("checks", {}))
        print()

        # Detailed results
        if self.verbose:
            print(f"{Colors.BOLD}Detailed Results:{Colors.RESET}")
            self._print_details(results.get("checks", {}))
        else:
            print(f"{Colors.GRAY}Use --verbose for detailed results{Colors.RESET}")

        print()

    def _get_score_color(self, score: int) -> str:
        """Get color based on score."""
        if score >= 80:
            return Colors.GREEN
        elif score >= 60:
            return Colors.YELLOW
        else:
            return Colors.RED

    def _print_score_bar(self, score: int):
        """Print a visual score bar."""
        width = 40
        filled = int(width * score / 100)
        empty = width - filled
        color = self._get_score_color(score)
        print(f"{color}[{'█' * filled}{'░' * empty}]{Colors.RESET} {score}%")

    def _print_summary(self, checks: Dict[str, Any]):
        """Print summary of all checks."""
        meta = checks.get("meta", {})
        structure = checks.get("structure", {})
        perf = checks.get("performance", {})
        links = checks.get("links", {})

        # Title
        self._print_check(
            "Title Tag",
            meta.get("title", {}).get("present", False),
            meta.get("title", {}).get("optimal_length", False),
            f"'{meta.get('title', {}).get('text', 'N/A')}' ({meta.get('title', {}).get('length', 0)} chars)"
        )

        # Description
        self._print_check(
            "Meta Description",
            meta.get("description", {}).get("present", False),
            meta.get("description", {}).get("optimal_length", False),
            f"{meta.get('description', {}).get('length', 0)} chars"
        )

        # H1
        h1_count = structure.get("headings", {}).get("h1_count", 0)
        self._print_check(
            "H1 Tag",
            h1_count > 0,
            h1_count == 1,
            f"{h1_count} found"
        )

        # Images
        images = structure.get("images", {})
        img_ok = images.get("total", 0) == 0 or images.get("missing_alt", 0) == 0
        self._print_check(
            "Image Alt Text",
            img_ok,
            img_ok,
            f"{images.get('missing_alt', 0)}/{images.get('total', 0)} missing"
        )

        # Viewport
        self._print_check(
            "Mobile Viewport",
            meta.get("viewport", {}).get("present", False),
            meta.get("viewport", {}).get("mobile_friendly", False),
        )

        # Canonical
        self._print_check(
            "Canonical URL",
            meta.get("canonical", {}).get("present", False),
            meta.get("canonical", {}).get("present", False),
        )

        # Open Graph
        og = meta.get("open_graph", {})
        self._print_check(
            "Open Graph",
            og.get("title") is not None,
            og.get("complete", False),
            f"{len(og.get('missing', []))} missing" if og.get("missing") else "complete"
        )

        # Page size
        size_kb = perf.get("page_size_kb", 0)
        size_ok = size_kb < 2000
        self._print_check(
            "Page Size",
            size_ok,
            size_kb < 500,
            f"{size_kb}KB"
        )

        # Links (if not skipped)
        if not links.get("skipped"):
            broken = links.get("broken_count", 0)
            self._print_check(
                "Links",
                broken == 0,
                broken == 0,
                f"{broken} broken" if broken else f"{links.get('internal_count', 0)} internal, {links.get('external_count', 0)} external"
            )

    def _print_check(self, name: str, passed: bool, optimal: bool, detail: str = ""):
        """Print a single check result."""
        if passed and optimal:
            icon = f"{Colors.GREEN}✓ PASS{Colors.RESET}"
        elif passed:
            icon = f"{Colors.YELLOW}⚠ WARN{Colors.RESET}"
        else:
            icon = f"{Colors.RED}✗ FAIL{Colors.RESET}"

        detail_str = f" - {detail}" if detail else ""
        print(f"  {icon}  {name}{detail_str}")

    def _print_details(self, checks: Dict[str, Any]):
        """Print detailed results."""
        meta = checks.get("meta", {})
        structure = checks.get("structure", {})
        perf = checks.get("performance", {})
        links = checks.get("links", {})

        print(f"\n  {Colors.BOLD}Meta Tags:{Colors.RESET}")
        title = meta.get("title", {})
        if title.get("text"):
            print(f"    Title: \"{title['text']}\"")
            if title.get("recommendation"):
                print(f"    {Colors.YELLOW}→ {title['recommendation']}{Colors.RESET}")

        desc = meta.get("description", {})
        if desc.get("text"):
            print(f"    Description: \"{desc['text'][:100]}...\"")
            if desc.get("recommendation"):
                print(f"    {Colors.YELLOW}→ {desc['recommendation']}{Colors.RESET}")

        print(f"\n  {Colors.BOLD}Structure:{Colors.RESET}")
        headings = structure.get("headings", {})
        heading_str = " ".join(
            f"H{i}({headings.get(f'h{i}_count', 0)})"
            for i in range(1, 7)
            if headings.get(f"h{i}_count", 0) > 0
        )
        print(f"    Headings: {heading_str}")
        if headings.get("issues"):
            for issue in headings["issues"]:
                print(f"    {Colors.YELLOW}→ {issue}{Colors.RESET}")

        images = structure.get("images", {})
        print(f"    Images: {images.get('total', 0)} total, {images.get('with_alt', 0)} with alt")
        if images.get("missing_alt_sources"):
            for src in images["missing_alt_sources"][:3]:
                print(f"    {Colors.RED}→ Missing alt: {src}{Colors.RESET}")

        print(f"\n  {Colors.BOLD}Performance:{Colors.RESET}")
        print(f"    Page Size: {perf.get('page_size_kb', 0)}KB ({perf.get('size_status', 'unknown')})")
        resources = perf.get("resource_counts", {})
        print(f"    Resources: {resources.get('scripts', 0)} scripts, {resources.get('stylesheets', 0)} CSS, {resources.get('images', 0)} images")
        blocking = perf.get("render_blocking", {})
        print(f"    Render Blocking: {blocking.get('stylesheets', 0)} CSS, {blocking.get('scripts', 0)} scripts")
        if perf.get("recommendations"):
            for rec in perf["recommendations"]:
                print(f"    {Colors.YELLOW}→ {rec}{Colors.RESET}")

        if not links.get("skipped"):
            print(f"\n  {Colors.BOLD}Links:{Colors.RESET}")
            print(f"    Internal: {links.get('internal_count', 0)}")
            print(f"    External: {links.get('external_count', 0)}")
            print(f"    Nofollow: {links.get('nofollow_count', 0)}")
            if links.get("broken_links"):
                print(f"    {Colors.RED}Broken Links:{Colors.RESET}")
                for bl in links["broken_links"][:5]:
                    print(f"      {Colors.RED}✗ {bl['url']} ({bl['status']}){Colors.RESET}")
            if links.get("recommendations"):
                for rec in links["recommendations"]:
                    print(f"    {Colors.YELLOW}→ {rec}{Colors.RESET}")
