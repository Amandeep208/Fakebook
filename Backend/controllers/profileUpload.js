// Import Cloudinary configuration
const { cloudinary } = require("../config");

// Import User model
const users = require("../model/user");

// Function to update user's profileLink in the database
const updateLink = async (username, profileLink) => {
    try {
        const updatedUser = await users.findOneAndUpdate(
            { username },                     // Find user by username
            { profileLink: profileLink }      // Set new profile link
        );
    } catch (err) {
        throw new Error("Failed to update profile link in the database");
        // Rethrow any errors to be handled by caller
    }
}

exports.profileUpload = async (req, res) => {
    try {
        // Check if a file was uploaded in the request
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded", // Respond with 400 if no file
            });
        }

        // Upload the file to Cloudinary
        cloudinary.uploader.upload(req.file.path, async (err, result) => {
            // Handle upload failure (e.g., network issues, invalid file, etc.)
            if (err || !result) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image to Cloudinary", // 500 server error
                });
            }

            // Retrieve username from session
            const username = req.session?.user?.username;
            if (!username) {
                // If user is not logged in or session expired
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Username not found in session", // 401 unauthorized
                });
            }

            try {
                // Save the uploaded image's secure URL to user's profile in DB
                await updateLink(username, result.secure_url);

                // Send back a success response with Cloudinary result data
                res.status(200).json({
                    success: true,
                    message: "Image uploaded successfully",
                    data: result, // Contains fields like secure_url, public_id, etc.
                });
            } catch (updateError) {
                // Handle DB update error
                res.status(500).json({
                    success: false,
                    message: updateError.message, // Specific error message
                });
            }
        });
    } catch (e) {
        // Catch unexpected exceptions (e.g., runtime issues)
        console.error("Unexpected error in profileUpload:", e);
        res.status(500).json({
            success: false,
            message: "Internal Server Error", // Generic fallback error
        });
    }
};

// API to remove profile image
// API to remove the user's profile image
exports.profileRemove = async (req, res) => {
    try {
        // Extract the username from the session
        const username = req.session?.user?.username;

        // If username is not found in session, return 401 Unauthorized
        if (!username) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Username not found in session",
            });
        }

        // Call helper function to update the user's profileLink to null
        // This effectively removes the profile image reference from the database
        await updateLink(username, null);

        // Send success response to the client
        res.status(200).json({
            success: true,
            message: "Profile image removed",
        });
    } catch (err) {
        // Catch and log any errors that occur during the process
        console.error("Error removing profile image:", err);

        // Send internal server error response
        res.status(500).json({
            success: false,
            message: "Failed to remove profile image",
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        // Retrieve the username from the session object using optional chaining
        const username = req.session?.user?.username;

        // If username is not present in session, return 401 Unauthorized
        if (!username) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Username not found in session",
            });
        }

        // Search for the user in the MongoDB collection using the username
        const data = await users.findOne({ username });

        // If no user is found, respond with 404 Not Found
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Return the user's profileLink (i.e., profile image URL)
        res.status(200).json({
            success: true,
            result: data.profileLink,
        });
    } catch (err) {
        // Log any unexpected errors during the database operation
        console.error("Error fetching user data:", err);

        // Respond with a 500 Internal Server Error
        res.status(500).json({
            success: false,
            message: "Failed to retrieve user data",
        });
    }
};
