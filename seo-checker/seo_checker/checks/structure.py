"""Checks for page structure, headings, semantic HTML, images."""

from typing import Dict, Any, List
from bs4 import BeautifulSoup


class StructureChecker:
    """Checks structural SEO elements."""

    def __init__(self, soup: BeautifulSoup):
        self.soup = soup

    def run_all(self) -> Dict[str, Any]:
        """Run all structure checks."""
        return {
            "headings": self.check_headings(),
            "images": self.check_images(),
            "semantic_html": self.check_semantic_html(),
            "lists": self.check_lists(),
            "text_ratio": self.check_text_ratio(),
        }

    def check_headings(self) -> Dict[str, Any]:
        """Check heading hierarchy (H1-H6)."""
        headings = {}
        for level in range(1, 7):
            tag = f"h{level}"
            found = self.soup.find_all(tag)
            headings[f"{tag}_count"] = len(found)
            headings[f"{tag}_texts"] = [h.get_text(strip=True)[:100] for h in found[:5]]

        h1_count = headings["h1_count"]
        issues = []
        if h1_count == 0:
            issues.append("No H1 tag found - every page should have exactly one H1")
        elif h1_count > 1:
            issues.append(f"Multiple H1 tags found ({h1_count}) - should have exactly one")

        # Check for skipped levels
        prev_level = 0
        for level in range(1, 7):
            if headings[f"h{level}_count"] > 0:
                if prev_level > 0 and level > prev_level + 1:
                    issues.append(f"Heading level skip: H{prev_level} to H{level}")
                prev_level = level

        return {
            **headings,
            "issues": issues,
            "hierarchy_valid": len(issues) == 0,
            "recommendation": "; ".join(issues) if issues else None
        }

    def check_images(self) -> Dict[str, Any]:
        """Check image alt attributes."""
        images = self.soup.find_all("img")
        total = len(images)
        missing_alt = []
        empty_alt = []
        good_alt = []

        for img in images:
            alt = img.get("alt")
            src = img.get("src", img.get("data-src", "unknown"))
            if alt is None:
                missing_alt.append(src)
            elif alt.strip() == "":
                empty_alt.append(src)
            else:
                good_alt.append(src)

        issues = []
        if missing_alt:
            issues.append(f"{len(missing_alt)} images missing alt attribute")
        if empty_alt:
            issues.append(f"{len(empty_alt)} images with empty alt attribute")

        return {
            "total": total,
            "with_alt": len(good_alt),
            "empty_alt": len(empty_alt),
            "missing_alt": len(missing_alt),
            "missing_alt_sources": missing_alt[:10],
            "issues": issues,
            "recommendation": "; ".join(issues) if issues else None
        }

    def check_semantic_html(self) -> Dict[str, Any]:
        """Check for semantic HTML elements."""
        semantic_tags = {
            "header": bool(self.soup.find("header")),
            "nav": bool(self.soup.find("nav")),
            "main": bool(self.soup.find("main")),
            "article": bool(self.soup.find("article")),
            "section": bool(self.soup.find("section")),
            "footer": bool(self.soup.find("footer")),
            "aside": bool(self.soup.find("aside")),
        }

        missing = [tag for tag, found in semantic_tags.items() if not found]
        present = [tag for tag, found in semantic_tags.items() if found]

        return {
            **semantic_tags,
            "has_header": semantic_tags["header"],
            "has_main": semantic_tags["main"],
            "has_footer": semantic_tags["footer"],
            "present_tags": present,
            "missing_tags": missing,
            "recommendation": f"Consider adding semantic HTML: {', '.join(missing)}" if missing else None
        }

    def check_lists(self) -> Dict[str, Any]:
        """Check for proper list usage."""
        ul_count = len(self.soup.find_all("ul"))
        ol_count = len(self.soup.find_all("ol"))
        return {
            "unordered_lists": ul_count,
            "ordered_lists": ol_count,
            "total": ul_count + ol_count
        }

    def check_text_ratio(self) -> Dict[str, Any]:
        """Check text to HTML ratio."""
        text = self.soup.get_text(separator=" ", strip=True)
        text_length = len(text)
        html_length = len(str(self.soup))
        ratio = (text_length / html_length * 100) if html_length > 0 else 0

        return {
            "text_length": text_length,
            "html_length": html_length,
            "ratio_percent": round(ratio, 1),
            "recommendation": "Text to HTML ratio is low - consider adding more content" if ratio < 10 else None
        }
