#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

NEW_VERSION=$1
CORE_PACKAGE_DIR="./packages/core"
REACT_PACKAGE_DIR="./packages/react"
VUE_PACKAGE_DIR="./packages/vue"
ANGULAR_PACKAGE_DIR="./packages/angular/projects/lib"

safe_sed() {
  local search="$1"
  local replace="$2"
  shift 2
  local files=("$@")

  for f in "${files[@]}"; do
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "s|${search}|${replace}|g" "$f"
    else
      sed -i "s|${search}|${replace}|g" "$f"
    fi
  done
}

echo "Updating core package version to $NEW_VERSION..."
(
  cd "$CORE_PACKAGE_DIR" || exit
  npm version "$NEW_VERSION" --no-git-tag-version
)

echo "Updating react package and its dependency version to $NEW_VERSION..."
(
  npm --workspace=packages/react pkg set "dependencies.@open-iframe-resizer/core=$NEW_VERSION"
  cd "$REACT_PACKAGE_DIR" || exit
  npm version "$NEW_VERSION" --no-git-tag-version
)

echo "Updating vue package and its dependency version to $NEW_VERSION..."
(
  npm --workspace=packages/vue pkg set "dependencies.@open-iframe-resizer/core=$NEW_VERSION"
  cd "$VUE_PACKAGE_DIR" || exit
  npm version "$NEW_VERSION" --no-git-tag-version
)

echo "Updating angular package and its dependency version to $NEW_VERSION..."
(
  npm --workspace=packages/angular pkg set "dependencies.@open-iframe-resizer/core=$NEW_VERSION"
  cd "$ANGULAR_PACKAGE_DIR" || exit
  npm pkg set "dependencies.@open-iframe-resizer/core=$NEW_VERSION"
  npm version "$NEW_VERSION" --no-git-tag-version
)

npm install

echo "All versions updated successfully!"

git fetch --tags
OLD_VERSION=$(git describe --tags "$(git rev-list --tags --max-count=1)")
OLD_VERSION="${OLD_VERSION#v}"

safe_sed "@v${OLD_VERSION}" "@v${NEW_VERSION}" "README.md"

mapfile -t mdx_files < <(find website -type f -name "*.mdx")
safe_sed "@v${OLD_VERSION}" "@v${NEW_VERSION}" "${mdx_files[@]}"

echo "Updated version references in markdown files"
