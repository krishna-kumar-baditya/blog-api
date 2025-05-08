const mongoose = require('mongoose');

class DbConnect {
    async connection() {
        try {
            mongoose.connect(process.env.MOGO_URL);
            console.log("DB Connected Successfully!")
        }catch(err) {
            console.log(err);
        }
    }
}


module.exports = new DbConnect();