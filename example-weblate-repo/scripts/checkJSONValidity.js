"use strict";

const fs = require("fs");
const path = require("path");
const { argv } = require("process");

if (argv.length != 3) {
  console.error(
    "This script takes exactly one argument: `node checkJSONValidity.js <path_to_directory>"
  );
  process.exit(1);
}

console.log(
  `Recursively validating JSON files in the '${argv[2]}' directory...`
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

// for each files in locales directory, check json validity
for (const filePath of walkSync(`${argv[2]}`)) {
  try {
    let rawdata = fs.readFileSync(filePath);
    JSON.parse(rawdata);
  } catch (e) {
    console.error(`Error while parsing json file '${filePath}'`, e);
    return 1;
  }
}
console.log(`Success! Every JSON files are valid.`);
return 0;
