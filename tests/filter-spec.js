define(function(require) {

    var expect = require('puerh');
    var Filter = require('filter');

    describe('Filter', function() {
        var data;
        beforeEach(function() {
            data = [
                'about',
                {value: 'abuse abbess'},
                {title: 'absolute abbey'},
                'but',
                'buffer'
            ];
        });
        afterEach(function() {
            data = null;
        });

        it('normalize', function() {
            var data = [
                'aa',
                {title: 'ab'},
                {value: 'ac'},
                {label: 'ad1', other: 'ad2'},
                {label: 'ae1', value: 'ae2'},
                {label: 'af1', value: 'af2', alias:['af3']}
            ];
            var result = Filter['default'](data);
            expect(result).to.eql([
                {label: 'aa', value: 'aa', alias: []},
                {label: 'ac', value: 'ac', alias: []},
                {label: 'ad1', value: 'ad1', alias: [], other: 'ad2'},
                {label: 'ae1', value: 'ae2', alias: []},
                {label: 'af1', value: 'af2', alias:['af3']}
            ]);
        });

        describe('default', function() {
            it('return all', function() {
                var result = Filter['default'](data);
                expect(result).to.eql([
                    {matchKey: 'about'},
                    {matchKey: 'abuse abbess', value: 'abuse abbess'},
                    {matchKey: '', title: 'absolute abbey'},
                    {matchKey: 'but'},
                    {matchKey: 'buffer'}
                ]);
            });

            it('return all when set option key', function() {
                var result = Filter['default'](data, 'a', {key: 'title'});
                expect(result).to.eql([
                    {matchKey: 'about'},
                    {matchKey: '', value: 'abuse abbess'},
                    {matchKey: 'absolute abbey', title: 'absolute abbey'},
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
                    {matchKey: 'abuse abbess', value: 'abuse abbess', highlightIndex: [[0, 1]]}
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
                    {matchKey: 'absolute abbey', title: 'absolute abbey', highlightIndex: [[0, 1]]}
                ]);
            });
        });

        describe('stringMatch', function() {
            it('match a', function() {
                var result = Filter.stringMatch(data, 'ab', {key: 'title'});
                expect(result).to.eql([
                    {matchKey: 'about', highlightIndex: [[0, 2]]},
                    {matchKey: 'absolute abbey', title: 'absolute abbey', highlightIndex: [[0, 2], [9, 11]]}
                ]);
            });
        });
    });

});
