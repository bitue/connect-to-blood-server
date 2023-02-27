const { roleControllers } = require('../libs/roleControllersSchema');

const checkRole = (authCheck) => (req, res, next) => {
    const role = req.tokenPayload.role;
    console.log('chk-role');
    console.log(role);
    try {
        if (roleControllers[authCheck].includes(role)) {
            next();
        } else {
            res.sendStatus(403);
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    checkRole
};
