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
  `For each filename in the '${directoryToCheck}/dev', create an empty JSON file with the same name in '${directoryToCheck}/en-US' if the file doesn't exist yet...`
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

// for each files in locales directory, create one in en-US if there is none
for (const filePath of walkSync(`${directoryToCheck}/dev`)) {
  const enUSPath = `${directoryToCheck}/en-US/${path.basename(filePath)}`;
  if (!fs.existsSync(enUSPath)) {
    fs.writeFile(enUSPath, JSON.stringify({}), (err) => {
      if (err) {
        console.error(`Error while trying to create '${enUSPath}'`, err);
        return;
      }
      console.log(`'${enUSPath}' has been created`);
    });
  }
}
return 0;
