exports.addDays = (date, days) => {
  const d = new Date(date || Date.now());
  d.setDate(d.getDate() + days);
  return d;
};

exports.now = () => new Date();
