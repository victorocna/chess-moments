module.exports = (letter) => {
  const brushes = {
    R: 'red',
    Y: 'yellow',
    G: 'green',
  };

  return brushes[letter] || 'green';
};
