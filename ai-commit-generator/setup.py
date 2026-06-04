from setuptools import setup, find_packages

setup(
    name="ai-commit-generator",
    version="1.0.0",
    description="AI-powered commit message generator from git diff",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="Developer",
    license="MIT",
    packages=find_packages(),
    install_requires=[
        "colorama>=0.4.6",
    ],
    entry_points={
        "console_scripts": [
            "ai-commit=commit_generator.main:main",
        ],
    },
    python_requires=">=3.7",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Topic :: Software Development :: Version Control :: Git",
    ],
)
