const fs = require('fs');
const path = require('path');

class JSONDatabase {
    constructor(dbPath) {
        this.dbPath = path.resolve(dbPath);
        this.data = {};
        this._init();
    }

    _init() {
        if (!fs.existsSync(this.dbPath)) {
            const dir = path.dirname(this.dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.dbPath, JSON.stringify({}, null, 4));
        } else {
            try {
                this.data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
            } catch (e) {
                console.error(`Error reading database file at ${this.dbPath}`, e);
                this.data = {};
            }
        }
    }

    _save() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 4));
    }

    get(key, defaultValue = undefined) {
        const keys = key.split('.');
        let result = this.data;
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return defaultValue;
            }
        }
        return result;
    }

    set(key, value) {
        const keys = key.split('.');
        let current = this.data;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in current) || typeof current[k] !== 'object') {
                current[k] = {};
            }
            current = current[k];
        }
        current[keys[keys.length - 1]] = value;
        this._save();
    }

    add(key, amount) {
        const currentVal = this.get(key, 0);
        if (typeof currentVal === 'number' && typeof amount === 'number') {
            this.set(key, currentVal + amount);
        } else {
            throw new Error(`Cannot add to non-number value at key: ${key}`);
        }
    }

    delete(key) {
        const keys = key.split('.');
        let current = this.data;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in current) || typeof current[k] !== 'object') {
                return false;
            }
            current = current[k];
        }

        const lastKey = keys[keys.length - 1];
        if (lastKey in current) {
            delete current[lastKey];
            this._save();
            return true;
        }
        return false;
    }
}

module.exports = JSONDatabase;