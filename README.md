# Git Folder Manager

A lightweight VS Code extension for managing Git-tracked folders.

Git does not track empty directories. Git Folder Manager helps maintain folder structures by automatically creating and cleaning up `.gitkeep` files, and generating a basic `.gitignore` file.

## Features

### Add GitKeep Files

Scans the workspace and adds `.gitkeep` files to empty folders.

Before:

```text
project/
├── uploads/
├── logs/
└── cache/
```

After:

```text
project/
├── uploads/
│   └── .gitkeep
├── logs/
│   └── .gitkeep
└── cache/
    └── .gitkeep
```

### Remove Unused GitKeep Files

Removes `.gitkeep` files from folders that are no longer empty.

Before:

```text
uploads/
├── image.png
└── .gitkeep
```

After:

```text
uploads/
└── image.png
```

### Generate .gitignore

Creates a basic `.gitignore` file in the workspace root.

Generated content:

```gitignore
node_modules/
dist/
out/
build/
.env
```

## Commands

Open the Command Palette (`Ctrl+Shift+P`) and run:

* Git Folder Manager: Add GitKeep Files
* Git Folder Manager: Remove Unused GitKeep Files
* Git Folder Manager: Generate .gitignore

## Installation

Install from the Visual Studio Code Marketplace.

## Release Notes

### 1.0.0

* Add `.gitkeep` files to empty folders
* Remove unused `.gitkeep` files
* Generate `.gitignore`
