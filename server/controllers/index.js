const welcomeUser = (req, res) => {
  try {
    res.status(500).json({
      data: null,
      message: 'Welcome',
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: error.message,
    });
  }
};

module.exports = { welcomeUser };
