module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'relay',
      {
        artifactDirectory: './src/relay/__generated__',
      },
    ],
  ],
}
