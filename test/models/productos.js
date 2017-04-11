var productos = require('../../models/productos.js')
var config = require('../config.js')

// Obtener productos
describe('productos.obtener()', function () {
  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    productos.obtener()
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    productos.obtener()
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    productos.obtener()
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// Barrer productos
describe('productos.barrerProductos(productosERP)', function () {
  var productosERP = [ { IdERP: 'ff7a4-f5b.', Nombre: 'SharePoint Online (Plan 1)', Descripcion: 'SharePoint Online (Plan 1)', IdFabricante: 1, PrecioNormal: 5, MonedaPrecio: 'Dólares', IdTipoProducto: 2, Activo: true, Visible: true, IdProductoFabricante: '/3c95518e-8c37-41e3-9627-0ca339200f53/offers/ff7a4f5b-4973-4241-8c43-80f2be39311d', CantidadMinima: 1, CantidadMaxima: 250 }, { IdERP: 'ffb8b-b89.', Nombre: 'Microsoft Dynamics CRM Online Basic', Descripcion: 'Microsoft Dynamics CRM Online Basic', IdFabricante: 1, PrecioNormal: 30, MonedaPrecio: 'Dólares', IdTipoProducto: 2, Activo: true, Visible: true, IdProductoFabricante: '/cfc0e4c1-1502-4590-bb76-6209e7304ce6/offers/ffb8bb89-9573-4e76-840f-6521450325a1', CantidadMinima: 5, CantidadMaxima: 250 } ]

  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    productos.barrerProductos(productosERP)
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    productos.barrerProductos(productosERP)
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    productos.barrerProductos(productosERP)
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// Validar productos
describe('productos.valido(producto)', function () {
  var producto = { IdERP: 'ff7a4-f5b.', Nombre: 'SharePoint Online (Plan 1)', Descripcion: 'SharePoint Online (Plan 1)', IdFabricante: 1, PrecioNormal: 5, MonedaPrecio: 'Dólares', IdTipoProducto: 2, Activo: true, Visible: true, IdProductoFabricante: '/3c95518e-8c37-41e3-9627-0ca339200f53/offers/ff7a4f5b-4973-4241-8c43-80f2be39311d', CantidadMinima: 1, CantidadMaxima: 250 }

  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    productos.valido(producto)
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    productos.valido(producto)
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    productos.valido(producto)
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})
