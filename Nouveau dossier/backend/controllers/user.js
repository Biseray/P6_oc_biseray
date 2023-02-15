const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verif = require('../lib/password');
require('dotenv').config();
const User = require('../models/user');
// require('../lib/password');

// const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// const notEmpty = (value) => {
//   if (value.trim().length === 0) {
//       return false;
//   };
//   return true;
// };

// const verification = (password) => {
// if (notEmpty(password.value) && regexPassword.test(password.value)) {
//   return true; 
//  } else {
//      return false;  // .json({message: 'veuillez mettre un mot de passe '})
//   };
  
// } 
exports.signup = (req, res, next) => {
    // if ((req.body.password.trim().length === 0) && (req.body.email.trim().length) && (regexPassword.test(req.body.password))) {
      
    
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
    
      .catch(error => res.status(500).json({ error }));
    // } 
    // else {
    //   return json({message:'mots  de passe leger'})
    // }
  };



  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                          { userId: user._id},
                          (process.env.TOKEN), // mettre dans dot.env
                          
                          {expiresIn: '24h'}  
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };

//  exports.signup = (req, res, next) => {
//   verification(req.body.password);
//     bcrypt.hash(req.body.password, 10)
//       .then(hash => {
//         const user = new User({
//           email: req.body.email,
//           password: hash
//         });
//         user.save()
//           .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
//           .catch(error => res.status(400).json({ error }));
//       })
//       .catch(error => res.status(500).json({ error }));
//   };