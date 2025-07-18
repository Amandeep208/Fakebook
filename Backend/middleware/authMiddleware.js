const multer = require('multer')
const path = require('path');


exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}


// const storage = multer.memoryStorage();

// const fileFilter = (req, file,cb)=> {
//   const alloedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
//   if(alloedTypes.includes(file.mimetype))
//     cb(null,true);
// }


// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname); // e.g., .jpg, .png
//     const username = req.session.user.username; // adjust this based on your auth/session setup
//     cb(null, `${username}${ext}`);
//   }
// })




const storage = multer.diskStorage({


  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // e.g., .jpg, .png
    const username = req.session.user.username; // adjust this based on your auth/session setup
    console.log(`${username}${ext}`)
    cb(null, `${username}${ext}`)

  }
}


)

exports.upload = multer({ storage })