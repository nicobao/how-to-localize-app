"use strict";

const fs = require("fs");
const path = require("path");
const { argv } = require("process");

if (argv.length != 3) {
  console.error(
    "This script takes exactly one argument: `node checkDevEnUsMatch.js <path_to_locales_directory>"
  );
  process.exit(1);
}

let directoryToCheck = argv[2];
// remove trailing slash
if (directoryToCheck.endsWith("/")) {
  directoryToCheck = directoryToCheck.slice(0, -1);
}

console.log(
  `Recursively validating that all JSON files in the '${directoryToCheck}/dev' directory also exists in '${directoryToCheck}/en-US'...`
);

// see https://stackoverflow.com/a/66083078/11046178
function* walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      if (file.name.split(".").pop() === "json") {
        yield path.join(dir, file.name);
      } else {
        continue;
      }
    }
  }
}

// for each files in locales/dev directory, check that the same filename exsit in locales/en-US
for (const filePath of walkSync(`${directoryToCheck}/dev`)) {
  const enUSPath = `${directoryToCheck}/en-US/${path.basename(filePath)}`;
  if (!fs.existsSync(enUSPath)) {
    console.log(`Failure! '${filePath}' does not exist in '${enUSPath}'`);
    return 1;
  }
}
console.log(`Success! Every JSON files in 'dev/' also exist in 'en-US/'.`);
return 0;
