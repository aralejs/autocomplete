define(function(require) {

    var Filter = require('../src/filter');

    describe('Filter', function() {
        var data;
        beforeEach(function() {
            data = [
                'about',
                {value: 'abuse'},
                {title: 'absolute'},
                'but',
                'buffer'
            ];
        });
        afterEach(function() {
            data = null;
        });

        describe('default', function() {
            it('return all', function() {
                var result = Filter['default'](data);
                expect(result).to.eql([
                    {matchKey: 'about'},
                    {matchKey: 'abuse', value: 'abuse'},
                    {matchKey: '', title: 'absolute'},
                    {matchKey: 'but'},
                    {matchKey: 'buffer'}
                ]);
            });
            
            it('return all when set option key', function() {
                var result = Filter['default'](data, 'a', {key: 'title'});
                expect(result).to.eql([
                    {matchKey: 'about'},
                    {matchKey: '', value: 'abuse'},
                    {matchKey: 'absolute', title: 'absolute'},
                    {matchKey: 'but'},
                    {matchKey: 'buffer'}
                ]);
            });
        });

        describe('startsWith', function() {
            it('start width a', function() {
                var result = Filter.startsWith(data, 'a');
                expect(result).to.eql([
                    {matchKey: 'about', highlightIndex: [[0, 1]]},
                    {matchKey: 'abuse', value: 'abuse', highlightIndex: [[0, 1]]}
                ]);
            });

            it('start width none', function() {
                var result = Filter.startsWith(data, '');
                expect(result).to.eql([]);
            });

            it('start width more', function() {
                var result = Filter.startsWith(data, 'abc');
                expect(result).to.eql([]);
            });

            it('option key is title', function() {
                var result = Filter.startsWith(data, 'a', {key: 'title'});
                expect(result).to.eql([
                    {matchKey: 'about', highlightIndex: [[0, 1]]},
                    {matchKey: 'absolute', title: 'absolute', highlightIndex: [[0, 1]]}
                ]);
            });
        });
    });

});
