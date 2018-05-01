'use strict';

module.exports = {
  getXY: getXY
};

function getXY(context, events, done) {
  const xy = {
    x: Math.random(),
    y: Math.random()
  }
  context.vars.xy = xy;
  return done();
}