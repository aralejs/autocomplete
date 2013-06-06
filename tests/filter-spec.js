define(function(require) {

    var expect = require('puerh');
    var Filter = require('filter');

    describe('Filter', function() {
        describe('startsWith', function() {
            var data;
            beforeEach(function() {
                data = [
                    {label: 'aa1', value: 'aa2', alias: []},
                    {label: 'ba1', value: 'ba2', alias: []},
                    {label: 'ac1', value: 'ac2', alias: []},
                    {label: 'bc1', value: 'bc2', alias: [], other: 'bc2'},
                    {label: 'ad1', value: 'ad2', alias: []},
                    {label: 'ae1', value: 'ae2', alias:['be']}
                ];
            });
            afterEach(function() {
                data = null;
            });

            it('start width a', function() {
                var result = Filter.startsWith(data, 'a');
                expect(result).to.eql([
                    {label: 'aa1', value: 'aa2', alias: []},
                    {label: 'ac1', value: 'ac2', alias: []},
                    {label: 'ad1', value: 'ad2', alias: []},
                    {label: 'ae1', value: 'ae2', alias:['be']}
                ]);
            });

            it('start width b', function() {
                var result = Filter.startsWith(data, 'b');
                expect(result).to.eql([
                    {label: 'ba1', value: 'ba2', alias: []},
                    {label: 'bc1', value: 'bc2', alias: [], other: 'bc2'},
                    {label: 'ae1', value: 'ae2', alias:['be']}
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
        });

        describe('stringMatch', function() {
            it('match a', function() {
                var data = [
                   {label: 'abc1', value: 'abc', alias: []},
                   {label: 'bcd1', value: 'bcd', alias: []},
                   {label: 'dce1', value: 'dce', alias: ['bcd']}
                ];
                var result = Filter.stringMatch(data, 'bc');
                expect(result).to.eql([
                   {label: 'abc1', value: 'abc', alias: []},
                   {label: 'bcd1', value: 'bcd', alias: []},
                   {label: 'dce1', value: 'dce', alias: ['bcd']}
                ]);
            });

            it('highlight', function() {
                var data = [
                   {label: 'abc', value: 'abc', alias: []},
                   {label: 'bcd', value: 'bcd', alias: []},
                   {label: 'dce', value: 'dce', alias: ['bcd']}
                ];
                var result = Filter.stringMatch(data, 'bc');
                expect(result).to.eql([
                   {label: 'abc', value: 'abc', alias: [], highlightIndex: [[1, 3]]},
                   {label: 'bcd', value: 'bcd', alias: [], highlightIndex: [[0, 2]]},
                   {label: 'dce', value: 'dce', alias: ['bcd']}
                ]);
            });
        });
    });

});
