var facturas = require('../../models/facturas.js')
var config = require('../config.js')

// Generar
describe('facturas.Generar()', function () {
  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    facturas.Generar()
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    facturas.Generar()
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    facturas.Generar()
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// ObtenerPendientes
describe('facturas.ObtenerPendientes()', function () {
  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    facturas.ObtenerPendientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    facturas.ObtenerPendientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    facturas.ObtenerPendientes()
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// // BarrerPedidos
// describe('facturas.BarrerPedidos(pedidos)', function () {
//   var pedidos = { success: 1, message: 'Ok', data: [{ IdPedido: 1, Cliente: 'G000000', Credito: 100000, Proyecto: 'demo', UEN: 17, Moneda: 'Pesos', TipoCambio: 16.5, Total: 366.63, IVA: 58.66 }] }

//   it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
//     facturas.BarrerPedidos(pedidos)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad message de tipo String', function (done) {
//     facturas.BarrerPedidos(pedidos)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('message').to.be.a('String')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data', function (done) {
//     facturas.BarrerPedidos(pedidos)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('data')
//         done()
//       })
//   })
// })

// // Facturar
// describe('facturas.Facturar(factura)', function (params) {
//   var factura = { IdPedido: 1, Cliente: 'G000000', Credito: 100000, Proyecto: 'demo', UEN: 17, Moneda: 'Pesos', TipoCambio: 16.5, Total: 366.63, IVA: 58.66, Vencimiento: '2020-07-07' }

//   it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
//     facturas.Facturar(factura)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad message de tipo String', function (done) {
//     facturas.Facturar(factura)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('message').to.be.a('String')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data', function (done) {
//     facturas.Facturar(factura)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('data')
//         done()
//       })
//   })
// })

// // ObtenerDetalle
// describe('facturas.ObtenerDetalle(pedidoInsertado)', function (params) {
//   var pedidoInsertado = { ID: 1549678, Cliente: 'G000000', Proyecto: 'demo', Total: 366.63, IVA: 58.66, Moneda: 'Pesos', TipoCambio: 16.5, UEN: 17, CreditoDistribuidor: 100000, IdPedidoMarketPlace: 1, Mensaje: 'VENTA REGISTRADA' }

//   it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
//     facturas.ObtenerDetalle(pedidoInsertado)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad message de tipo String', function (done) {
//     facturas.ObtenerDetalle(pedidoInsertado)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('message').to.be.a('String')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data', function (done) {
//     facturas.ObtenerDetalle(pedidoInsertado)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('data')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data con una propiedad ID de tipo Number', function (done) {
//     facturas.ObtenerDetalle(pedidoInsertado)
//       .then(function (resultado) {
//         expect(resultado.data[0]).to.have.property('ID').to.be.a('Number')
//         done()
//       })
//   })
// })

// // BarrerDetalle
// describe('facturas.BarrerDetalle(pedidoDetalles)', function (params) {
//   var pedidoDetalles = { success: 1, message: 'Información actualizada.', data: [{ ID: 1549835, Articulo: '35a36-b80.', Cantidad: 1, Precio: null }] }

//   it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
//     facturas.BarrerDetalle(pedidoDetalles)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad message de tipo String', function (done) {
//     facturas.BarrerDetalle(pedidoDetalles)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('message').to.be.a('String')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data', function (done) {
//     facturas.BarrerDetalle(pedidoDetalles)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('data')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data y dentro un obj con propiedad success 1 o 0', function (done) {
//     facturas.BarrerDetalle(pedidoDetalles)
//       .then(function (resultado) {
//         expect(resultado.data).to.have.property('success').to.be.a('Number')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data y dentro un obj con propiedad message de tipo String', function (done) {
//     facturas.BarrerDetalle(pedidoDetalles)
//       .then(function (resultado) {
//         expect(resultado.data).to.have.property('message').to.be.a('String')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data y dentro un obj con propiedad data', function (done) {
//     facturas.BarrerDetalle(pedidoDetalles)
//       .then(function (resultado) {
//         expect(resultado.data).to.have.property('data')
//         done()
//       })
//   })
// })

// // GuardarDetalle
// describe('facturas.GuardarDetalle(pedidoDetalle)', function (params) {
//   var pedidoDetalle = { ID: 1549835, Articulo: '35a36-b80.', Cantidad: 1, Precio: null, RenglonID: 1, Renglon: 2048 }

//   it('Debe regresar un obj con propiedad success 1 o 0', function (done) {
//     facturas.GuardarDetalle(pedidoDetalle)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('success').to.be.a('Number')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad message de tipo String', function (done) {
//     facturas.GuardarDetalle(pedidoDetalle)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('message').to.be.a('String')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data', function (done) {
//     facturas.GuardarDetalle(pedidoDetalle)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('data')
//         done()
//       })
//   })
// })

// // ActualizarPedido
// describe('facturas.ActualizarPedido(pedido)', function (params) {
//   var pedido = { success: 1, message: 'Factura generada', data: { ID: 1550042, Cliente: 'G000000', Proyecto: 'demo', Total: 366.63, IVA: 58.66, Moneda: 'Pesos', TipoCambio: 16.5, UEN: 17, CreditoDistribuidor: 100000, IdPedidoMarketPlace: 1, Mensaje: 'VENTA REGISTRADA' } }

//   it('Debe regresar un obj con propiedad success 1 o 0', function (done) {
//     facturas.ActualizarPedido(pedido)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad message de tipo String', function (done) {
//     facturas.ActualizarPedido(pedido)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('message').to.be.a('String')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data', function (done) {
//     facturas.ActualizarPedido(pedido)
//       .then(function (resultado) {
//         expect(resultado).to.have.property('data')
//         done()
//       })
//   })

//   it('Debe regresar un obj con propiedad data y dentro affectedRows === 1', function (done) {
//     facturas.ActualizarPedido(pedido)
//       .then(function (resultado) {
//         expect(resultado.data.affectedRows).equal(1)
//         done()
//       })
//   })
// })
