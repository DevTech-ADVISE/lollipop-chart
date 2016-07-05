
var d3Tip = function(d3) {
  var tip = function(selection){};

  d3.tip = function() {

    return tip;
  }

  tip.attr = function(_) {
    if(arguments.length === 1) return 'mock-id';

    return tip;
  };

  tip.html = function(_) {
    return tip;
  }

  tip.offset = function(_) {
    return tip;
  };

  tip.positionAnchor = function(_) {
    return tip;
  };
};

module.exports = d3Tip;