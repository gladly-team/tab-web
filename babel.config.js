module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'relay',
      {
        artifactDirectory: './src/relay/__generated__',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          src: './src',
        },
      },
    ],
  ],
}
