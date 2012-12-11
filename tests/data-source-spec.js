define(function(require) {

    var DataSource = require('../src/data-source');
    var $ = require('$');

    describe('DataSource', function() {

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

        it('error type', function() {
            // not Boolean
            expect(function() {
                new DataSource({
                    source: true
                });
            }).to.throwError();

            // not Null
            expect(function() {
                new DataSource({
                    source: null
                });
            }).to.throwError();

            // not Undefined
            expect(function() {
                new DataSource({
                    source: undefined
                });
            }).to.throwError();

            // not DOM Element
            expect(function() {
                new DataSource({
                    source: document.body
                });
            }).to.throwError();
        });
        it('type is array', function() {
            var param = [1, 2, 3];
            var source = new DataSource({
                source: param
            }).on('data', function(data) {
                expect(data).to.eql(param);
            }).getData();
        });

        it('type is object', function() {
            var param = {
                data: 1
            };
            var source = new DataSource({
                source: param
            }).on('data', function(data) {
                expect(data).to.eql(param);
            }).getData();
        });

        it('type is function', function() {
            var source = new DataSource({
                source: function(q) {
                    return [
                        q + '@163.com'
                    ];
                }
            }).on('data', function(data) {
                expect(data).to.eql(['a@163.com']);
            }).getData('a');
        });

        it('type is function return false', function() {
            var beCalled = false;
            var source = new DataSource({
                source: function(q) {
                    return false;
                }
            }).on('data', function(data) {
                beCalled = true;
            }).getData('a');

            expect(beCalled).not.to.be.ok();
        });

        it('type is url', function() {
            var spy = sinon.stub($, 'ajax').returns({
                success: function(callback) {
                  callback([1, 2, 3]);
                  return this;
                },
                error: function(callback) {
                }
            });

            var source = new DataSource({
                source: './test.json?q={{query}}'
            }).on('data', function(data) {
                expect(data).to.eql([1, 2, 3]);
            }).getData('a');
            expect(spy).to.be.called.withArgs('./test.json?q=a');
            spy.restore();
        });

        it('type is url when error', function() {
            var spy = sinon.stub($, 'ajax').returns({
                success: function(callback) {
                    return this;
                },
                error: function(callback) {
                    callback();
                    return this;
                }
            });

            var source = new DataSource({
                source: './test.json?q={{query}}'
            }).on('data', function(data) {
                expect(data).to.eql({});
            }).getData('a');
            spy.restore();
        });
    });

});

