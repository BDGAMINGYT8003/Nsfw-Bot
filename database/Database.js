const fs = require('fs');
const path = require('path');

class Database {
    constructor(filename = 'db.json') {
        this.filepath = path.join(__dirname, filename);
        if (!fs.existsSync(this.filepath)) {
            fs.writeFileSync(this.filepath, JSON.stringify({}, null, 4));
        }
    }

    read() {
        const data = fs.readFileSync(this.filepath, 'utf8');
        return JSON.parse(data);
    }

    write(data) {
        fs.writeFileSync(this.filepath, JSON.stringify(data, null, 4));
    }

    get(key) {
        const data = this.read();
        return data[key];
    }

    set(key, value) {
        const data = this.read();
        data[key] = value;
        this.write(data);
    }

    delete(key) {
        const data = this.read();
        delete data[key];
        this.write(data);
    }

    getGuildColor(guildId, defaultColor = '#2b2d31') {
        return this.get(`guild_${guildId}_color`) || defaultColor;
    }
}

module.exports = new Database();
