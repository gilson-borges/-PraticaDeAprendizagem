function registrationAuth(req, res, next){

    if(req.session.user != undefined){

        const { registration } = JSON.parse(req.session.user.permissions);

        if(registration){
            next();
        } else {
            res.redirect('/');
        }

    } else {
        res.redirect('/login');
    }
}

module.exports = registrationAuth;