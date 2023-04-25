const { query } = require("../db");

class Marker {
    constructor() {

    };

    async getAllAttributes() {
        const exist = await query("SELECT * FROM markers;");
        return exist.length ? exist : false;
    };
};

module.exports = new Marker