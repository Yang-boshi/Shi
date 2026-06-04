from setuptools import setup, find_packages

setup(
    name="seo-checker",
    version="1.0.0",
    description="A CLI tool to audit web pages for SEO issues",
    author="SEO Checker Team",
    packages=find_packages(),
    install_requires=[
        "requests>=2.28.0",
        "beautifulsoup4>=4.11.0",
        "lxml>=4.9.0",
    ],
    entry_points={
        "console_scripts": [
            "seo-check=seo_checker.main:main",
        ],
    },
    python_requires=">=3.8",
)
