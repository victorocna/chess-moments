const { Chess } = require('chess.js');
const { last } = require('lodash');

/**
 * Formats a chess move into a moment object.
 * @param {Object} move - The move object containing FEN and SAN.
 * @param {string} move.fen - The FEN string representing the position after the move.
 * @param {string} move.san - The SAN (Standard Algebraic Notation) string of the move.
 * @returns {Object} - A moment object with the move's details.
 */
const formatMoment = ({ fen, san }) => {
  const chess = new Chess();
  const pgn = `[SetUp "1"]\n[FEN "${fen}"]\n\n${chess.pgn()}`;

  chess.loadPgn(pgn);
  chess.move(san);

  return last(chess.history({ verbose: true }));
};

module.exports = formatMoment;
