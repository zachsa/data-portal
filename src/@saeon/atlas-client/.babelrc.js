const { NODE_ENV = 'production' } = process.env

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        debug: NODE_ENV === 'production' ? false : true,
        useBuiltIns: 'entry',
        corejs: { version: 3, proposals: true },
      },
    ],
  ],
}
