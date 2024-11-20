const multer = require("multer")


 const upload = multer({
    storage : multer.diskStorage({
        destination :  function(req, file, cb){
            cb(null, "./public/uploads")
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        filename : function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }

    })
}).single("user_file")


module.exports = upload