from setuptools import setup, find_packages

setup(
    name="terminal-dashboard",
    version="1.0.0",
    description="Terminal-based system monitoring dashboard",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="Developer",
    license="MIT",
    packages=find_packages(),
    install_requires=[
        "rich>=13.0.0",
        "psutil>=5.9.0",
    ],
    entry_points={
        "console_scripts": [
            "sysmon=sysmon.main:main",
        ],
    },
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: System Administrators",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Topic :: System :: Monitoring",
    ],
)
