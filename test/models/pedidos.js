var pedidos = require('../../models/pedidos.js')
var config = require('../config.js')

// Obtener pagados
describe('pedidos.obtenerPagados()', function () {
  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    pedidos.obtenerPagados()
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    pedidos.obtenerPagados()
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    pedidos.obtenerPagados()
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// barrer pagados
describe('pedidos.barrerPagados(pagados)', function () {
  var pagados = [ { ID: 1543886, Cliente: 'M128373', Proyecto: null, Total: 8506, IVA: 1360.96, Moneda: 'Pesos', TipoCambio: 1, UEN: 17, CreditoDistribuidor: 0, IdPedidoMarketPlace: 51, Vencimiento: '0001-01-01T00:00:00', Mensaje: '' }, { ID: 1543833, Cliente: 'M128373', Proyecto: null, Total: 0, IVA: 0, Moneda: 'Pesos', TipoCambio: 1, UEN: 17, CreditoDistribuidor: 0, IdPedidoMarketPlace: 34, Vencimiento: '0001-01-01T00:00:00', Mensaje: '' } ]

  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    pedidos.barrerPagados(pagados)
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    pedidos.barrerPagados(pagados)
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    pedidos.barrerPagados(pagados)
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// Actualizar pedido
describe('pedidos.actualizarPedido(pedido)', function () {
  var pedido = { ID: 1543785, Cliente: 'G100057', Proyecto: null, Total: 170.12, IVA: 27.2192, Moneda: 'Pesos', TipoCambio: 1, UEN: 17, CreditoDistribuidor: 0, IdPedidoMarketPlace: 11, Vencimiento: '0001-01-01T00:00:00', Mensaje: '' }

  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    pedidos.actualizarPedido(pedido)
      .then(function (resultado) {
        expect(resultado).to.have.property('success').to.be.a('Number')
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    pedidos.actualizarPedido(pedido)
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    pedidos.actualizarPedido(pedido)
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})
