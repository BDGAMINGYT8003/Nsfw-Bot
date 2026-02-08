const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = {
  get: (key) => {
    const data = readDB();
    return key ? data[key] : data;
  },
  set: (key, value) => {
    const data = readDB();
    data[key] = value;
    writeDB(data);
  },
  delete: (key) => {
    const data = readDB();
    delete data[key];
    writeDB(data);
  }
};
