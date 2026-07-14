import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import ununsedImports from "eslint-plugin-unused-imports";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "unused-imports": ununsedImports,
      prettier,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      ...reactHooks.configs.recommended.rules,

      "react/react-in-jsx-scope": "off",

      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],

      "unused-imports/no-unused-imports": "error",

      "prettier/prettier": "error",
    },
  },

  eslintConfigPrettier,
);
