const chai = require('chai'); // eslint-disable-line import/no-extraneous-dependencies
const chaiAsPromised = require('chai-as-promised'); // eslint-disable-line import/no-extraneous-dependencies
chai.use(chaiAsPromised);
const expect = chai.expect;

const auxiliaries = require('../auxiliaries');

const getExchangeRatesFromApi = () => {
  const fakeRequest = () => (
    Promise.resolve('' + JSON.stringify([{
      DolarMS: 10,
      Dolar: 11,
    }]))
  );
  return expect(auxiliaries.getLatestExchangeRatesERP(fakeRequest)).to.eventually.be.an('Object');
};

const getExchangeRatesFromApi2 = () => {
  const fakeRequest = (options) => {
    expect(options).to.have.property('uri').and.be.equal('http://localhost:54228/TipoCambio');
    return Promise.resolve('' + JSON.stringify([{
      DolarMS: 10,
      Dolar: 11,
    }]));
  };
  return expect(auxiliaries.getLatestExchangeRatesERP(fakeRequest)).to.eventually.be.an('Object');
};


describe('Syncronize-exchange-rates -> getLatestExchangeRatesERP()', () => {
  it('should return exchange rates from external api', getExchangeRatesFromApi);
  it('should call the right external route', getExchangeRatesFromApi2);
});

