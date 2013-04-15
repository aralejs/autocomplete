define(function(require) {

    var sinon = require('sinon');
    var expect = require('puerh');
    var DataSource = require('data-source');
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
            var spy = sinon.spy();
            var param = [1, 2, 3];
            var source = new DataSource({
                source: param
            }).on('data', spy).getData();
            expect(spy).to.be.called.withArgs(param);
        });

        it('type is object', function() {
            var spy = sinon.spy();
            var param = {
                data: 1
            };
            var source = new DataSource({
                source: param
            }).on('data', spy).getData();
            expect(spy).to.be.called.withArgs(param);
        });

        it('type is function', function() {
            var spy = sinon.spy();
            var source = new DataSource({
                source: function(q) {
                    return [
                        q + '@163.com'
                    ];
                }
            }).on('data', spy).getData('a');
            expect(spy).to.be.called.withArgs(['a@163.com']);
        });

        it('type is function return false', function() {
            var spy = sinon.spy();
            var source = new DataSource({
                source: function(q) {
                    return false;
                }
            }).on('data', spy).getData('a');
            expect(spy).not.to.be.called();
        });

        it('type is function async', function(done) {
            var spy = sinon.spy();
            var source = new DataSource({
                source: function(q, done) {
                    setTimeout(function() {
                        done();
                    }, 10);
                    return false;
                }
            }).on('data', spy).getData('a');

            setTimeout(function() {
                expect(spy).to.be.called();
                done();
            }, 500);
        });

        it('type is url', function() {
            var spy = sinon.spy();
            var stub = sinon.stub($, 'ajax').returns({
                success: function(callback) {
                  callback([1, 2, 3]);
                  return this;
                },
                error: function(callback) {
                }
            });

            var source = new DataSource({
                source: './test.json?q={{query}}'
            }).on('data', spy).getData('a');
            expect(stub).to.be.called.match('./test.json?q=a');
            expect(spy).to.be.called.withArgs([1, 2, 3]);
            stub.restore();
        });

        it('type is url when error', function() {
            var spy = sinon.spy();
            var stub = sinon.stub($, 'ajax').returns({
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
            }).on('data', spy).getData('a');
            expect(spy).to.be.called.withArgs({});
            stub.restore();
        });
        it('abort', function(done) {
            var stub = sinon.stub($, 'ajax').returns({
                success: function(callback) {
                    setTimeout(function() {
                        callback(['a']);
                    }, 10);
                    return this;
                },
                error: function(callback) {
                    return this;
                }
            });
            var source = new DataSource({
                source: './test.json?q={{query}}'
            });

            var spy = sinon.spy(source, '_done');

            source.getData('a');
            expect(source.callbacks.length).to.be(1);

            source.getData('a');
            expect(source.callbacks.length).to.be(2);

            source.abort();
            expect(source.callbacks.length).to.be(0);

            source.getData('a');
            expect(source.callbacks.length).to.be(1);

            setTimeout(function() {
                expect(spy).to.be.called.once();
                stub.restore();
                done();
            }, 500);
        });
    });

});

