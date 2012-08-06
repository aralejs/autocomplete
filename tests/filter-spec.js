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
                    'buffter'
                ];
            });

            afterEach(function() {
                data = null;
            });

            test('normal usage', function() {
                var result = Filter.startsWith('a', data);

                expect(result[0].value).toBe('about');
                expect(result[0].highlightIndex[0]).toBe(0);
                expect(result[1].value).toBe('abuse');
                expect(result[1].highlightIndex[0]).toBe(0);
            });

            test('normal usage', function() {
                var result = Filter.startsWith('bu', data);

                expect(result[0].value).toBe('but');
                var index = result[0].highlightIndex[0];
                expect(index[0]).toBe(0);
                expect(index[1]).toBe(2);
                expect(result[1].value).toBe('buffter');
            });

        });
    });

});
