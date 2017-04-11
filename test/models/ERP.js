var ERP = require('../../models/ERP.js')
var config = require('../config.js')

// Actualizar clientes
describe('ERP.Actualizar()', function () {
  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    ERP.Actualizar()
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    ERP.Actualizar()
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    ERP.Actualizar()
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})
