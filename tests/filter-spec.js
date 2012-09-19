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

            test('start width a', function() {
                var result = Filter.startsWith(data, 'a');
                expect(result).toEqual([
                    {value: 'about', highlightIndex: [[0, 1]]},
                    {value: 'abuse', highlightIndex: [[0, 1]]}
                ]);
            });

            test('start width none', function() {
                var result = Filter.startsWith(data, '');
                expect(result).toEqual([
                    {value: 'about', highlightIndex: [[0, 1]]},
                    {value: 'abuse', highlightIndex: [[0, 1]]}
                    {value: 'but', highlightIndex: [[0, 1]]},
                    {value: 'buffer', highlightIndex: [[0, 1]]}
                ]);
            });

            test('start width more', function() {
                var result = Filter.startsWith(data, 'abc');
                expect(result).toEqual([]);
            });

        });
    });

});
