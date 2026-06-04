"""Diff analysis logic for determining commit type and generating messages."""

import re
from typing import Dict, List, Tuple


class DiffAnalyzer:
    """Analyzes git diff output to determine change type and scope."""

    COMMIT_TYPES = {
        "feat": {"keywords": ["add", "new", "create", "implement", "introduce", "feature"], "priority": 1},
        "fix": {"keywords": ["fix", "bug", "error", "issue", "resolve", "patch", "correct"], "priority": 2},
        "docs": {"keywords": ["doc", "readme", "comment", "documentation", "md"], "priority": 3},
        "style": {"keywords": ["format", "style", "whitespace", "indentation", "lint"], "priority": 4},
        "refactor": {"keywords": ["refactor", "restructure", "reorganize", "rename", "move"], "priority": 5},
        "perf": {"keywords": ["performance", "optimize", "speed", "fast", "cache"], "priority": 6},
        "test": {"keywords": ["test", "spec", "assert", "mock", "fixture"], "priority": 7},
        "chore": {"keywords": ["chore", "update", "upgrade", "dependency", "config", "setup"], "priority": 8},
        "ci": {"keywords": ["ci", "cd", "pipeline", "workflow", "action", "deploy"], "priority": 9},
    }

    FILE_TYPE_MAP = {
        ".py": "python",
        ".js": "javascript",
        ".ts": "typescript",
        ".jsx": "react",
        ".tsx": "react",
        ".java": "java",
        ".cpp": "cpp",
        ".c": "c",
        ".go": "go",
        ".rs": "rust",
        ".rb": "ruby",
        ".php": "php",
        ".swift": "swift",
        ".kt": "kotlin",
        ".md": "docs",
        ".txt": "docs",
        ".rst": "docs",
        ".yml": "config",
        ".yaml": "config",
        ".json": "config",
        ".toml": "config",
        ".cfg": "config",
        ".ini": "config",
        ".sh": "script",
        ".bash": "script",
        ".html": "html",
        ".css": "style",
        ".scss": "style",
        ".less": "style",
    }

    def analyze_diff(self, diff_text: str) -> Dict:
        """Analyze diff text and return analysis results."""
        if not diff_text or not diff_text.strip():
            return {"type": "chore", "scope": "", "description": "no changes detected", "files": []}

        files = self._extract_files(diff_text)
        added_lines = self._count_lines(diff_text, "+")
        removed_lines = self._count_lines(diff_text, "-")
        change_type = self._determine_type(diff_text, files)
        scope = self._determine_scope(files)
        description = self._generate_description(diff_text, files, change_type)

        return {
            "type": change_type,
            "scope": scope,
            "description": description,
            "files": files,
            "added": added_lines,
            "removed": removed_lines,
        }

    def _extract_files(self, diff_text: str) -> List[str]:
        """Extract file names from diff."""
        files = []
        for match in re.finditer(r"^(?:diff --git a/|--- a/|\+\+\+ b/)(.+)$", diff_text, re.MULTILINE):
            filepath = match.group(1).strip()
            if filepath and filepath not in files and not filepath.startswith("/dev/null"):
                files.append(filepath)
        return files

    def _count_lines(self, diff_text: str, prefix: str) -> int:
        """Count added or removed lines."""
        count = 0
        for line in diff_text.split("\n"):
            if line.startswith(prefix) and not line.startswith(f"{prefix}{prefix}{prefix}"):
                count += 1
        return count

    def _determine_type(self, diff_text: str, files: List[str]) -> str:
        """Determine the commit type based on diff content and files."""
        diff_lower = diff_text.lower()
        scores: Dict[str, int] = {}

        for commit_type, info in self.COMMIT_TYPES.items():
            score = 0
            for keyword in info["keywords"]:
                if keyword in diff_lower:
                    score += 10
            if score > 0:
                scores[commit_type] = score + (100 - info["priority"])

        for filepath in files:
            ext = self._get_extension(filepath)
            if ext in (".md", ".txt", ".rst"):
                scores["docs"] = scores.get("docs", 0) + 30
            elif ext in (".test.", ".spec.") or "test" in filepath.lower():
                scores["test"] = scores.get("test", 0) + 30
            elif ext in (".yml", ".yaml") and ("ci" in filepath.lower() or "workflow" in filepath.lower()):
                scores["ci"] = scores.get("ci", 0) + 30
            elif ext in (".css", ".scss", ".less", ".html"):
                scores["style"] = scores.get("style", 0) + 20

        added = self._count_lines(diff_text, "+")
        removed = self._count_lines(diff_text, "-")

        if added > 0 and removed == 0:
            scores["feat"] = scores.get("feat", 0) + 15
        elif removed > 0 and added > 0:
            if removed > added * 2:
                scores["refactor"] = scores.get("refactor", 0) + 15

        if not scores:
            return "chore"

        return max(scores, key=scores.get)

    def _determine_scope(self, files: List[str]) -> str:
        """Determine scope from affected files."""
        if not files:
            return ""

        scopes = set()
        for filepath in files:
            parts = filepath.split("/")
            if len(parts) > 1:
                scopes.add(parts[0])
            else:
                ext = self._get_extension(filepath)
                if ext in self.FILE_TYPE_MAP:
                    scopes.add(self.FILE_TYPE_MAP[ext])

        if len(scopes) == 1:
            return scopes.pop()
        elif len(scopes) <= 3:
            return ", ".join(sorted(scopes))
        return "multiple"

    def _generate_description(self, diff_text: str, files: List[str], change_type: str) -> str:
        """Generate a description based on the changes."""
        added = self._count_lines(diff_text, "+")
        removed = self._count_lines(diff_text, "-")

        if not files:
            return "update code"

        file_count = len(files)
        file_names = [f.split("/")[-1] for f in files[:3]]

        if change_type == "feat":
            if file_count == 1:
                return f"add functionality to {file_names[0]}"
            return f"add new feature ({file_count} files)"
        elif change_type == "fix":
            if file_count == 1:
                return f"fix issue in {file_names[0]}"
            return f"fix issues across {file_count} files"
        elif change_type == "docs":
            return f"update documentation ({file_count} files)"
        elif change_type == "test":
            return f"update tests ({file_count} files)"
        elif change_type == "refactor":
            return f"refactor code ({file_count} files)"
        elif change_type == "style":
            return f"format code ({file_count} files)"
        elif change_type == "perf":
            return f"improve performance ({file_count} files)"
        elif change_type == "ci":
            return f"update CI/CD ({file_count} files)"
        else:
            if file_count == 1:
                return f"update {file_names[0]}"
            return f"update {file_count} files"

    def _get_extension(self, filepath: str) -> str:
        """Get file extension."""
        if "." in filepath:
            return "." + filepath.rsplit(".", 1)[1].lower()
        return ""

    def format_commit_message(self, analysis: Dict, use_emoji: bool = False) -> str:
        """Format the analysis into a conventional commit message."""
        commit_type = analysis["type"]
        scope = analysis["scope"]
        description = analysis["description"]

        emoji_map = {
            "feat": "✨",
            "fix": "🐛",
            "docs": "📚",
            "style": "💎",
            "refactor": "♻️",
            "perf": "⚡",
            "test": "🧪",
            "chore": "🔧",
            "ci": "👷",
        }

        emoji = emoji_map.get(commit_type, "") + " " if use_emoji else ""

        if scope:
            message = f"{emoji}{commit_type}({scope}): {description}"
        else:
            message = f"{emoji}{commit_type}: {description}"

        return message
