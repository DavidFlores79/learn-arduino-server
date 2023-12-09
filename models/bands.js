const Band = require("./band");


class Bands {

    constructor() {
        this.bands = [];
    }

    addBand( band = new Band()) {
        this.bands.push(band);
    }

    getBands() {
        return this.bands;
    }

    removeBand(id= '') {
        this.bands = this.bands.filter(band => band.id != id);
    }

    voteBand(id = '') {
        this.bands = this.bands.map(band => {
            if(band.id == id) {
                band.votes++;
                return band;
            }
            return band;
        });
    }


}

module.exports = Bands;