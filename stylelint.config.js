module.exports = {
  extends: 'stylelint-config-standard',
  ignoreFiles: ['**/build/*.css'],
  plugins: [
    'stylelint-order',
    'stylelint-scss',
  ],
  rules: {
    'at-rule-no-vendor-prefix': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'each', //
          'extend',
          'for',
          'function',
          'if',
          'include',
          'mixin',
          'return',
          'use',
        ],
      },
    ],
    'declaration-colon-newline-after': null,
    'declaration-empty-line-before': null,
    indentation: null,
    'media-feature-name-no-vendor-prefix': true,
    'no-descending-specificity': null,
    'order/order': [
      {
        type: 'at-rule',
        name: 'extend',
        hasBlock: false,
      },
      {
        type: 'at-rule',
        name: 'include',
        hasBlock: false,
      },
      'dollar-variables',
      'at-variables',
      'less-mixins',
      'custom-properties',
      'declarations',
      'rules',
      'at-rules',
    ],
    'order/properties-alphabetical-order': null,
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          'global', //
          'local',
        ],
      },
    ],
    'value-no-vendor-prefix': true,
  },
};
