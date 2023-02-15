//  fonction qui vérifie que le mot de passe est robuste


const notEmpty = (value) => {
    if (value.trim().length === 0) {
        return false;
    };
    return true;

};

const regexPassword   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const verification = (password) => {
 if (notEmpty(password.value) && regexPassword.test(password.value)) {
    return true; 
   } else {
        
        return false .json({message: 'veuillez mettre un mot de passe '})
    };
    
} 




