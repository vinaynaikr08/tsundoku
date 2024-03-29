// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["e2e/", "gradle.js", "babel.config.js", ".detoxrc.js", ".expo/"],
  },
);
