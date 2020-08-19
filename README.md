# Chess moments

This package is a javascript PGN parser that transforms PGN files into chess "moments".
In its simplest form, a chess "moment" has a chess move and its corresponding
[FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation).

Chess moments includes comments, shapes, variations, special characters, everything
that you need in order to correctly display a chess game in javascript.

## Installation

```bash
npm i chess-moments
# or
yarn add chess-moments
```

## JSON output

The basic PGN file `1. e4 e5 *` will generated the following chess moments in JSON format:

```json
[
  {
    "depth": 1,
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "shapes": [],
    "index": 0
  },
  {
    "move": "e4",
    "depth": 1,
    "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    "shapes": [],
    "index": 1
  },
  {
    "move": "e5",
    "depth": 1,
    "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    "shapes": [],
    "index": 2
  }
]
```
