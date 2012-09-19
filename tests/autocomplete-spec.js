define(function(require) {

    var Filter = require('../src/filter');
    var AutoComplete = require('../src/autocomplete');
    var $ = require('$');

    Filter.test = function() {
        return [];
    };

    describe('Autocomplete', function() {

        beforeEach(function() {
            loadFixtures('input.html');
        });
        afterEach(function() {
            if (ac) {
                ac.destroy();
                ac = null;
            }
        });

        test('normal usage', function() {
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            $('#test').val('a').keyup();
            expect(ac.get('data')).toEqual([
                {value: 'abc', highlightIndex: [0]},
                {value: 'abd', highlightIndex: [0]}
            ]);
        });

        test('render', function() {
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            $('#test').val('a').keyup();
            expect(ac.items.eq(0)).toHaveAttr('data-value', 'abc');
            expect(ac.items.eq(0)).toHaveText('abc');
            expect(ac.items.eq(0).find('.ui-autocomplete-item-hl'))
                .toHaveText('a');
            expect(ac.items.eq(1)).toHaveAttr('data-value', 'abd');
            expect(ac.items.eq(1)).toHaveText('abd');
            expect(ac.items.eq(1).find('.ui-autocomplete-item-hl'))
                .toHaveText('a');
        });

        describe('inputValue', function() {
            test('change value', function() {
                var expectValue, input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                spyOn(ac, '_onRenderInputValue').andCallFake(function(val) {
                    expect(expectValue).toBe(val);
                });

                expectValue = 'a';
                input.val('a').keyup();
                expect(ac._onRenderInputValue.calls.length).toBe(1);

                expectValue = '';
                input.keyup();
                expect(ac._onRenderInputValue.calls.length).toBe(1);

                expectValue = 'ab';
                input.val('ab').keyup();
                expect(ac._onRenderInputValue.calls.length).toBe(2);

                expectValue = 'a';
                input.val('a').keyup();
                expect(ac._onRenderInputValue.calls.length).toBe(3);
            });

            test('input filter', function() {
                var expectValue, input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    inputFilter: function(val) {
                        return 'filter-' + val;
                    },
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                spyOn(ac.dataSource, 'getData').andCallFake(function(val) {
                    expect('filter-' + expectValue).toBe(val);
                });

                expectValue = 'a';
                input.val('a').keyup();
                expect(ac.dataSource.getData.calls.length).toBe(1);

                expectValue = '';
                input.val('').keyup();
                expect(ac.dataSource.getData.calls.length).toBe(1);
            });

        });

        test('keyup', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            input.val('a').keyup();

            expect(ac.get('visible')).toBe(true);
            input.val('').keyup();
            expect(ac.get('visible')).toBe(false);
            expect(ac.get('data')).toEqual([]);

            input.val('a').keyup();
            ac.hide();

            expect(ac.get('visible')).toBe(false);
            ac.set('inputValue', 'ab');
            input.keyup();
            expect(ac.get('visible')).toBe(true);

            input.val('az').keyup();
            expect(ac.get('visible')).toBe(false);
        });

        test('keydown', function() {
        });

        describe('data locator', function() {
            test('is string', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: {
                        test: ['abc', 'abd', 'cbd']
                    },
                    locator: 'test'
                }).render();

                $('#test').val('a').keyup();
                expect(ac.get('data')).toEqual([
                    {value: 'abc', highlightIndex: [0]},
                    {value: 'abd', highlightIndex: [0]}
                ]);
            });

            test('is dot string', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: {
                        test: {
                            more: ['abc', 'abd', 'cbd']
                        }
                    },
                    locator: 'test.more'
                }).render();

                $('#test').val('a').keyup();
                expect(ac.get('data')).toEqual([
                    {value: 'abc', highlightIndex: [0]},
                    {value: 'abd', highlightIndex: [0]}
                ]);
            });

            test('is function', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: {
                        test1: ['abc', 'cbd'],
                        test2: ['abd']
                    },
                    locator: function(data) {
                        return data.test1.concat(data.test2);
                    }
                }).render();

                $('#test').val('a').keyup();
                expect(ac.get('data')).toEqual([
                    {value: 'abc', highlightIndex: [0]},
                    {value: 'abd', highlightIndex: [0]}
                ]);
            });
        });

        describe('filter', function() {
            test('specified', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: 'test',
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                $('#test').val('a').keyup();
                expect(ac.get('data')).toEqual([]);
            });
            test('not exist', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: 'none',
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                $('#test').val('a').keyup();
                expect(ac.get('data')).toEqual([
                    {value: 'abc'},
                    {value: 'abd'},
                    {value: 'cbd'}
                ]);
            });
            test('is function', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: function(data) {
                        var result = [];
                        $.each(data, function(index, value) {
                            if (value.substring(1, 3) == 'bd') {
                                result.push({value: value});
                            }
                        });
                        return result;
                    },
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                $('#test').val('a').keyup();
                expect(ac.get('data')).toEqual([
                    {value: 'abd'},
                    {value: 'cbd'}
                ]);
            });
        });

        test('select item', function() {
            var input = $('#test'), beCalled = false;
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).on('itemSelect', function() {
                beCalled = true;
            }).render();

            $('#test').val('a').keyup();
            ac.set('selectedIndex', 0);

            ac.selectItem();
            expect(ac.get('visible')).toBe(false);
            expect(input).toBeFocused();
            expect(input.val()).toBe('abc');
            expect(ac.get('inputValue')).toBe('abc');
            expect(beCalled).toBeTruthy();
        });

        test('highlight item', function() {
            var input = $('#test'), item;
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            ac.set('data', [
                {value: 'abcdefg', highlightIndex: [[0, 1]]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).toBe(1);
            expect(item.eq(0)).toHaveText('a');

            ac.set('data', [
                {value: 'abcdefg', highlightIndex: [[1, 2], [3, 4]]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).toBe(2);
            expect(item.eq(0)).toHaveText('b');
            expect(item.eq(1)).toHaveText('d');

            ac.set('data', [
                {value: 'abcdefg', highlightIndex: [[0, 1], [3, 7], [8, 9]]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).toBe(2);
            expect(item.eq(0)).toHaveText('a');
            expect(item.eq(1)).toHaveText('defg');

            ac.set('data', [
                {value: 'abcdefg', highlightIndex: [1, 4]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).toBe(2);
            expect(item.eq(0)).toHaveText('b');
            expect(item.eq(1)).toHaveText('e');

            ac.set('data', [
                {value: 'abcdefg', highlightIndex: [6, 8]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).toBe(1);
            expect(item.eq(0)).toHaveText('g');
        });

        test('clear', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            $('#test').val('a').keyup();

            ac._clear();
            expect(ac.$('[data-role=items]').html()).toBe('');
            expect(ac.items).toBe(null);
            expect(ac.currentItem).toBe(null);
            expect(ac.get('selectedIndex')).toBe(-1);
        });
    });

});

