const { cloudinary } = require("../config");
const { upload } = require("../middleware/authMiddleware");
const users = require("../model/user");



const updateLink = async(username, profileLink) => {
    try{
        const updatedUser = await users.findOneAndUpdate(
            {username},
            {profileLink: profileLink}
        )
    } catch (err){
        throw err;
    }

}




exports.profileUpload = async (req, res) => {
    cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error"
            })
        }
        const username = req.session.user.username

        updateLink(username, result.secure_url)
        



        res.status(200).json({
            success: true,
            message: "Up-loaded",
            data: result,
        })
    })
}

exports.profileRemove = async (req, res) => {
    try{
        const username = req.session.user.username
        updateLink(username, null)
        res.send({success:true})

    } catch{
        res.send({success: false})
    }
}

exports.getUser = async (req,res)=> {
    try{
        const username = req.session.user.username
        const data = await users.findOne({
            username: username
        })
        res.status(200).json({
            success: true,
            result: data.profileLink
        })
    }
    catch{
        res.status(500).json({
            success: false
        })
    }
}