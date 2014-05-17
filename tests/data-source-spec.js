var sinon = require('sinon');
var expect = require('expect.js');
var DataSource = require('../src/data-source');
var $ = require('jquery');

describe('DataSource', function () {

  var data;

  beforeEach(function () {
    data = ['about', 'abuse', 'but', 'buffter'];
  });

  afterEach(function () {
    data = null;
  });

  it('error type', function () {
    // not Boolean
    expect(function () {
      new DataSource({
        source: true
      });
    }).to.throwError();

    // not Null
    expect(function () {
      new DataSource({
        source: null
      });
    }).to.throwError();

    // not Undefined
    expect(function () {
      new DataSource({
        source: undefined
      });
    }).to.throwError();

    // not DOM Element
    expect(function () {
      new DataSource({
        source: document.body
      });
    }).to.throwError();
  });
  it('type is array', function () {
    var spy = sinon.spy();
    var param = [1, 2, 3];
    new DataSource({
      source: param
    }).on('data', spy).getData();
    expect(spy.withArgs(param).called).to.be.ok();
  });

  it('type is object', function () {
    var spy = sinon.spy();
    var param = {
      data: 1
    };
    new DataSource({
      source: param
    }).on('data', spy).getData();
    expect(spy.withArgs(param).called).to.be.ok();
  });

  it('type is function', function () {
    var spy = sinon.spy();
    new DataSource({
      source: function (q) {
        return [
        q + '@163.com'];
      }
    }).on('data', spy).getData('a');
    expect(spy.withArgs(['a@163.com']).called).to.be.ok();
  });

  it('type is function return false', function () {
    var spy = sinon.spy();
    new DataSource({
      source: function () {
        return false;
      }
    }).on('data', spy).getData('a');
    expect(spy.called).not.to.be.ok();
  });

  it('type is function async', function (done) {
    var spy = sinon.spy();
    new DataSource({
      source: function (q, done) {
        setTimeout(function () {
          done();
        }, 10);
        return false;
      }
    }).on('data', spy).getData('a');

    setTimeout(function () {
      expect(spy.called).to.be.ok();
      done();
    }, 500);
  });

  it('type is url', function () {
    var spy = sinon.spy();
    var stub = sinon.stub($, 'ajax').returns({
      success: function (callback) {
        callback([1, 2, 3]);
        return this;
      },
      error: function () {}
    });

    new DataSource({
      source: './test.json?q={{query}}'
    }).on('data', spy).getData('a');
    expect(stub.calledWithMatch('./test.json?q=a')).to.be.ok();
    expect(spy.withArgs([1, 2, 3]).called).to.be.ok();
    stub.restore();
  });

  it('type is url when error', function () {
    var spy = sinon.spy();
    var stub = sinon.stub($, 'ajax').returns({
      success: function () {
        return this;
      },
      error: function (callback) {
        callback();
        return this;
      }
    });

    new DataSource({
      source: './test.json?q={{query}}'
    }).on('data', spy).getData('a');
    expect(spy.withArgs({}).called).to.be.ok();
    stub.restore();
  });
  it('abort', function (done) {
    var stub = sinon.stub($, 'ajax').returns({
      success: function (callback) {
        setTimeout(function () {
          callback(['a']);
        }, 10);
        return this;
      },
      error: function () {
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

    setTimeout(function () {
      expect(spy.calledOnce).to.be.ok();
      stub.restore();
      done();
    }, 500);
  });
});