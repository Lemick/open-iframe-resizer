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
  npm --workspace=packages/react pkg set "dependencies.@open-iframe-resizer/core=$1"
  cd "$REACT_PACKAGE_DIR" || exit
  npm version "$NEW_VERSION" --no-git-tag-version
)

npm install

echo "All versions updated successfully!"
