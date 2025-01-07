#!/bin/bash

# depcheck 실행
echo "Checking for unused dependencies..."
depcheck --specials=vite --json > unused-dependencies.json

# Node.js로 JSON 데이터 추출
unused_dependencies=$(node -e "console.log((require('./unused-dependencies.json').dependencies || []).join(' '))")
unused_dev_dependencies=$(node -e "console.log((require('./unused-dependencies.json').devDependencies || []).join(' '))")

# 사용되지 않는 dependencies 제거
if [ "$unused_dependencies" != "" ]; then
  echo "Removing unused dependencies..."
  for pkg in $unused_dependencies; do
    echo "Removing $pkg..."
    npm uninstall "$pkg" || echo "Failed to remove $pkg"
  done
else
  echo "No unused dependencies found."
fi

# 사용되지 않는 devDependencies 제거
if [ "$unused_dev_dependencies" != "" ]; then
  echo "Removing unused devDependencies..."
  for pkg in $unused_dev_dependencies; do
    echo "Removing $pkg..."
    npm uninstall "$pkg" --save-dev || echo "Failed to remove $pkg"
  done
else
  echo "No unused devDependencies found."
fi

# JSON 파일 삭제
rm -f unused-dependencies.json

echo "Cleanup completed!"
