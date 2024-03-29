// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigDirName: ".",
      },
    },
  },
  {
    ignores: ["e2e/", "gradle.js", "babel.config.js", ".detoxrc.js", ".expo/"],
  },
);
