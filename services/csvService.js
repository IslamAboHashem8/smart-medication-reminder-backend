const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let medicinesCache = null;

function readCSV(csvPath) {
  return new Promise((resolve, reject) => {

    if (medicinesCache) {
      return resolve(medicinesCache);
    }

    const results = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => {
        medicinesCache = results;
        console.log(`Medicine cache loaded: ${results.length} medicines`);
        resolve(medicinesCache);
      })
      .on("error", reject);
  });
}

module.exports = { readCSV };