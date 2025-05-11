const User = require("../models/User");

exports.register = async (req, res) => {
    const { phone, name } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) {
        return res.status(400).json({ message: "Phone Number Already Register, Try Another Number" })
    } else {
        const user = new User({ phone, name });
        await user.save();
        res.status(200).json({ message: "Register Succesfully" })
    }

}


exports.login = async(req, res)=>{
  const {phone} = req.body;
  const user = await User.findOne({phone});
  if(!user){
    res.status(404).json({
        message:"User Not Found, Please Register"
    })
  }else{
    res.status(200).json({
        message:"Login Successfull",
        userId: user._id 
    })
  }
}

exports.getOnlineUsers = async(req,res)=>{
 const users = await User.find();
 res.json(users)
}