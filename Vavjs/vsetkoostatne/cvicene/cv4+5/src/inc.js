function isNumber(a) {
    if (typeof a !== 'number') return false;
    if (isNaN(a)) return false;
    return true;
}

const inc = (a) => {
    if (!isNumber(a)) return NaN;
    return a + 1;
};

module.exports = { inc };