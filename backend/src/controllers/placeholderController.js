exports.notImplemented = (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};
