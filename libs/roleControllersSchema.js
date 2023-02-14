const roleControllers = {
    admin: ['admin'],
    donor: ['donor', 'user'],
    user: ['user', 'donor', 'admin']
};

module.exports = {
    roleControllers
};
