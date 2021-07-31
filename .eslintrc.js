module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": "off",
    "require-jsdoc": "off",
    "linebreak-style": "off",
    "object-curly-spacing": "off",
    "no-mixed-spaces-and-tabs": "off",
    "space-before-blocks": "off",
    "indent": "off",
    "eol-last": "off",
    "semi": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "keyword-spacing": "on",
    "spaced-comment": "off",
    "comma-dangle": "off",
    "arrow-parens": "off",
    "brace-style": "off",
    "max-len": "off",
    "no-multi-spaces": "off",
    "no-trailing-spaces": "off",
    "padded-blocks": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-multiple-empty-lines": "off"
  },
};