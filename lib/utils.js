
const path = require('path');
const confit = require('confit');
const configDir = path.join(__dirname, 'config');
let confitDir = confit(configDir);

class Utils {

    getConfig() {
        // confit(basedir).create(function (err, config) {
        //     config.get('env:env'); // 'development'
        //     this.envConfig = config;
        // });
        Q.nbind(confitDir, 'create').then((err, config) => {
            this.config = config;
        })
    }

    getDatabaseName(dbName) {
        Q(this.getConfig()).then()
        const db = this.config.get(dbName);
        return db;
    }
}

module.exports = Utils;
