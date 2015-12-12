# redux-immutable-combine-reducers
[![NPM version](https://badge.fury.io/js/redux-immutable-combine-reducers.svg)](https://badge.fury.io/js/redux-immutable-combine-reducers) [![Build Status](https://travis-ci.org/dustinspecker/redux-immutable-combine-reducers.svg)](https://travis-ci.org/dustinspecker/redux-immutable-combine-reducers) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/redux-immutable-combine-reducers.svg)](https://coveralls.io/r/dustinspecker/redux-immutable-combine-reducers?branch=master)

[![Code Climate](https://codeclimate.com/github/dustinspecker/redux-immutable-combine-reducers/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/redux-immutable-combine-reducers) [![Dependencies](https://david-dm.org/dustinspecker/redux-immutable-combine-reducers.svg)](https://david-dm.org/dustinspecker/redux-immutable-combine-reducers/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/redux-immutable-combine-reducers/dev-status.svg)](https://david-dm.org/dustinspecker/redux-immutable-combine-reducers/#info=devDependencies&view=table)

> A [Redux combineReducers](http://redux.js.org/docs/api/combineReducers.html) that returns an [Immutable Map](https://facebook.github.io/immutable-js/docs/#/Map)

## Install
```
npm install --save redux-immutable-combine-reducers
```

## Purpose

To have a root that is also an Immutable Map. Redux's combineReducers works with Immutable, but the root is still a plain object. This utility will return an Immutable Map instead.

## Usage
```javascript
import combineReducers from 'redux-immutable-combine-reducers';
import {Map} from 'immutable';

function counter(state = 0, action = {}) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

function filter(state = '', action = {}) {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter;
    default:
      return state;
  }
}

const objReducer = combineReducer({counter, filter});
const objState = objReducer();
console.log(objState.get('counter'));
// => 0

const mapReducer = combineReducer(Map({counter, filter}));
const mapState = mapReducer();
console.log(mapState.get('counter'));
// => 0
```

## API

### combineReducers(reducers)

Returns a reducer function that always returns an Immutable.Map.

### reducers
Type: `object` | `Immutable.Map`

An `object` or `Immutable.Map` with all keys or entries being functions.

## LICENSE
MIT © [Dustin Specker](https://github.com/dustinspecker)
