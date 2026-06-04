"""Checks for meta tags, title, Open Graph, Twitter Cards."""

from typing import Dict, Any
from bs4 import BeautifulSoup


class MetaChecker:
    """Checks meta-related SEO elements."""

    def __init__(self, soup: BeautifulSoup, url: str):
        self.soup = soup
        self.url = url

    def run_all(self) -> Dict[str, Any]:
        """Run all meta checks."""
        return {
            "title": self.check_title(),
            "description": self.check_description(),
            "keywords": self.check_keywords(),
            "open_graph": self.check_open_graph(),
            "twitter_cards": self.check_twitter_cards(),
            "canonical": self.check_canonical(),
            "robots": self.check_robots(),
            "viewport": self.check_viewport(),
        }

    def check_title(self) -> Dict[str, Any]:
        """Check title tag."""
        title_tag = self.soup.find("title")
        if not title_tag:
            return {"present": False, "text": None, "length": 0, "optimal_length": False}

        title_text = title_tag.get_text(strip=True)
        length = len(title_text)
        return {
            "present": True,
            "text": title_text,
            "length": length,
            "optimal_length": 50 <= length <= 60,
            "recommendation": None if 50 <= length <= 60 else f"Title should be 50-60 characters (currently {length})"
        }

    def check_description(self) -> Dict[str, Any]:
        """Check meta description."""
        meta_desc = self.soup.find("meta", attrs={"name": "description"})
        if not meta_desc or not meta_desc.get("content"):
            return {"present": False, "text": None, "length": 0, "optimal_length": False}

        desc_text = meta_desc["content"].strip()
        length = len(desc_text)
        return {
            "present": True,
            "text": desc_text,
            "length": length,
            "optimal_length": 150 <= length <= 160,
            "recommendation": None if 150 <= length <= 160 else f"Description should be 150-160 characters (currently {length})"
        }

    def check_keywords(self) -> Dict[str, Any]:
        """Check meta keywords (deprecated but still checked)."""
        meta_kw = self.soup.find("meta", attrs={"name": "keywords"})
        if not meta_kw or not meta_kw.get("content"):
            return {"present": False, "keywords": []}

        keywords = [k.strip() for k in meta_kw["content"].split(",")]
        return {
            "present": True,
            "keywords": keywords,
            "count": len(keywords),
            "recommendation": "Meta keywords are largely ignored by search engines, but won't hurt"
        }

    def check_open_graph(self) -> Dict[str, Any]:
        """Check Open Graph tags."""
        og_tags = {}
        for tag in ["title", "description", "image", "url", "type", "site_name"]:
            meta = self.soup.find("meta", attrs={"property": f"og:{tag}"})
            og_tags[tag] = meta["content"].strip() if meta and meta.get("content") else None

        missing = [k for k, v in og_tags.items() if v is None and k in ["title", "description", "image"]]
        return {
            "tags": og_tags,
            "missing": missing,
            "complete": len(missing) == 0,
            "recommendation": f"Add missing Open Graph tags: {', '.join(missing)}" if missing else None
        }

    def check_twitter_cards(self) -> Dict[str, Any]:
        """Check Twitter Card tags."""
        twitter_tags = {}
        for tag in ["card", "title", "description", "image"]:
            meta = self.soup.find("meta", attrs={"name": f"twitter:{tag}"})
            if not meta:
                meta = self.soup.find("meta", attrs={"property": f"twitter:{tag}"})
            twitter_tags[tag] = meta["content"].strip() if meta and meta.get("content") else None

        missing = [k for k, v in twitter_tags.items() if v is None]
        return {
            "tags": twitter_tags,
            "missing": missing,
            "complete": len(missing) == 0,
            "recommendation": f"Add missing Twitter Card tags: {', '.join(missing)}" if missing else None
        }

    def check_canonical(self) -> Dict[str, Any]:
        """Check canonical URL."""
        canonical = self.soup.find("link", attrs={"rel": "canonical"})
        if not canonical or not canonical.get("href"):
            return {"present": False, "url": None, "recommendation": "Add a canonical URL to avoid duplicate content issues"}

        return {
            "present": True,
            "url": canonical["href"].strip()
        }

    def check_robots(self) -> Dict[str, Any]:
        """Check robots meta tag."""
        robots = self.soup.find("meta", attrs={"name": "robots"})
        if not robots or not robots.get("content"):
            return {"present": False, "directives": None}

        content = robots["content"].strip()
        directives = [d.strip() for d in content.split(",")]
        return {
            "present": True,
            "directives": directives,
            "noindex": "noindex" in directives,
            "nofollow": "nofollow" in directives
        }

    def check_viewport(self) -> Dict[str, Any]:
        """Check viewport meta tag."""
        viewport = self.soup.find("meta", attrs={"name": "viewport"})
        if not viewport or not viewport.get("content"):
            return {"present": False, "content": None, "recommendation": "Add viewport meta tag for mobile responsiveness"}

        content = viewport["content"].strip()
        has_width = "width=" in content
        has_initial_scale = "initial-scale=" in content
        return {
            "present": True,
            "content": content,
            "has_width": has_width,
            "has_initial_scale": has_initial_scale,
            "mobile_friendly": has_width and has_initial_scale
        }
