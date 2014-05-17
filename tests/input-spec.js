var $ = require('jquery');
var expect = require('expect.js');
var Input = require('../src/input');
var sinon = require('sinon');

describe('Input', function () {
  it('should trigger events when query changed', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var dom = $('<input id="example" type="text">').appendTo(document.body);
    var input = new Input({
      element: dom
    }).on('queryChanged', spy1).on('whitespaceChanged', spy2);

    input.setValue('a');
    expect(spy1.withArgs('a', '').called).to.be.ok();
    expect(spy2.called).not.to.be.ok();

    input.setValue('a ');
    expect(spy1.callCount).to.be(2);
    expect(spy2.called).not.to.be.ok();

    input.setValue('a  ');
    expect(spy1.callCount).to.be(2);
    expect(spy2.withArgs('a ').called).to.be.ok();

    input.destroy();
    dom.remove();
  });

  it('should trigger any events', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();
    var spy4 = sinon.spy();
    var spy5 = sinon.spy();
    var spy6 = sinon.spy();
    var spy7 = sinon.spy();
    var spy8 = sinon.spy();
    var spy9 = sinon.spy();
    var dom = $('<input id="example" type="text">').appendTo(document.body);
    var input = new Input({
      element: dom
    }).on('focus', spy1).on('blur', spy2).on('keyTab', spy3).on('keyEsc', spy4).on('keyUp', spy5).on('keyDown', spy6).on('keyLeft', spy7).on('keyRight', spy8).on('keyEnter', spy9);

    input.focus();
    dom.blur();
    triggerKeyEvent(dom, 9);
    triggerKeyEvent(dom, 13);
    triggerKeyEvent(dom, 27);
    triggerKeyEvent(dom, 37);
    triggerKeyEvent(dom, 38);
    triggerKeyEvent(dom, 39);
    triggerKeyEvent(dom, 40);

    expect(spy1.callCount).to.be(1);
    expect(spy2.callCount).to.be(1);
    expect(spy3.callCount).to.be(1);
    expect(spy4.callCount).to.be(1);
    expect(spy5.callCount).to.be(1);
    expect(spy6.callCount).to.be(1);
    expect(spy7.callCount).to.be(1);
    expect(spy8.callCount).to.be(1);
    expect(spy9.callCount).to.be(1);

    input.destroy();
    dom.remove();
  });
});

function triggerKeyEvent(el, keyCode) {
  var e = $.Event('keydown.autocomplete');
  e.which = keyCode;
  el.trigger(e);
}
