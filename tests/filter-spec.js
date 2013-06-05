define(function(require) {

    var expect = require('puerh');
    var Filter = require('filter');

    describe('Filter', function() {
        xit('normalize', function() {
            //data = [
            //    'aa',
            //    'ba',
            //    {title: 'ab'},
            //    {value: 'ac'},
            //    {label: 'bc1', other: 'bc2'},
            //    {label: 'ad1', value: 'ad2'},
            //    {label: 'ae1', value: 'ae2', alias:['be']}
            //];
            var result = Filter['default'](data);
            expect(result).to.eql([
                {label: 'aa', value: 'aa', alias: []},
                {label: 'ba', value: 'ba', alias: []},
                {label: 'ac', value: 'ac', alias: []},
                {label: 'bc1', value: 'bc1', alias: [], other: 'bc2'},
                {label: 'ad1', value: 'ad2', alias: []},
                {label: 'ae1', value: 'ae2', alias:['be']}
            ]);
        });

        describe('startsWith', function() {
            var data;
            beforeEach(function() {
                data = [
                    {label: 'aa', value: 'aa', alias: []},
                    {label: 'ba', value: 'ba', alias: []},
                    {label: 'ac', value: 'ac', alias: []},
                    {label: 'bc1', value: 'bc1', alias: [], other: 'bc2'},
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
                    {label: 'aa', value: 'aa', alias: []},
                    {label: 'ac', value: 'ac', alias: []},
                    {label: 'ad1', value: 'ad2', alias: []},
                    {label: 'ae1', value: 'ae2', alias:['be']}
                ]);
            });

            it('start width b', function() {
                var result = Filter.startsWith(data, 'b');
                expect(result).to.eql([
                    {label: 'ba', value: 'ba', alias: []},
                    {label: 'bc1', value: 'bc1', alias: [], other: 'bc2'},
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
                   {label: 'abc', value: 'abc', alias: []},
                   {label: 'bcd', value: 'bcd', alias: []},
                   {label: 'dce', value: 'dce', alias: ['bcd']}
                ];
                var result = Filter.stringMatch(data, 'bc');
                expect(result).to.eql([
                   {label: 'abc', value: 'abc', alias: []},
                   {label: 'bcd', value: 'bcd', alias: []},
                   {label: 'dce', value: 'dce', alias: ['bcd']}
                ]);
            });
        });
    });

});
