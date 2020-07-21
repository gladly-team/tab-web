module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'relay',
      {
        artifactDirectory: './src/relay/__generated__',
      },
    ],
    // Even though Next.js has built-in absolute imports, we need
    // this for imports in Jest tests.
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
