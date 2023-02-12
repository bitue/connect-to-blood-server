const { roleControllers } = require('../libs/roleControllersSchema');

const checkRole = (req, res, next) => {
    const { role } = req.headers;

    if (!role) {
        res.sendStatus(401);
    } else {
        if (roleControllers[role].includes(role)) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
};

module.exports = {
    checkRole
};
