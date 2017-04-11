var distribuidores = require('../../models/distribuidores.js')
var config = require('../config.js')

// Obtener distribuidores
describe('distribuidores.obtener()', function () {
  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    distribuidores.obtener()
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    distribuidores.obtener()
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    distribuidores.obtener()
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// Barrer distribuidores
describe('distribuidores.barrerDistribuidores(distribuidoresERP)', function () {
  var distribuidoresERP = [ { RFC: 'SIP1508121Z2', IdERP: 'GF01605', NombreEmpresa: 'Sipser', Direccion: 'Los Paraisos', Ciudad: 'León', Estado: 'GTO', CodigoPostal: '37328', Activo: true, ZonaImpuesto: 'Normal'}, { RFC: 'YIS111114SE7', IdERP: 'MF00631', NombreEmpresa: 'Yellow It', Direccion: 'Mexico Toluca', Ciudad: 'Cuajimalpa De Morelos', Estado: 'DF', CodigoPostal: '05000', Activo: true, ZonaImpuesto: 'Normal' } ]

  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    distribuidores.barrerDistribuidores(distribuidoresERP)
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    distribuidores.barrerDistribuidores(distribuidoresERP)
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    distribuidores.barrerDistribuidores(distribuidoresERP)
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})

// Validar distribuidor
describe('distribuidores.valido(distribuidor)', function () {
  var distribuidor = {RFC: 'BEAS740403MC3', IdERP: 'GF00432', NombreEmpresa: 'Empresa', Direccion: 'Av. de las rosas 373', Ciudad: 'GDL', Estado: 'JAL', CodigoPostal: '45050', Activo: '1', ZonaImpuesto: 'Normal' }

  it('Debe regresar un obj con propiedad success === 1 y no === 0', function (done) {
    distribuidores.valido(distribuidor)
      .then(function (resultado) {
        expect(resultado).to.have.property('success').and.equal(1).and.not.equal(0)
        done()
      })
  })

  it('Debe regresar un obj con propiedad message de tipo String', function (done) {
    distribuidores.valido(distribuidor)
      .then(function (resultado) {
        expect(resultado).to.have.property('message').to.be.a('String')
        done()
      })
  })

  it('Debe regresar un obj con propiedad data', function (done) {
    distribuidores.valido(distribuidor)
      .then(function (resultado) {
        expect(resultado).to.have.property('data')
        done()
      })
  })
})
