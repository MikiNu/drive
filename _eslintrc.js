module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue','promise','import'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'comma-dangle': [1, 'only-multiline'],
    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',
    'vue/component-name-in-template-casing': 'off',
  },
}
