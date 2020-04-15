module.exports = {
  presets: ['next/babel', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-runtime',
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
