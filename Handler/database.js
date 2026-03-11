const fs = require('fs');
const path = require('path');

class Database {
  constructor(filename = 'database.json') {
    this.filePath = path.join(__dirname, '..', filename);
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const rawData = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(rawData);
      } else {
        const initialData = { usage: {} };
        fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2), 'utf-8');
        return initialData;
      }
    } catch (err) {
      console.error('Error loading database:', err);
      return { usage: {} };
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  incrementUsage(commandName) {
    if (!this.data.usage) this.data.usage = {};
    if (!this.data.usage[commandName]) this.data.usage[commandName] = 0;
    this.data.usage[commandName]++;
    this.save();
  }

  getUsage(commandName) {
    return this.data.usage?.[commandName] || 0;
  }
}

module.exports = new Database();