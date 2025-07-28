module.exports = {
  root: true,
  extends: ['@lottopass/eslint-config', 'expo'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'react-native/no-inline-styles': 'warn',
  },
};