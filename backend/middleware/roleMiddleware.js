const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Access forbidden for this account type'
        });
    }

    return next();
};

module.exports = authorizeRoles;
