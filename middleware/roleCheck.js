module.exports = function roleCheck(allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. You do not have permission.",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({
        message: "Role check error",
      });
    }
  };
};