define(function(require) {

    var Filter = require('../src/filter');

    describe('Filter', function() {

        describe('startsWith', function() {
            var data;

            beforeEach(function() {
                data = [
                    'about',
                    'abuse',
                    'but',
                    'buffer'
                ];
            });

            afterEach(function() {
                data = null;
            });

            it('start width a', function() {
                var result = Filter.startsWith(data, 'a');
                expect(result).to.eql([
                    {value: 'about', highlightIndex: [[0, 1]]},
                    {value: 'abuse', highlightIndex: [[0, 1]]}
                ]);
            });

            it('start width none', function() {
                var result = Filter.startsWith(data, '');
                expect(result).to.eql([
                    {value: 'about'},
                    {value: 'abuse'},
                    {value: 'but'},
                    {value: 'buffer'}
                ]);
            });

            it('start width more', function() {
                var result = Filter.startsWith(data, 'abc');
                expect(result).to.eql([]);
            });

        });
    });

});
