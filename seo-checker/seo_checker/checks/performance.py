"""Checks for performance-related SEO factors."""

from typing import Dict, Any
from bs4 import BeautifulSoup


class PerformanceChecker:
    """Checks performance-related SEO elements."""

    def __init__(self, soup: BeautifulSoup, page_size_bytes: int):
        self.soup = soup
        self.page_size_bytes = page_size_bytes

    def run_all(self) -> Dict[str, Any]:
        """Run all performance checks."""
        return {
            "page_size_bytes": self.page_size_bytes,
            "page_size_kb": round(self.page_size_bytes / 1024, 2),
            "page_size_mb": round(self.page_size_bytes / (1024 * 1024), 2),
            "size_status": self._get_size_status(),
            "render_blocking": self.check_render_blocking(),
            "resource_counts": self.count_resources(),
            "inline_styles": self.check_inline_styles(),
            "recommendations": self._get_recommendations(),
        }

    def _get_size_status(self) -> str:
        """Get page size status."""
        size_kb = self.page_size_bytes / 1024
        if size_kb < 100:
            return "excellent"
        elif size_kb < 500:
            return "good"
        elif size_kb < 1000:
            return "acceptable"
        elif size_kb < 2000:
            return "warning"
        else:
            return "critical"

    def check_render_blocking(self) -> Dict[str, Any]:
        """Check for render-blocking resources."""
        # External stylesheets in head
        stylesheets = self.soup.find_all("link", attrs={"rel": "stylesheet"})
        blocking_css = [s.get("href", "") for s in stylesheets if not s.get("media") or s.get("media") == "all"]

        # Scripts in head (without defer/async)
        head = self.soup.find("head")
        blocking_scripts = []
        if head:
            scripts = head.find_all("script", src=True)
            for script in scripts:
                if not script.get("defer") and not script.get("async"):
                    blocking_scripts.append(script.get("src", ""))

        return {
            "stylesheets": len(blocking_css),
            "scripts": len(blocking_scripts),
            "blocking_css": blocking_css[:10],
            "blocking_scripts": blocking_scripts[:10],
            "total_blocking": len(blocking_css) + len(blocking_scripts),
        }

    def count_resources(self) -> Dict[str, Any]:
        """Count various resources on the page."""
        scripts = self.soup.find_all("script", src=True)
        stylesheets = self.soup.find_all("link", attrs={"rel": "stylesheet"})
        images = self.soup.find_all("img")
        iframes = self.soup.find_all("iframe")

        return {
            "scripts": len(scripts),
            "stylesheets": len(stylesheets),
            "images": len(images),
            "iframes": len(iframes),
            "total_requests_estimate": len(scripts) + len(stylesheets) + len(images) + len(iframes),
        }

    def check_inline_styles(self) -> Dict[str, Any]:
        """Check for excessive inline styles."""
        inline_style_tags = self.soup.find_all(style=True)
        style_tags = self.soup.find_all("style")

        total_inline = len(inline_style_tags) + len(style_tags)
        return {
            "inline_style_attributes": len(inline_style_tags),
            "style_tags": len(style_tags),
            "total": total_inline,
            "excessive": total_inline > 10,
            "recommendation": "Consider moving inline styles to external CSS" if total_inline > 10 else None
        }

    def _get_recommendations(self) -> list:
        """Get performance recommendations."""
        recommendations = []

        size_kb = self.page_size_bytes / 1024
        if size_kb > 2000:
            recommendations.append(f"Page size is {round(size_kb)}KB - aim for under 2MB")
        elif size_kb > 500:
            recommendations.append(f"Page size is {round(size_kb)}KB - consider optimizing")

        blocking = self.check_render_blocking()
        if blocking["scripts"] > 3:
            recommendations.append(f"{blocking['scripts']} render-blocking scripts - use defer/async")
        if blocking["stylesheets"] > 3:
            recommendations.append(f"{blocking['stylesheets']} stylesheets - consider combining")

        resources = self.count_resources()
        if resources["total_requests_estimate"] > 30:
            recommendations.append(f"{resources['total_requests_estimate']} potential requests - reduce where possible")

        return recommendations
