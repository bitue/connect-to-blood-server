const { roleControllers } = require('../libs/roleControllersSchema');

const checkRole = (authCheck) => (req, res, next) => {
    const role = req.tokenPayload.role;
    console.log('chk-role');
    console.log(role);

    if (roleControllers[role].includes(authCheck)) {
        next();
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    checkRole
};
