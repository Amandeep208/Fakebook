var mongoose = require('mongoose');
const { dbLink } = require('../config');

 
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
        },
        profileLink: {
            type: String,
            default: null
        }
    },
    {
        versionKey: false,
    }
);

userSchema.index({username:1})

 
 
let users = mongoose.model('fakebookUsers', userSchema);
 
module.exports = users;