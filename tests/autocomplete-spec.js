define(function(require) {

    var sinon = require('sinon');
    var expect = require('puerh');
    var AutoComplete = require('autocomplete');
    var $ = require('$');

    AutoComplete._filter.test = function() {
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

            ac.setInputValue('a');

            expect(ac.get('data')).to.eql([
                {matchKey: 'abc', highlightIndex: [[0, 1]]},
                {matchKey: 'abd', highlightIndex: [[0, 1]]}
            ]);
        });

        it('should hide when empty', function() {
            var input = $('#test');
            input.val('a');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            ac.setInputValue('');

            expect(ac.get('visiable')).not.to.be.ok();
            expect(ac.get('inputValue')).to.be('');
        });

        it('should not call "getData" when empty', function() {
            var input = $('#test');
            input.val('a');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            var getData = sinon.spy(ac.dataSource, 'getData');

            ac.setInputValue('');
            expect(getData).not.to.be.called();

            ac.setInputValue('a');
            expect(getData).to.be.called();
            getData.restore();
        });

        it('render', function() {
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            ac.setInputValue('a');

            expect(ac.items.eq(0).data('value')).to.be('abc');
            expect(ac.items.eq(0).text()).to.be('abc');
            expect(ac.items.eq(0).find('.ui-autocomplete-item-hl').text()).to.be('a');
            expect(ac.items.eq(1).data('value')).to.be('abd');
            expect(ac.items.eq(1).text()).to.be('abd');
            expect(ac.items.eq(1).find('.ui-autocomplete-item-hl').text()).to.be('a');
        });

        describe('inputValue', function() {
            it('should be called when value changed', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                var spy = sinon.spy(ac, '_onRenderInputValue');

                ac.setInputValue('a');
                expect(spy).to.be.called.withArgs('a');
                expect(spy).to.be.called.once();

                ac._keyupEvent.call(ac);
                expect(spy).to.be.called.once();

                ac.setInputValue('ab');
                expect(spy).to.be.called.withArgs('ab');
                expect(spy).to.be.called.twice();

                ac.setInputValue('a');
                expect(spy).to.be.called.withArgs('a');
                expect(spy).to.be.called.thrice();
                spy.restore();
            });

            it('should filter the input', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    inputFilter: function(val) {
                        return 'filter-' + val;
                    },
                    dataSource: ['abc', 'abd', 'cbd']
                }).render();

                var spy = sinon.spy(ac.dataSource, 'getData');

                ac.setInputValue('a');
                expect(spy).to.be.called.withArgs('filter-a');
                expect(spy).to.be.called.once();

                ac.setInputValue('');
                expect(spy).to.be.called.once();
                spy.restore();
            });
        });

        describe('data locator', function() {
            it('should support string', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: {
                        test: ['abc', 'abd', 'cbd']
                    },
                    locator: 'test'
                }).render();

                ac.setInputValue('a');
                expect(ac.get('data')).to.eql([
                    {matchKey: 'abc', highlightIndex: [[0, 1]]},
                    {matchKey: 'abd', highlightIndex: [[0, 1]]}
                ]);
            });

            it('should support dot string', function() {
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

                ac.setInputValue('a');
                expect(ac.get('data')).to.eql([
                    {matchKey: 'abc', highlightIndex: [[0, 1]]},
                    {matchKey: 'abd', highlightIndex: [[0, 1]]}
                ]);
            });

            it('should support function', function() {
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

                ac.setInputValue('a');
                expect(ac.get('data')).to.eql([
                    {matchKey: 'abc', highlightIndex: [[0, 1]]},
                    {matchKey: 'abd', highlightIndex: [[0, 1]]}
                ]);
            });
        });

        it('should be hide when trigger blur #26', function() {
            if ($.browser.msie) return;
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc']
            }).render();
            ac.setInputValue('a');
            input.blur();

            expect(ac.get('visible')).not.to.be.ok();
        });

        it('should be hide when mousedown #26', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc']
            }).render();
            ac.setInputValue('a');
            ac.items.eq(0).mousedown();

            expect(ac.get('visible')).not.to.be.ok();
        });

        it('should not be hide when mousedown #26', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                template: '<div><p data-role="other">a</p><ul data-role="items">{{#each items}}<li data-role="item">{{matchKey}}</li>{{/each}}</ul></div>',
                dataSource: ['abc']
            }).render();
            ac.setInputValue('a');
            expect(ac.get('visible')).to.be.ok();
            ac.element.find('[data-role=other]').mousedown();

            expect(ac.get('visible')).to.be.ok();
        });

        describe('filter', function() {
            it('should be "startsWith" by default', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: []
                });

                var filter = ac.get('filter');

                expect(filter.name).to.eql('startsWith');
                expect(filter.options.key).to.eql("value");
            });
            it('should be "default" when ajax by default', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    dataSource: './data.json'
                });

                expect(ac.get('filter').name).to.eql('default');
            });
            it('should be "default" when "", null, false', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: '',
                    dataSource: []
                });

                expect(ac.get('filter').name).to.eql('default');
            });
            it('should support string', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: 'test',
                    dataSource: []
                });

                expect(ac.get('filter').name).to.eql('test');
            });

            it('should support string but not exist', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: 'notExist',
                    dataSource: []
                });

                expect(ac.get('filter').name).to.eql('default');
            });
            it('should support function', function() {
                var input = $('#test');
                var func = function() {};
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: func,
                    dataSource: []
                });

                expect(ac.get('filter')).to.eql({
                    func: func
                });
            });
            it('should support object', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: {
                        name: 'startsWith',
                        options: {
                            key: 'title'
                        }
                    },
                    dataSource: []
                });

                expect(ac.get('filter').name).to.eql('startsWith');
            });
            it('should support object but not exist', function() {
                var input = $('#test');
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: {
                        name: 'notExist'
                    },
                    dataSource: []
                });

                expect(ac.get('filter').name).to.eql('default');
            });
            it('should be called with 3 param', function() {
                var input = $('#test');
                var spy = sinon.spy();
                AutoComplete._filter.filter = spy;
                ac = new AutoComplete({
                    trigger: '#test',
                    filter: {
                        name: 'filter',
                        options: {
                            key: 'value'
                        }
                    },
                    dataSource: ['abc']
                }).render();

                ac.setInputValue('a');
                expect(spy).to.be.called.withArgs(['abc'], 'a', {key: 'value'});
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

            ac.setInputValue('a');
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
            delete ac.oldInput;

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [[1, 2], [3, 4]]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(2);
            expect(item.eq(0).text()).to.be('b');
            expect(item.eq(1).text()).to.be('d');
            delete ac.oldInput;

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [[0, 1], [3, 7], [8, 9]]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(2);
            expect(item.eq(0).text()).to.be('a');
            expect(item.eq(1).text()).to.be('defg');
            delete ac.oldInput;

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [1, 4]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(2);
            expect(item.eq(0).text()).to.be('b');
            expect(item.eq(1).text()).to.be('e');
            delete ac.oldInput;

            ac.set('data', [
                {matchKey: 'abcdefg', highlightIndex: [6, 8]}
            ]);
            item = ac.$('[data-role=item]')
                .eq(0)
                .find('.ui-autocomplete-item-hl');
            expect(item.length).to.be(1);
            expect(item.eq(0).text()).to.be('g');
            delete ac.oldInput;
        });

        it('clear', function() {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            ac.setInputValue('a');

            ac._clear();
            expect(ac.$('[data-role=items]').html()).to.be('');
            expect(ac.items).to.be(undefined);
            expect(ac.currentItem).to.be(undefined);
            expect(ac.currentItem).to.be(undefined);
            expect(ac.get('selectedIndex')).to.be(-1);
        });

        it('do not show when async #14', function(done) {
            var input = $('#test');
            ac = new AutoComplete({
                trigger: '#test',
                dataSource: 'http://baidu.com'
            }).render();

            var spy = sinon.stub($, 'ajax').returns({
                success: function(callback) {
                    setTimeout(function() {
                      callback(['abc', 'abd', 'cbd']);
                    }, 50);
                    return this;
                },
                error: function(callback) {
                }
            });

            var t = ac.element.html();

            ac.setInputValue('a');

            setTimeout(function() {
                expect(ac.get('visible')).to.be.ok();
                spy.restore();
                done();
            }, 50);

        });

        it('should support selectFirst', function() {
            ac = new AutoComplete({
                trigger: '#test',
                selectFirst: true,
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            ac.setInputValue('a');
            expect(ac.get('selectedIndex')).to.be(0);


        });

        it('should show when same value', function() {
            ac = new AutoComplete({
                trigger: '#test',
                selectFirst: true,
                dataSource: ['abc', 'abd', 'cbd']
            }).render();

            ac.setInputValue('a');
            expect(ac.get('visible')).to.be.ok();

            ac.setInputValue('');
            expect(ac.get('visible')).not.to.be.ok();

            ac.setInputValue('a');
            expect(ac.get('visible')).to.be.ok();
        });
    });

});

