'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MatchCharacteristics = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MatchCharacteristics = function MatchCharacteristics() {
    (0, _classCallCheck3.default)(this, MatchCharacteristics);
};

MatchCharacteristics.Kinds = {
    SINGLES: 'SINGLES',
    DOUBLES: 'DOUBLES'
};
MatchCharacteristics.Scoring = {
    TWOSETS: 'TWOSETS',
    THREESETS: 'THREESETS'
};
MatchCharacteristics.TwoSetSingls = {
    kind: MatchCharacteristics.Kinds.SINGLES,
    scoring: MatchCharacteristics.Scoring.TWOSETS
};
MatchCharacteristics.TwoSetDoubles = {
    kind: MatchCharacteristics.Kinds.DOUBLES,
    scoring: MatchCharacteristics.Scoring.TWOSETS
};
MatchCharacteristics.ThreeSetSingls = {
    kind: MatchCharacteristics.Kinds.SINGLES,
    scoring: MatchCharacteristics.Scoring.THREESETS
};
MatchCharacteristics.ThreeSetDoubles = {
    kind: MatchCharacteristics.Kinds.DOUBLES,
    scoring: MatchCharacteristics.Scoring.THREESETS
};
exports.MatchCharacteristics = MatchCharacteristics;
//# sourceMappingURL=match-characteristics.js.map