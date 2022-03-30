function adminAuth(req, res, next){
    
    if(req.session.user != undefined){

        const { admin } = JSON.parse(req.session.user.permissions);

        if(admin){
            next();
        } else {
            res.redirect('/');
        }

    } else {
        res.redirect('/login');
    }
}

module.exports = adminAuth;