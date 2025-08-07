module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:react/recommended', 'prettier'],
  plugins: ['react', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off' // Turn off the rule if using React 17+
  },
  settings: {
    react: {
      version: 'detect' // Automatically detect the React version
    }
  }
};
