define(function(require) {

    var Filter = require('../src/filter');
    var AutoComplete = require('../src/autocomplete');
    var $ = require('$');

    Filter.test = function() {
        return [];
    };

    describe('Autocomplete', function() {

        var input, ac;

        beforeEach(function() {
            input = $('<input id="test" type="text" value="" />')
                .appendTo(document.body);
        });
        afterEach(function() {
            input.remove();
            if (ac) {
                ac.destroy();
                ac = null;
            }
        });

        it('normal usage', function() {
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            $('#test').val('a');
            ac._keyupEvent.call(ac);

            expect(ac.get('data')).to.eql([
                {matchKey: 'abc', highlightIndex: [[0, 1]]},
                {matchKey: 'abd', highlightIndex: [[0, 1]]}
            ]);
        });

        it('render', function() {
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            $('#test').val('a');
            ac._keyupEvent.call(ac);

            expect(ac.items.eq(0).data('value')).to.be('abc');
            expect(ac.items.eq(0).text()).to.be('abc');
            expect(ac.items.eq(0).find('.ui-autocomplete-item-hl').text())
                .to.be('a');
            expect(ac.items.eq(1).data('value')).to.be('abd');
            expect(ac.items.eq(1).text()).to.be('abd');
            expect(ac.items.eq(1).find('.ui-autocomplete-item-hl').text())
                .to.be('a');
        });

        describe('inputValue', function() {
            xit('change value', function() {
                var expectValue, input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                spyOn(ac, '_onRenderInputValue').andCallFake(function(val) {
                    expect(expectValue).to.be(val);
                });

                expectValue = 'a';
                input.val('a');
                ac._keyupEvent.call(ac);
                expect(ac._onRenderInputValue.calls.length).to.be(1);

                expectValue = '';
                ac._keyupEvent.call(ac);
                expect(ac._onRenderInputValue.calls.length).to.be(1);

                expectValue = 'ab';
                input.val('ab');
                ac._keyupEvent.call(ac);
                expect(ac._onRenderInputValue.calls.length).to.be(2);

                expectValue = 'a';
                input.val('a');
                ac._keyupEvent.call(ac);
                expect(ac._onRenderInputValue.calls.length).to.be(3);
            });

            xit('input filter', function() {
                var expectValue, input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    inputFilter: function(val) {
                        return 'filter-' + val;
                    },
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                spyOn(ac.dataSource, 'getData').andCallFake(function(val) {
                    expect('filter-' + expectValue).to.be(val);
                });

                expectValue = 'a';
                input.val('a');
                ac._keyupEvent.call(ac);
                expect(ac.dataSource.getData.calls.length).to.be(1);

                expectValue = '';
                input.val('');
                ac._keyupEvent.call(ac);
                expect(ac.dataSource.getData.calls.length).to.be(1);
            });

        });

        it('keyup', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            input.val('a');
            ac._keyupEvent.call(ac);

            expect(ac.get('visible')).to.be(true);
            input.val('');
            ac._keyupEvent.call(ac);
            expect(ac.get('visible')).to.be(false);
            expect(ac.get('data')).to.eql([]);

            input.val('a');
            ac._keyupEvent.call(ac);
            ac.hide();

            expect(ac.get('visible')).to.be(false);
            ac.set('inputValue', 'ab');
            ac._keyupEvent.call(ac);
            expect(ac.get('visible')).to.be(true);

            input.val('az');
            ac._keyupEvent.call(ac);
            expect(ac.get('visible')).to.be(false);
        });

        describe('data locator', function() {
            it('is string', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: {
                        test: ['abc', 'abd', 'cbd']
                    },
                    locator: 'test'
                }).render();

                $('#test').val('a');
                ac._keyupEvent.call(ac);
                expect(ac.get('data')).to.eql([
                    {matchKey: 'abc', highlightIndex: [[0, 1]]},
                    {matchKey: 'abd', highlightIndex: [[0, 1]]}
                ]);
            });

            it('is dot string', function() {
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

                $('#test').val('a');
                ac._keyupEvent.call(ac);
                expect(ac.get('data')).to.eql([
                    {matchKey: 'abc', highlightIndex: [[0, 1]]},
                    {matchKey: 'abd', highlightIndex: [[0, 1]]}
                ]);
            });

            it('is function', function() {
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

                $('#test').val('a');
                ac._keyupEvent.call(ac);
                expect(ac.get('data')).to.eql([
                    {matchKey: 'abc', highlightIndex: [[0, 1]]},
                    {matchKey: 'abd', highlightIndex: [[0, 1]]}
                ]);
            });
        });

        describe('filter', function() {
            it('specified', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: 'test',
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                $('#test').val('a');
                ac._keyupEvent.call(ac);
                expect(ac.get('data')).to.eql([]);
            });
            it('not exist', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: 'none',
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                $('#test').val('a');
                ac._keyupEvent.call(ac);
                expect(ac.get('data')).to.eql([
                    {matchKey: 'abc'},
                    {matchKey: 'abd'},
                    {matchKey: 'cbd'}
                ]);
            });
            it('is function', function() {
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

                $('#test').val('a');
                ac._keyupEvent.call(ac);
                expect(ac.get('data')).to.eql([
                    {value: 'abd'},
                    {value: 'cbd'}
                ]);
            });
            it('should be object', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: {
                        name: 'startsWith',
                        options: {
                            key: 'title'
                        }
                    },
                    dataSource: [
                        {title: 'abc', prop: '1'},
                        {title: 'abd', prop: '2'},
                        {title: 'cbd', prop: '3'}
                    ]
                }).render();

                $('#test').val('a');
                ac._keyupEvent.call(ac);
                expect(ac.get('data')).to.eql([
                    {title: 'abc', prop: '1', matchKey: 'abc', highlightIndex: [[0, 1]]},
                    {title: 'abd', prop: '2', matchKey: 'abd', highlightIndex: [[0, 1]]}
                ]);
            });
        });

        it('select item', function() {
            var input = $('#test'), beCalled = false;
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).on('itemSelect', function() {
                beCalled = true;
            }).render();

            $('#test').val('a');
            ac._keyupEvent.call(ac);
            ac.set('selectedIndex', 0);

            ac.selectItem();
            expect(ac.get('visible')).to.be(false);
            expect(input.val()).to.be('abc');
            expect(ac.get('inputValue')).to.be('abc');
            expect(beCalled).to.be.ok();
        });

        it('highlight item', function() {
            var input = $('#test'), item;
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [[0, 1]]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(1);
            expect(item.eq(0).text()).to.be('a');

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [[1, 2], [3, 4]]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(2);
            expect(item.eq(0).text()).to.be('b');
            expect(item.eq(1).text()).to.be('d');

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [[0, 1], [3, 7], [8, 9]]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(2);
            expect(item.eq(0).text()).to.be('a');
            expect(item.eq(1).text()).to.be('defg');

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [1, 4]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(2);
            expect(item.eq(0).text()).to.be('b');
            expect(item.eq(1).text()).to.be('e');

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [6, 8]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(1);
            expect(item.eq(0).text()).to.be('g');
        });

        it('clear', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            $('#test').val('a').keyup();

            ac._clear();
            expect(ac.$('[data-role=items]').html()).to.be('');
            expect(ac.items).to.be(null);
            expect(ac.currentItem).to.be(null);
            expect(ac.get('selectedIndex')).to.be(-1);
        });

        it('should set empty filter when asyc request #18', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: './data.json'
            }).render();

            expect(ac.get('filter')).to.be('');
        });

        xit('do not show when async #14', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: 'http://baidu.com'
            }).render();

            spyOn($, 'ajax').andCallFake(function(url) {
                return {
                    success: function(callback) {
                        setTimeout(function() {
                            callback(['abc', 'abd', 'cbd']);
                        }, 50);
                        return this;
                    },
                    error: function(callback) {
                        return this;
                    }
                };
            });

            var t = ac.element.html();

            $('#test').val('a').keyup();

            waitsFor(function() {
                return t !== ac.element.html();
            }, 'element changed', 750);

            runs(function() {
                expect(ac.get('visible')).to.be.ok();
                //spyOn($, 'ajax').andCallThrough();
            });

        });
    });

});

