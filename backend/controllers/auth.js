const User = require('../models/User')
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcrypt');
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

    if(match){
      const userWithoutPassword = await User.findOne({email}).select('-password');
      res.status(200).json({msg:'User authenticated!', user: userWithoutPassword})
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
          return res.status(400).json({msg:'fullNam is required'}) 
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
