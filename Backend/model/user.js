var mongoose = require('mongoose');
 
mongoose.connect('mongodb://localhost:27017/rStar').then((e) => {
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