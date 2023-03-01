const Sauce = require('../models/sauce');

// route post  /api/sauces/:id creation un produit
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;

  if (sauceObject.heat < 1 || sauceObject.heat > 10) {
    fs.unlink(req.file.path, () => {
      res.status(400).json({ message: 'Veuillez choisir un nombre entre 1 et 10' });
    });
    return;
  }

  if (!sauceObject.name || !sauceObject.manufacturer || !sauceObject.description || !sauceObject.mainPepper) {
    fs.unlink(req.file.path, () => {
      res.status(400).json({ error: 'Tous les champs doivent être renseignés' });
    });
    return;
  }

  if (sauceObject.name.trim().length === 0 || sauceObject.manufacturer.trim().length === 0 || sauceObject.description.trim().length === 0 || sauceObject.mainPepper.trim().length === 0) {
    fs.unlink(req.file.path, () => {
      res.status(400).json({ error: 'Tous les champs doivent être renseignés' });
    });
    return;
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Le fichier d\'image est manquant' });
  }

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
  });

  sauce.save()
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch((error) => {
      fs.unlink(req.file.path, () => {
        res.status(400).json({ error });
      });
    });
};


// route get /api/sauces/:id affiche toute les sauces sur la page produit
exports.getOneSauce = (req, res, next) => {

  Sauce.findOne({

    _id: req.params.id

  }).then(
    (sauces) => {
      if (sauces === null) {
        return json({ message: 'sauce non valide' });
      }
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        'message': 'produit introuvable'
      });
    }
  );
};

// route put  /api/sauces/:id modifier un produit
exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }
    : { ...req.body };
  delete sauceObject._userId;
  if (sauceObject.heat < 1 || sauceObject.heat > 10) {
    return res.status(404).json({ message: 'Veuillez choisir un nombre entre 1 et 10' });
  }


  if (!sauceObject.name || !sauceObject.manufacturer || !sauceObject.description || !sauceObject.mainPepper) {
    return res.status(400).json({ error: 'Tous les champs doivent être renseignés ' });
  }

  if (sauceObject.name.trim().length === 0 || sauceObject.manufacturer.trim().length === 0 || sauceObject.description.trim().length === 0 || sauceObject.mainPepper.trim().length === 0) {
    return res.status(400).json({ error: 'Tous les champs doivent être renseignés' });
  }

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'Not authorized' });
      } else {
        if (sauceObject.imageUrl !== req.params.imageUrl) {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ imageUrl: req.params.imageUrl })
          })
        }

        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })

          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      fs.unlink(req.file.path, () => {
        res.status(400).json({ message: 'produit introuvable' });
      })
    });

};

// route delete  /api/sauces/:id supprimer un produit
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauces => {
      if (sauces.userId != req.auth.userId) {
        res.status(403).json({ message: 'Not authorized' });
      } else {
        const filename = sauces.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(() => res.status(401).json({ mesage: 'produit introuvable' }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ mesage: 'produit introuvable' });
    });
};
// route get /api/sauces affiche toute les sauces sur le page daccueil
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.createLike = (req, res) => {
  //Récupération d'une seule Sauce avec 'findOne'
  Sauce.findOne({
    _id: req.params.id
  })
    .then(sauce => {
      // like
      if (req.body.like === 1) {
        console.log('like');
        // condition si l'utilisateur a déjà liker 
        if (sauce.usersLiked.includes(req.auth.userId)) {
          return res.status(400).json({ error: 'Vous avez déjà liké cette sauce' });
        }
        sauce.likes++;
        sauce.usersLiked.push(req.auth.userId);

        if (sauce.usersDisliked.includes(req.auth.userId)) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.auth.userId), 1);
        }
        sauce.save()
          .then(() => { return res.status(200).json({ message: 'sauce likée' }) })
          .catch(error => { return res.status(401).json({ error }) });
      }
      // dislike




      if (req.body.like === -1) {
        console.log('dislike');
        if (sauce.usersDisliked.includes(req.auth.userId)) {
          return res.status(400).json({ error: 'Vous avez déjà disliké cette sauce' });
        }
        sauce.dislikes++;
        sauce.usersDisliked.push(req.auth.userId);
        if (sauce.usersLiked.includes(req.auth.userId)) {
          sauce.likes--;
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.auth.userId), 1);
        }
        sauce.save()
          .then(() => { return res.status(200).json({ message: 'sauce dislikée' }) })
          .catch(error => { return res.status(401).json({ error }) });
      }




      // retirer le  like ou dislike
      if (req.body.like === 0) {
        if (sauce.usersLiked.includes(req.auth.userId)) {
          sauce.likes--;
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.auth.userId), 1);
        }
        if (sauce.usersDisliked.includes(req.auth.userId)) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.auth.userId), 1);
        }
        sauce.save()
          .then(() => { return res.status(200).json({ message: 'like/dislike retiré' }) })
          .catch(error => { return res.status(401).json({ error }) });
      }

    })
    .catch(() => {
      return res.status(500).json({ message: 'erreur lors de l\'ajout ' })
    })
};