const assert = require('assert');

describe('unit test', function() {
    const inc = require('./src/inc.js');
    describe('inc', function() {
        it('should return 2 when 1', () => {
            assert.equal(inc.inc(1), 2);

        });
        it('should return true (NaN) when \'\'', () => {
            const res = inc.inc('');
            assert.equal(isNaN(res), true);
            assert.equal(typeof res, 'number');

        });

    });

});