var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var chai = require('chai').use(chaiAsPromised)

chai.config.includeStack = true
global.expect = chai.expect
global.AssertionError = chai.AssertionError
global.Assertion = chai.Assertion
global.assert = chai.assert

// para correr las pruebas usar: mocha test --recursive --watch
// para ver más casos de prueba: http://chaijs.com/api/bdd/