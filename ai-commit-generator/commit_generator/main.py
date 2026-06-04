"""CLI entry point for AI Commit Message Generator."""

import subprocess
import sys
import argparse
from typing import Optional

from colorama import init, Fore, Style, Back

from .analyzer import DiffAnalyzer
from .templates import show_examples

init(autoreset=True)

BANNER = f"""
{Fore.CYAN}{Style.BRIGHT}╔══════════════════════════════════════════════╗
║     AI Commit Message Generator v1.0.0       ║
╚══════════════════════════════════════════════╝{Style.RESET_ALL}
"""


def get_git_diff(staged: bool = True) -> Optional[str]:
    """Get git diff from current repository."""
    try:
        cmd = ["git", "diff", "--cached"] if staged else ["git", "diff"]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError:
        return None
    except FileNotFoundError:
        print(f"{Fore.RED}Error: git is not installed or not in PATH{Style.RESET_ALL}")
        sys.exit(1)


def is_git_repo() -> bool:
    """Check if current directory is a git repository."""
    try:
        subprocess.run(["git", "rev-parse", "--git-dir"],
                      capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def colorize_commit_type(commit_type: str) -> str:
    """Apply color to commit type."""
    colors = {
        "feat": Fore.GREEN,
        "fix": Fore.RED,
        "docs": Fore.BLUE,
        "style": Fore.MAGENTA,
        "refactor": Fore.YELLOW,
        "perf": Fore.CYAN,
        "test": Fore.WHITE,
        "chore": Fore.YELLOW,
        "ci": Fore.BLUE,
    }
    color = colors.get(commit_type, Fore.WHITE)
    return f"{color}{Style.BRIGHT}{commit_type}{Style.RESET_ALL}"


def display_analysis(analysis: dict, message: str):
    """Display the analysis results with colors."""
    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'='*50}{Style.RESET_ALL}")
    print(f"{Fore.WHITE}{Style.BRIGHT}Diff Analysis:{Style.RESET_ALL}")
    print(f"  Files changed: {Fore.YELLOW}{len(analysis['files'])}{Style.RESET_ALL}")
    print(f"  Lines added:   {Fore.GREEN}+{analysis['added']}{Style.RESET_ALL}")
    print(f"  Lines removed: {Fore.RED}-{analysis['removed']}{Style.RESET_ALL}")

    if analysis['files']:
        print(f"\n{Fore.WHITE}Affected files:{Style.RESET_ALL}")
        for f in analysis['files'][:5]:
            print(f"  • {f}")
        if len(analysis['files']) > 5:
            print(f"  ... and {len(analysis['files']) - 5} more")

    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'='*50}{Style.RESET_ALL}")
    print(f"{Fore.WHITE}{Style.BRIGHT}Generated Commit Message:{Style.RESET_ALL}")
    print(f"\n  {colorize_commit_type(analysis['type'])}{Fore.WHITE}: {analysis['description']}{Style.RESET_ALL}")
    print(f"\n{Fore.GREEN}{Style.BRIGHT}Full message:{Style.RESET_ALL}")
    print(f"  {Fore.GREEN}{message}{Style.RESET_ALL}")
    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'='*50}{Style.RESET_ALL}")


def copy_to_clipboard(text: str) -> bool:
    """Try to copy text to clipboard."""
    try:
        import pyperclip
        pyperclip.copy(text)
        return True
    except ImportError:
        pass

    try:
        subprocess.run(["xclip", "-selection", "clipboard"],
                      input=text.encode(), check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    try:
        subprocess.run(["pbcopy"], input=text.encode(), check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    return False


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Generate conventional commit messages from git diff",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=show_examples()
    )
    parser.add_argument(
        "--staged", "-s",
        action="store_true",
        default=True,
        help="Use staged changes (default)"
    )
    parser.add_argument(
        "--unstaged", "-u",
        action="store_true",
        help="Use unstaged changes"
    )
    parser.add_argument(
        "--emoji", "-e",
        action="store_true",
        help="Include emoji in commit type"
    )
    parser.add_argument(
        "--copy", "-c",
        action="store_true",
        help="Copy message to clipboard"
    )
    parser.add_argument(
        "--examples",
        action="store_true",
        help="Show example commit messages"
    )
    parser.add_argument(
        "--type", "-t",
        help="Specify commit type manually"
    )

    args = parser.parse_args()

    if args.examples:
        print(show_examples())
        return

    print(BANNER)

    if not is_git_repo():
        print(f"{Fore.RED}Error: Not a git repository{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Initialize a git repo with: git init{Style.RESET_ALL}")
        sys.exit(1)

    staged = not args.unstaged
    diff = get_git_diff(staged=staged)

    if not diff:
        print(f"{Fore.YELLOW}No {'staged' if staged else 'unstaged'} changes found.{Style.RESET_ALL}")
        print(f"{Fore.WHITE}Stage changes with: git add <files>{Style.RESET_ALL}")
        sys.exit(0)

    analyzer = DiffAnalyzer()
    analysis = analyzer.analyze_diff(diff)

    if args.type:
        analysis["type"] = args.type

    message = analyzer.format_commit_message(analysis, use_emoji=args.emoji)
    display_analysis(analysis, message)

    if args.copy:
        if copy_to_clipboard(message):
            print(f"\n{Fore.GREEN}✓ Message copied to clipboard!{Style.RESET_ALL}")
        else:
            print(f"\n{Fore.YELLOW}Could not copy to clipboard. Message is shown above.{Style.RESET_ALL}")

    print(f"\n{Fore.WHITE}To use this message:{Style.RESET_ALL}")
    print(f"  git commit -m \"{message}\"")
    print()


if __name__ == "__main__":
    main()
