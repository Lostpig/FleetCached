'use strict';

Array.prototype.sum = function (predicate) {
    if (this === null) {
        throw new TypeError('Array.prototype.sum called on null or undefined');
    }
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
    }

    var list = Object(this),
        length = list.length,
        value = 0,
        sum = 0;
    for (let i = 0; i < length; i++) {
        value = list[i];
        value = predicate(value, i, list);
        if (typeof value !== 'number') {
            throw new TypeError('predicate returned value must be a number');
        }
        sum += value;
    }
    return sum;
};

Array.prototype.avg = function (predicate) {
    if (this === null) {
        throw new TypeError('Array.prototype.avg called on null or undefined');
    }
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
    }

    var list = Object(this),
        length = list.length,
        value = 0,
        sum = 0;
    for (let i = 0; i < length; i++) {
        value = list[i];
        value = predicate(value, i, list);
        if (typeof value !== 'number') {
            throw new TypeError('predicate returned value must be a number');
        }
        sum += value;
    }
    return length > 0 ? sum / length : 0;
};

Array.prototype.max = function (predicate) {
    if (this === null) {
        throw new TypeError('Array.prototype.max called on null or undefined');
    }
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
    }

    var list = Object(this),
        length = list.length,
        value,
        pValue,
        maxItem,
        maxValue;
    for (let i = 0; i < length; i++) {
        value = list[i];
        pValue = predicate(value, i, list);

        if (typeof pValue !== 'number') {
            throw new TypeError('predicate returned value must be a number');
        }
        if (pValue > maxValue || i === 0) {
            maxItem = value;
            maxValue = pValue;
        }
    }
    return maxItem;
};

Array.prototype.min = function (predicate) {
    if (this === null) {
        throw new TypeError('Array.prototype.min called on null or undefined');
    }
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
    }

    var list = Object(this),
        length = list.length,
        value,
        pValue,
        minItem,
        minValue;
    for (let i = 0; i < length; i++) {
        value = list[i];
        pValue = predicate(value, i, list);

        if (typeof pValue !== 'number') {
            throw new TypeError('predicate returned value must be a number');
        }
        if (pValue < minValue || i === 0) {
            minItem = value;
            minValue = pValue;
        }
    }
    return minItem;
};

Array.prototype.distinct = function (predicate) {
    if (this === null) {
        throw new TypeError('Array.prototype.distinct called on null or undefined');
    }

    let list = Object(this);
    if (predicate && typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
    }
    else if (typeof predicate === 'function') {
        list = list.map(predicate);
    }

    var distinctSet = new Set(list),
        distinctList = Array.from(distinctSet);

    return distinctList;
};
