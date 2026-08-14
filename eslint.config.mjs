import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // next-env.d.ts é gerado pelo Next e não deve ser lintado.
    ignores: [
      ".next/**",
      ".next-tooling/**",
      "out/**",
      "node_modules/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
