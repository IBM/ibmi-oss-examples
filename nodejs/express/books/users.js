let users = (function() {
    let module = {};

    module.List = {};

    // gets username from passport session storage, retrieve full record from
    // the List
    module.getCurrentUserRecord = function(req) {
        let username = req.session.passport.user;
        return module.List[username];
    };

    return module;
})();

module.exports = users;
