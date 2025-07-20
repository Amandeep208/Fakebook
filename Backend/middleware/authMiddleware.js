const multer = require('multer');
const path = require('path');

// Middleware to check if the user is authenticated (i.e., logged in)
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // Proceed to the next middleware/route handler
    next();
  } else {
    // If no user is found in session, redirect to login/home page
    res.redirect("/");
  }
}

// Multer storage configuration
const storage = multer.diskStorage({

  // Callback to define filename for uploaded file
  filename: function (req, file, cb) {
    try {
      // Extract file extension (e.g., .jpg, .png)
      const ext = path.extname(file.originalname);

      // Get the logged-in user's username from the session
      const username = req.session?.user?.username;

      if (!username) {
        // If username is missing in session, return error via callback
        return cb(new Error("Username not found in session"), false);
      }

      // Set the filename as: <username>.<extension>
      cb(null, `${username}${ext}`);
    } catch (err) {
      // Catch any unexpected error and pass it to multer callback
      cb(err, false);
    }
  }
});

// Export multer upload instance with configured storage
exports.upload = multer({ storage });
