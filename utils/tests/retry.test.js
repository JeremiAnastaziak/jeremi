const retry = require('../retry');
const delay = require('../delay');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('retry', () => {
    [-100, -1, 0].forEach(invalidRetryCount => {
        it('should re-throw error from rejected promise when retries count is lower or equal to zero', async () => {
            const rejectedPromise = () => Promise.reject('invalid input data');

            await retry(rejectedPromise, { retries: invalidRetryCount }).catch(
                err => {
                    expect(err).to.be.equal('invalid input data');
                }
            );
        });
    });

    it('should retry 3 times given function when exception occurs', async () => {
        const spy = sinon.spy(() => Promise.reject('error'));

        await retry(spy, { retries: 2, timeout: 10 }).catch(err => {});

        expect(spy.calledThrice).to.be.true;
    });

    it('should retry function after the time specified by timeout value', async () => {
        const spy = sinon.spy(() => Promise.reject('error'));
        const timeout = 10;

        retry(spy, { retries: 1, timeout }).catch(err => {});

        await delay(timeout / 2);
        expect(spy.callCount).to.be.equal(1);
        await delay(timeout);
        expect(spy.callCount).to.be.equal(2);
        await delay(timeout * 2);
        expect(spy.callCount).to.be.equal(2);
    });

    it('should return value if failing promise resolves', async () => {
        const calls = [
            () => Promise.reject('err'),
            () => Promise.reject('err'),
            () => Promise.resolve('val')
        ];
        let count = 0;
        let resolveSpy = sinon.spy();

        const fun = sinon.spy(() => calls[count++]());
        await retry(fun, { retries: 5 }).then(resolveSpy);

        sinon.assert.calledThrice(fun);
        sinon.assert.calledOnce(resolveSpy);
    });
});
