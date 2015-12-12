'use strict';
import isPlainObj from 'is-plain-obj';
import {Map} from 'immutable';

/**
 * Returns a reducer function that always returns an Immutable.Map
 * @param {Object|Immutable.Map} reducers - keys or entries of functions
 * @return {Function} - a reducer function
 */
module.exports = function (reducers) {
  if (isPlainObj(reducers)) {
    Object.keys(reducers).forEach(key => {
      if (typeof reducers[key] !== 'function') {
        throw new Error('Expected an object with all keys being functions');
      }
    });

    return function (state = Map({}), action) {
      return Object.keys(reducers).reduce((nextstate, key) =>
        nextstate.set(key, reducers[key](state.get(key), action))
      , state);
    };
  }

  if (Map.isMap(reducers)) {
    reducers.keySeq().forEach(key => {
      if (typeof reducers.get(key) !== 'function') {
        throw new Error('Expected an Immutable.Map with all entries being functions');
      }
    });

    return function (state = Map({}), action) {
      return reducers.keySeq().reduce((nextstate, key) =>
        nextstate.set(key, reducers.get(key)((state.get(key), action)))
      , state);
    };
  }

  throw new TypeError('Expected an object or Immutable Map');
};
