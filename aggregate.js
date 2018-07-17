/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */

const fs = require('fs');
const continents = require('./data/country-continent.json');

const RowCreate = function () {
  return new Promise((resolve) => {
    fs.readFile('./data/datafile.csv', 'utf8', (err, data) => {
      if (err) {
        throw err;
      } else {
        const rows = data.split('\n');
        for (let i = 0; i < rows.length; i += 1) {
          rows[i] = rows[i].replace(/"/g, '');
          rows[i] = rows[i].split(',');
        }
        resolve(rows);
      }
    });
  });
};

const aggregate = () => new Promise((resolve) => {
  RowCreate().then((values) => {
    const rows = values;
    const headers = rows[0];
    const POPULATION_2012 = headers.indexOf('Population (Millions) - 2012');
    const GDP_2012 = headers.indexOf('GDP Billions (US Dollar) - 2012');
    const country = headers.indexOf('Country Name');
    const json = {};
    for (let i = 1; i < rows.length - 2; i += 1) {
      if (json[continents[rows[i][country]]] === undefined) {
        json[continents[rows[i][country]]] = {};
        json[continents[rows[i][country]]].GDP_2012 = parseFloat(rows[i][GDP_2012]);
        json[continents[rows[i][country]]].POPULATION_2012 = parseFloat(rows[i][POPULATION_2012]);
      } else {
        json[continents[rows[i][country]]].GDP_2012 += parseFloat(rows[i][GDP_2012]);
        const x = parseFloat(rows[i][POPULATION_2012]);
        json[continents[rows[i][country]]].POPULATION_2012 += x;
      }
    }
    fs.writeFile('./output/output.json', JSON.stringify(json), 'utf8', (data) => {
      resolve(data);
    });
  });
});

module.exports = aggregate;
