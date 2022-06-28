const {
  addBabelPlugins,
  addBundleVisualizer,
  addDecoratorsLegacy,
  disableEsLint,
  getBabelLoader,
  override,
  removeModuleScopePlugin,
} = require('customize-cra');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

const pluginsBabel = [
  'babel-plugin-transform-typescript-metadata',
  'babel-plugin-parameter-decorator',
  ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: false }],
  'macros', // @lingui/macro
];

const babelDeduplicatePlugin = (pluginName) => (config) => {
  const babelLoaderOptions = getBabelLoader(config).options;
  let plugins = babelLoaderOptions.plugins;

  const isTargetPlugin = (plugin) => plugin[0] === pluginName;
  const firstIndex = plugins.findIndex(isTargetPlugin);
  if (firstIndex !== -1) {
    plugins = plugins.filter((plugin, i) => {
      return i <= firstIndex || !isTargetPlugin(plugin);
    });
  }

  babelLoaderOptions.plugins = plugins;
  return config;
};

const disableESLintWebpackPlugin = () => (config) => {
  config.plugins = config.plugins.filter((plugin) => {
    return !(plugin instanceof ESLintWebpackPlugin);
  });
  return config;
};

module.exports = {
  webpack: override(
    ...addBabelPlugins(...pluginsBabel),
    addBundleVisualizer({}, true),
    addDecoratorsLegacy(),
    babelDeduplicatePlugin('@babel/plugin-proposal-decorators'),
    disableEsLint(),
    disableESLintWebpackPlugin(),
    removeModuleScopePlugin(),
  ),
};
