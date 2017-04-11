var credito = require('../../models/credito.js')
var config = require('../config.js')

// Actualizar clientes
describe('credito.actualizarClientes()', function () {
  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    credito.actualizarClientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    credito.actualizarClientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    credito.actualizarClientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// Obtener clientes
describe('credito.obtenerClientes()', function () {
  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    credito.obtenerClientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    credito.obtenerClientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    credito.obtenerClientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// Barrer clientes
describe('credito.barrerClientes(clientes)', function () {
  var clientes = { success: 1, message: 'Información actualizada.', data: [ { Cliente: 'G100090', Credito: 100000 }, { Cliente: 'G107000', Credito: 100000 } ] }

  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    credito.barrerClientes(clientes)
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    credito.barrerClientes(clientes)
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    credito.barrerClientes(clientes)
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// // Actualizar crédito
// // describe('credito.ActualizarCredito(cliente, credito)', function () {
// //   var cliente = 'G107000'
// //   var credito = 100000

// //   it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
// //     credito.ActualizarCredito(cliente, credito)
// //       .then(function (resultado) {
// //         console.log(resultado)
// //         expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
// //         done()
// //       })
// //   })

// //     it('Debe regresar un obj con propiedad message de tipo String', function (done) {
// //       credito.ActualizarCredito(cliente, credito)
// //         .then(function (resultado) {
// //           expect(resultado).to.have.property('message').to.be.a('String')
// //           done()
// //         })
// //     })

// //     it('Debe regresar un obj con propiedad data', function (done) {
// //       credito.ActualizarCredito(cliente, credito)
// //         .then(function (resultado) {
// //           expect(resultado).to.have.property('data')
// //           done()
// //         })
// //     })

// // })