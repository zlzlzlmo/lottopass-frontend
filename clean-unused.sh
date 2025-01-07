#!/bin/bash

# depcheck 실행
echo "Checking for unused dependencies..."
depcheck --json > unused-dependencies.json

# JSON 파일에서 사용되지 않는 dependencies와 devDependencies 추출
unused_dependencies=$(jq -r '.dependencies[]' unused-dependencies.json)
unused_dev_dependencies=$(jq -r '.devDependencies[]' unused-dependencies.json)

# 설치된 패키지 제거
echo "Removing unused dependencies..."
for pkg in $unused_dependencies; do
  echo "Removing $pkg..."
  npm uninstall "$pkg"
done

echo "Removing unused devDependencies..."
for pkg in $unused_dev_dependencies; do
  echo "Removing $pkg..."
  npm uninstall "$pkg" --save-dev
done

echo "Cleanup completed!"