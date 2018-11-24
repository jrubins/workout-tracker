module.exports = {
  env: {
    test: {
      presets: [
        '@babel/react',
        [
          '@babel/env',
          {
            targets: {
              node: true,
            },
          },
        ],
      ],
    },
  },
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    'lodash',
    'react-hot-loader/babel',
  ],
  presets: [
    '@babel/react',
    [
      '@babel/env',
      {
        modules: false,
        targets: 'last 2 versions',
        useBuiltIns: 'usage',
      },
    ],
  ],
}
