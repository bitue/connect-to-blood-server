const roleControllers = {
    admin: ['admin'],
    donor: ['donor', 'admin'],
    user: ['user', 'donor', 'admin']
};

module.exports = {
    roleControllers
};
