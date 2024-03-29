const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const User = require('../models/user');

exports.signup = (req, res, next) => {
  const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  
  if (!regexPassword.test(req.body.password)) {
    return res.status(400).json({message: 'le mot de passe doit contenir au minimum 8 caractères, au moins une lettre minuscule et une lettre majuscule, un caractère spécial et un chiffre' });
  }else if(!emailRegex.test(req.body.email)){
    return res.status(400).json({ message: 'l\'email n\'est pas correct veuillez renseigner une adresse valide ' });
  }
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(() => res.status(400).json({  message: 'veuillez utiliser un adresse valide'}));
      })
   
   
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
                .catch(() => res.status(401).json({ mesage : ' veuillez vous connecter' }));
        })
        .catch(() => res.status(401).json({ mesage : ' veuillez vous connecter ' }));
 };