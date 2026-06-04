"""Commit message templates and formatting utilities."""

from typing import Dict, List


TEMPLATES = {
    "feat": [
        "add {feature} to {scope}",
        "implement {feature}",
        "introduce {feature} support",
        "add new {scope} functionality",
    ],
    "fix": [
        "fix {issue} in {scope}",
        "resolve {issue} issue",
        "correct {issue} behavior",
        "patch {scope} bug",
    ],
    "docs": [
        "update {scope} documentation",
        "add {doc_type} documentation",
        "improve {scope} docs",
        "document {feature}",
    ],
    "refactor": [
        "refactor {scope} for better {aspect}",
        "restructure {scope} code",
        "improve {scope} code organization",
        "clean up {scope} implementation",
    ],
    "test": [
        "add tests for {scope}",
        "update {scope} test suite",
        "improve test coverage for {scope}",
        "fix {scope} tests",
    ],
    "chore": [
        "update {scope} dependencies",
        "configure {scope} settings",
        "maintain {scope} codebase",
        "update {scope} configuration",
    ],
    "ci": [
        "update CI pipeline for {scope}",
        "add {ci_feature} to workflow",
        "configure {ci_tool} for {scope}",
        "improve CI/CD process",
    ],
    "style": [
        "format {scope} code",
        "fix {scope} linting issues",
        "update {scope} code style",
        "apply consistent formatting to {scope}",
    ],
    "perf": [
        "optimize {scope} performance",
        "improve {scope} speed",
        "reduce {scope} memory usage",
        "optimize {aspect} in {scope}",
    ],
}


def get_template(commit_type: str, context: Dict = None) -> str:
    """Get a template for the given commit type."""
    if commit_type not in TEMPLATES:
        return TEMPLATES["chore"][0]

    templates = TEMPLATES[commit_type]
    if context:
        try:
            return templates[0].format(**context)
        except (KeyError, IndexError):
            pass
    return templates[0]


def get_all_templates(commit_type: str) -> List[str]:
    """Get all templates for a commit type."""
    return TEMPLATES.get(commit_type, TEMPLATES["chore"])


EXAMPLE_MESSAGES = {
    "feat": [
        "feat: add user authentication",
        "feat(auth): implement JWT token validation",
        "feat(ui): add dark mode support",
    ],
    "fix": [
        "fix: resolve memory leak in worker",
        "fix(api): handle null response from server",
        "fix(auth): correct token expiration check",
    ],
    "docs": [
        "docs: update README installation steps",
        "docs(api): add endpoint documentation",
        "docs: add contributing guidelines",
    ],
    "refactor": [
        "refactor: extract validation logic",
        "refactor(core): simplify error handling",
        "refactor: improve code modularity",
    ],
    "test": [
        "test: add unit tests for user service",
        "test(auth): add integration tests",
        "test: improve test coverage",
    ],
}


def show_examples(commit_type: str = None) -> str:
    """Show example commit messages."""
    output = []
    if commit_type:
        examples = EXAMPLE_MESSAGES.get(commit_type, [])
        output.append(f"\nExamples for '{commit_type}':")
        for ex in examples:
            output.append(f"  - {ex}")
    else:
        for ctype, examples in EXAMPLE_MESSAGES.items():
            output.append(f"\n{ctype}:")
            for ex in examples[:2]:
                output.append(f"  - {ex}")
    return "\n".join(output)
