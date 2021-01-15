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

## API

The API returns various arrays of objects (chess moments).
These chese moments have specific keys like `move`, `fen`, `depth` and `index`

The first chess moment is always an object without the `move` key.
It only has `fen`, `depth`, `index` and optionally `comment` or `shapes`.

```json
{
  "move": "e4",
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  "comment": "Opening the queen and the bishop",
  "depth": 1
}
```

### .flat()

Returns a single level deep array of chess moments.
The `depth` key delimits between variants and subvariants played in the chess game.

### .tree()

Returns a two level deep array of chess moments.
The first level splits between variants and subvariants played in the chess game.

## JSON output

The basic PGN file `1. e4 e5 *` will generated the following chess moments in JSON format:

```json
[
  {
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "depth": 1,
    "index": 0
  },
  {
    "move": "e4",
    "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    "depth": 1,
    "index": 1
  },
  {
    "move": "e5",
    "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    "depth": 1,
    "index": 2
  }
]
```
