module.exports = {
  env: {
    test: {
      plugins: [
        'babel-plugin-transform-typescript-metadata',
        'babel-plugin-parameter-decorator',
        ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: false }],
        'macros', // @lingui/macro
      ],
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    },
  },
};
