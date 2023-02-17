const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const User = require('../models/user');

exports.signup = (req, res, next) => {
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regexPassword.test(req.body.password)) {
    return res.status(400).json({ 'message': 'Le mot de passe doit contenir au moins une majuscule et un caractère spécial' });
  }else if(!emailRegex.test(req.body.email)){
    return res.status(400).json({ 'message': 'l\'email n\'est pas correct veuillez renseigner une adresse valide ' });
  }
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
      if(req.status(404)) {
      return json({'message': 'introuvable'});
    }
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