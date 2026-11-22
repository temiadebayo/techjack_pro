import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nextConfigPath = require.resolve("eslint-config-next/package.json");
const nextRequire = createRequire(nextConfigPath);

const nextPlugin = nextRequire("@next/eslint-plugin-next");
const tsParser = nextRequire("@typescript-eslint/parser");
const tsPlugin = nextRequire("@typescript-eslint/eslint-plugin");
const reactPlugin = nextRequire("eslint-plugin-react");
const reactHooksPlugin = nextRequire("eslint-plugin-react-hooks");
const jsxA11yPlugin = nextRequire("eslint-plugin-jsx-a11y");

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "Tech_Jack_Antigravity_Handoff/**",
      "out/**",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default config;
