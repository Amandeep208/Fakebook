var mongoose = require('mongoose');
const { dbLink } = require('../config');

// cont dbLink = dbLink1; // Use dbLink1 for local MongoDB or dbLink2 for MongoDB Atlas
 
mongoose.connect(`${dbLink}rStar`).then((e) => {
    console.log("It is successfully connected");
});
 
let userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,            
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        }
    },
    {
        versionKey: false,
    }
);
 
 
 
let users = mongoose.model('fakebookUsers', userSchema);
 
module.exports = users;