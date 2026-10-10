import fs from "node:fs";
const ru = fs.readFileSync("src/i18n/locales/ru.ts", "utf8");
const lead = ru.match(/"headlineLead": "([^"]+)"/)?.[1];
const label = ru.match(/"menu": \[[\s\S]*?"label": "([^"]+)"/)?.[1];
console.log("lead:", lead);
console.log("label:", label);
console.log("cyrillic:", /[\u0400-\u04FF]/.test(ru));
