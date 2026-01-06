const getMyProfile = (req, res) => {
  // req.user was set by verifyJWT()
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  getMyProfile,
};
