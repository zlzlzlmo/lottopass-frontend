module.exports = {
  root: true,
  extends: ['@lottopass/eslint-config', 'next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};