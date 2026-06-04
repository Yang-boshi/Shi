"""Checks for links - broken links, internal/external analysis."""

from typing import Dict, Any, List, Set
from urllib.parse import urljoin, urlparse
import concurrent.futures

import requests
from bs4 import BeautifulSoup


class LinksChecker:
    """Checks link-related SEO elements."""

    def __init__(self, soup: BeautifulSoup, base_url: str, session: requests.Session):
        self.soup = soup
        self.base_url = base_url
        self.base_domain = urlparse(base_url).netloc
        self.session = session

    def run_all(self) -> Dict[str, Any]:
        """Run all link checks."""
        links = self._extract_links()
        internal = [l for l in links if l["type"] == "internal"]
        external = [l for l in links if l["type"] == "external"]
        broken = self._check_broken_links(links)

        return {
            "total": len(links),
            "internal_count": len(internal),
            "external_count": len(external),
            "broken_count": len(broken),
            "internal_links": internal[:20],
            "external_links": external[:20],
            "broken_links": broken,
            "nofollow_count": sum(1 for l in links if l.get("rel") and "nofollow" in l["rel"]),
            "recommendations": self._get_recommendations(len(internal), len(external), broken),
        }

    def _extract_links(self) -> List[Dict[str, Any]]:
        """Extract all links from the page."""
        links = []
        seen: Set[str] = set()

        for a_tag in self.soup.find_all("a", href=True):
            href = a_tag["href"].strip()
            if not href or href.startswith(("#", "javascript:", "mailto:", "tel:")):
                continue

            full_url = urljoin(self.base_url, href)
            if full_url in seen:
                continue
            seen.add(full_url)

            parsed = urlparse(full_url)
            link_type = "internal" if parsed.netloc == self.base_domain else "external"

            rel = a_tag.get("rel", [])
            if isinstance(rel, str):
                rel = [rel]

            links.append({
                "url": full_url,
                "text": a_tag.get_text(strip=True)[:100],
                "type": link_type,
                "rel": rel,
                "has_nofollow": "nofollow" in rel,
                "target": a_tag.get("target"),
                "opens_new_tab": a_tag.get("target") == "_blank",
            })

        return links

    def _check_broken_links(self, links: List[Dict[str, Any]], max_check: int = 50) -> List[Dict[str, Any]]:
        """Check for broken links (limited to max_check)."""
        broken = []
        links_to_check = links[:max_check]

        def check_link(link: Dict[str, Any]) -> Dict[str, Any] | None:
            try:
                resp = self.session.head(
                    link["url"],
                    timeout=10,
                    allow_redirects=True
                )
                if resp.status_code >= 400:
                    return {
                        "url": link["url"],
                        "text": link["text"],
                        "status": resp.status_code,
                    }
            except requests.RequestException:
                try:
                    resp = self.session.get(
                        link["url"],
                        timeout=10,
                        allow_redirects=True
                    )
                    if resp.status_code >= 400:
                        return {
                            "url": link["url"],
                            "text": link["text"],
                            "status": resp.status_code,
                        }
                except requests.RequestException:
                    return {
                        "url": link["url"],
                        "text": link["text"],
                        "status": "timeout/error",
                    }
            return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = {executor.submit(check_link, link): link for link in links_to_check}
            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                if result:
                    broken.append(result)

        return broken

    def _get_recommendations(self, internal: int, external: int, broken: list) -> List[str]:
        """Get link-related recommendations."""
        recs = []

        if internal < 3:
            recs.append("Add more internal links to improve site navigation")

        if broken:
            recs.append(f"Fix {len(broken)} broken link(s)")

        if external == 0:
            recs.append("Consider adding relevant external links")

        return recs
