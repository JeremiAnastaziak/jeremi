const delay = require("../delay");
const expect = require("chai").expect;
const sinon = require("sinon");

describe("delay", () => {
  it("resolves after passed time", async () => {
    const resolveSpy = sinon.spy();
    const rejectSpy = sinon.spy();

    delay(300)
      .then(resolveSpy)
      .catch(rejectSpy);

    expect(resolveSpy.called).to.be.false;

    await delay(100);
    expect(resolveSpy.called).to.be.false;

    await delay(200);
    expect(resolveSpy.calledOnce).to.be.true;
    expect(rejectSpy.called).to.be.false;
  });

  it("rejects after passed time", async () => {
    const resolveSpy = sinon.spy();
    const rejectSpy = sinon.spy();

    delay(300, false)
      .then(resolveSpy)
      .catch(rejectSpy);

    expect(rejectSpy.called).to.be.false;

    await delay(100);
    expect(rejectSpy.called).to.be.false;

    await delay(200);
    expect(rejectSpy.calledOnce).to.be.true;
    expect(resolveSpy.called).to.be.false;
  });
});
