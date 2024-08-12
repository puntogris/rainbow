import fs from "fs";
import path from "path";
import tailwindColors from "./tailwind-colors";

function parseColors(input: string) {
  const lines = input.trim().split("\n");
  const result: { name: string; hex: string }[] = [];

  for (const line of lines) {
    const parts = line.split(":").map((part) => part.trim());

    if (parts.length !== 2) {
      continue;
    }

    const name = parts[0].replace(/^--/, "");
    const value = parts[1].replace(";", "");

    const colorObject = {
      name: name,
      hex: value,
    };

    result.push(colorObject);
  }

  return result;
}

function generateColorsFile() {
  const colorsArray = parseColors(tailwindColors);
  const outputPath = path.resolve(
    __dirname,
    "../src/data/tailwind-colors.json"
  );
  const outputDir = path.dirname(outputPath);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(colorsArray, null, 2));
}

generateColorsFile();
