const User = require('../models/User')
const Restaurant = require('../models/Restaurant');
exports.login = (req, res, next) => {
    res.send({message: 'auth ok'})
}

module.exports.register = async (req, res, next) => {

    try {
      delete req.body._id;
      const user = new User({
        ...req.body
      });

      await user.save();  
      if(req.body.role==='restaurant_owner'){
        
      }
      
      res.status(201).json({msg:'user saved!'})
    } catch (error) {
      res.status(400).json({error});
    }
  
}