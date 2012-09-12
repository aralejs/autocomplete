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

        test('error type', function() {
            // not Boolean
            expect(function() {
                new DataSource({
                    source: true
                });
            }).toThrow();

            // not Null
            expect(function() {
                new DataSource({
                    source: null
                });
            }).toThrow();

            // not Undefined
            expect(function() {
                new DataSource({
                    source: undefined
                });
            }).toThrow();

            // not DOM Element
            expect(function() {
                new DataSource({
                    source: document.body
                });
            }).toThrow();
        });
        test('type is array', function() {
            var param = [1, 2, 3];
            var source = new DataSource({
                source: param
            }).on('data', function(data) {
                expect(data).toEqual(param);
            }).getData();
        });

        test('type is object', function() {
            var param = {
                data: 1
            };
            var source = new DataSource({
                source: param
            }).on('data', function(data) {
                expect(data).toEqual(param);
            }).getData();
        });

        test('type is function', function() {
            var source = new DataSource({
                source: function(q) {
                    return [
                        q + '@163.com'
                    ];
                }
            }).on('data', function(data) {
                expect(data).toEqual(['a@163.com']);
            }).getData('a');
        });

        test('type is function return false', function() {
            var beCalled = false;
            var source = new DataSource({
                source: function(q) {
                    return false;
                }
            }).on('data', function(data) {
                beCalled = true;
            }).getData('a');

            expect(beCalled).toBeFalsy();
        });

        test('type is url', function() {
            spyOn($, 'ajax').andCallFake(function(url) {
                expect(url).toBe('./test.json?q=a');
                return {
                    success: function(callback) {
                        callback([1, 2, 3]);
                        return this;
                    },
                    error: function(callback) {
                    }
                };
            });
            var beCalled = false;
            var source = new DataSource({
                source: './test.json?q={{query}}'
            }).on('data', function(data) {
                expect(data).toEqual([1, 2, 3]);
            }).getData('a');
        });

        test('type is url when error', function() {
            spyOn($, 'ajax').andCallFake(function(url) {
                expect(url).toBe('./test.json?q=a');
                return {
                    success: function(callback) {
                        return this;
                    },
                    error: function(callback) {
                        callback();
                        return this;
                    }
                };
            });
            var beCalled = false;
            var source = new DataSource({
                source: './test.json?q={{query}}'
            }).on('data', function(data) {
                expect(data).toEqual({});
            }).getData('a');
        });
    });

});

