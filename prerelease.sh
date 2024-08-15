#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

NEW_VERSION=$1
CORE_PACKAGE_DIR="./packages/core"
REACT_PACKAGE_DIR="./packages/react"

echo "Updating core package version to $NEW_VERSION..."
(
  cd "$CORE_PACKAGE_DIR" || exit
  npm version "$NEW_VERSION" --no-git-tag-version
)

echo "Updating react package and its dependency version to $NEW_VERSION..."
(
  npm install @open-iframe-resizer/core --workspace=packages/react --save-exact
  cd "$REACT_PACKAGE_DIR" || exit
  npm version "$NEW_VERSION" --no-git-tag-version
)

echo "All versions updated successfully!"
