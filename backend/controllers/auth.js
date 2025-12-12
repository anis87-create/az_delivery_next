const User = require('../models/User')
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.generateToken = (id) => {
  return jwt.sign( { id}, process.env.SECRET_TOKEN , { expiresIn: '30d' })
}
module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if(!email){
      return res.status(400).json({msg: 'the email is required!'})
    }
    if(!password){
      return res.status(400).json({msg:'the password is required!'})
    }
    let user = await User.findOne({email});
    if(!user){
      return res.status(404).json({msg:'invalid credentiels!'})
    }
    const match = await bcrypt.compare(password, user.password);
    const token = module.exports.generateToken(user._id);
    console.log(token);

    if(match){
      const userWithoutPassword = await User.findOne({email}).select('-password');
      res.status(200).json({
        msg:'User authenticated!', 
        user: userWithoutPassword,
        token: this.generateToken(user._id)
      })
    }else {
      res.status(400).json({msg:'Authentication failed!'})
    }
}

module.exports.register = async (req, res, next) => {
    try {
      const { fullName, email, password, name, category } = req.body;
      let emailFound = await User.findOne({email});
      if(emailFound){
        return res.status(409).json({msg:'the user already exist!'})
      }else {
        if(!password){
            return res.status(400).json({msg:'password not found!'})
        }
        const saltRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);

        if(!email){
          return res.status(400).json({msg:'email is required'})
        }

        if(!fullName){
          return res.status(400).json({msg:'fullName is required'}) 
        }

        let user = new User({
          ...req.body,
          password: hashedPassword
        });
          
        
        if(req.body.role === 'customer'){
          await user.save();
          res.status(201).json({msg:'customer saved!',user})
        }else if(req.body.role === 'restaurant_owner') {
          await user.save();
          if(!name){
            return res.status(400).json({msg:'restaurant name is required'})
          }
          if(!category){
            return res.status(400).json({msg:'category of restaurant  is required'})
          }
          const restaurant = new Restaurant({
            ...req.body,
            owner: user.id
          });
          await restaurant.save();
          res.status(201).json({msg:'restaurant saved!', restaurant})
          } 
        }
    } catch (error) {
      res.status(500).json({error});
    }
  
}

module.exports.authMe = async (req, res, next) => {  
 try {
    const { _id, fullName, email } = await User.findById(req.user._id);
    if(req.user.role === 'customer'){
      res.status(200).json({_id, fullName, email});
    }else {
      const restaurant = await Restaurant.findOne({owner: req.user._id});
      res.status(200).json({_id, fullName, email, restaurant});
    }
    
    
 } catch (error) {
    res.status(500).json({error})
 }
}
