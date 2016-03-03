/* global describe, it */
'use strict';
import austin from 'austin';
import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';
import combineReducers from '../lib/';
import {List, Map} from 'immutable';

chai.use(chaiImmutable);

describe('redux-immutable-combine-reducers', () => {
  it('should throw error if an object or Immutable Map is not given', () => {
    function objTest() {
      combineReducers();
    }

    function immutableTest() {
      combineReducers(List());
    }

    expect(objTest).to.throw(TypeError, /Expected an object or Immutable Map/);
    expect(immutableTest).to.throw(TypeError, /Expected an object or Immutable Map/);
  });

  it('should throw error if not all of an object\'s keys are functions', () => {
    function test() {
      combineReducers({
        test() {},
        string: ''
      });
    }

    expect(test).to.throw(Error, /Expected an object with all keys being functions/);
  });

  it('should return function that returns a map and calls all reducers for an object', () => {
    const reducers = {
      testReducer(state = 0, action = {}) {
        switch (action.type) {
          case 'INCREMENT':
            return state + 1;
          default:
            return state;
        }
      },
      anotherTestReducer(state = '', action = {}) {
        switch (action.type) {
          case 'SET':
            return action.value;
          default:
            return state;
        }
      }
    };
    austin.spy(reducers, 'testReducer');
    austin.spy(reducers, 'anotherTestReducer');

    const firstState = combineReducers(reducers)();
    expect(firstState).to.equal(Map({
      testReducer: 0,
      anotherTestReducer: ''
    }));

    expect(reducers.testReducer.callCount()).to.equal(1);
    expect(reducers.anotherTestReducer.callCount()).to.equal(1);

    const secondState = combineReducers(reducers)(firstState, {type: 'INCREMENT'});
    expect(secondState).to.equal(Map({
      testReducer: 1,
      anotherTestReducer: ''
    }));
  });

  it('should throw error if not all of a Map\'s entries are functions', () => {
    function test() {
      combineReducers(Map({
        test() {},
        string: ''
      }));
    }

    expect(test).to.throw(Error, /Expected an Immutable.Map with all entries being functions/);
  });

  it('should return function that returns a map and calls all reducers for a Map', () => {
    let testReducerCalled = false
      , anotherTestReducerCalled = false;

    const mapReducers = Map({
      testReducer(state = 0, action = {}) {
        testReducerCalled = true;
        switch (action.type) {
          case 'INCREMENT':
            return state + 1;
          default:
            return state;
        }
      },
      anotherTestReducer(state = '', action = {}) {
        anotherTestReducerCalled = true;
        switch (action.type) {
          case 'SET':
            return action.value;
          default:
            return state;
        }
      }
    });

    const firstState = combineReducers(mapReducers)();

    expect(firstState).to.equal(Map({
      testReducer: 0,
      anotherTestReducer: ''
    }));

    expect(testReducerCalled).to.equal(true);
    expect(anotherTestReducerCalled).to.equal(true);

    const secondState = combineReducers(mapReducers)(firstState, {type: 'INCREMENT'});
    expect(secondState).to.equal(Map({
      testReducer: 1,
      anotherTestReducer: ''
    }));
  });

  it('should return same Immutable reference if nothing changed', () => {
    const sameReducer = {
      test(state = Map({})) {
        return state;
      }
    };
    const reducer = combineReducers(sameReducer);
    const first = reducer();
    const second = reducer(first);

    /* eslint eqeqeq: 0 */
    expect(first == second).to.equal(true);
  });
});
