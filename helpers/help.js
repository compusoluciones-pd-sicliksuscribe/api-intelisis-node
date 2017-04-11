'use strict';

/* IIFE Result para protejer mi Framework */
(function (global) {
  /* Objeto que regresa el objeto principal */
  var Result = function (success, message, data) {
    return new Result.Init(success, message, data);
  };

  /* Funciones del prototipo */
  Result.prototype = {
    /* Validar */
    validate: function () {
      /* Validar success */
      if (this.success || this.success === 0) {
        if (!(typeof this.success === 'number' && (this.success === 0 || this.success === 1))) {
          throw new Error('success format is invalid!');
        }
      } else {
        throw new Error('success invalid!');
      }

      /* Validar message */
      if (this.message) {
        // console.log(this.message);
        if (!(typeof this.message === 'string')) {
          
          throw new Error('message format is invalid!');
        }
      } else {
        throw new Error('message invalid!');
      }

      return this; /* return this; para poder encadenar esta función con una función padre */
    },

    /* Actualizar variables */
    setSuccess: function (success) {
      this.success = success || 0;
      this.validate();
      return this; /* return this; para poder encadenar esta función con una función padre */
    },
    setMessage: function (message) {
      this.message = message || '';
      this.validate();
      return this; /* return this; para poder encadenar esta función con una función padre */
    },
    setData: function (data) {
      this.data = data || null;
      this.validate();
      return this; /* return this; para poder encadenar esta función con una función padre */
    },

    /* Obtener variables individuales */
    getSuccess: function () {
      return this.success;
    },
    getMessage: function () {
      return this.message;
    },
    getData: function () {
      return this.data;
    },

    /* Obtener todos las variables o un JSON */
    get: function () {
      return this; /* return this; para poder encadenar esta función con una función padre */
    },
    toJson: function () {
      return JSON.stringify(this);
    },

    /* imprimir en consola */
    log: function () {
      if (console) {
        console.log('r$ = success: ' + this.success + ', message: ' + this.message + ', data: ' + this.data);
      }

      return this; /* return this; para poder encadenar esta función con una función padre */
    },

  };

  /* Objeto principal y su inicialización y valores default en caso de que no se manden por parametro */
  Result.Init = function (success, message, data) {
    var self = this;

    self.success = success || 0;
    self.message = message || '';
    self.data = data || null;

    self.validate();
  };

  /* Al objeto "Result.Init" le pongo el prototipo de "Result", el cual trae todas las funciones del Framework */
  Result.Init.prototype = Result.prototype;

  /* Pongo en el global las variables "Result" y "R$" y las pongo igual que el objeto "Result" */
  global.Result = global.result = global.r$ = Result;
} (this)); /* Paso objeto window del global para usarlo en mi IIFE */

/*
// IIFE para operaciones en base de datos
*/

/* IIFE MySQL para protejer mi Framework */
(function (global, r$) {
  /* libreria de Q para poder usar promesas */
  const Q = require('q');
  /* aquí traemos la configuración de base de datos */
  const config = require('../config.js');

  /* Objeto que regresa el objeto principal */
  var MySql = function () { return new MySql.Init(); };

  /* Función que utiliza el framework para validar la tabla o los parametros, esta no es accedida por el publico */
  function validateQuery(table, params) {
    if (table) { if (!(typeof table === 'string')) { throw new Error('table format is invalid!'); } } else { throw new Error('table invalid!'); }

    if (params) { if (!(typeof params === 'object')) { throw new Error('params format is invalid!'); } }
  }

  /* Funciones del prototipo, estas funciones si son accedidas por el público */
  MySql.prototype = {
    callStoredProcedure: function (storedProcedure, params, callback) {
      validateQuery(storedProcedure, params); /* Valido que los datos enviados por parametros sean correctos */

      var promise; /* Esta es mi variable para la promesa */
      var questionMarks, query = '';
      var keyLength = Object.keys(params).length;
      var parameters = [];
      var count = 1;

      /* Estructuro el query y los parametros para ejecutarlo */
      for (var param in params) {
        parameters.push(params[param]);

        if (questionMarks) {
          if (count === keyLength) { questionMarks = questionMarks + '?);'; } else { questionMarks = questionMarks + '?,'; }
        } else {
          if (count === keyLength) { questionMarks = ' (?);'; } else { questionMarks = ' (?,'; }
        }

        count++;
      }

      /* Armo el query final */
      if (questionMarks) { query = 'CALL ' + storedProcedure + questionMarks; } else { query = 'CALL ' + storedProcedure + '();'; }

      if (callback) {
        /* Ejecuto el query con la función de query */
        this.query(query, parameters, callback);
      } else {
        /* Si no trae función entonces igualamos a deferred ya que ahí traera el resultado de la promesa */
        promise = this.query(query, parameters);
      }

      return promise; // Regreso mi objeto de promesa
    },
    /* FUNCIÓN QUERY */
    query: function (query, params, callback) {
      /* Valido primero los parametros que recibe la función */
      validateQuery(query, params);
      /*
      console.log('');
      console.log('-- Query --------------------------------------------------');
      console.log(query); console.log(params); // Muestro la consulta en la consola
      console.log('-----------------------------------------------------------');
      console.log('');
      */
      /* Esta es mi variable para las promesas */
      var deferred = Q.defer();
      /* Me conecto a la base de datos y obtengo el objeto connection donde se encuentran todas las conexiones del pool */
      config.connectionPool.getConnection(function (error, connection) {
        /* en caso de error lo mando en pantalla */
        if (error) { throw error; }
        /* Si traigo la conexión me conecto */
        if (connection) {
          /* Me conecto a la base de datos */
          connection.connect();
          /* Ejecuto el query con sus parametros */
          connection.query(query, params, function (error, rows) {
            /* libero la conexión para que pueda ser usada por otro query */
            // connection.release();
            connection.destroy();
            connection.release();
            // if (connection) { connection.destroy(); }
            /* Valido la respuesta de la base de datos si el desarrollador uso callbacks regreso un callback, si uso promesas, regreso la promesa */
            if (error) {
              /* libero la conexión para que pueda ser usada por otro query */
              // connection.release();
              if (connection) { connection.destroy(); }
              if (callback) { callback(r$(0, error.toString(), null)); } else { deferred.reject(r$(0, error.toString(), error)); }
              /* en caso de error lo mando en pantalla */
              // throw error; // Lo comento para poder manejarlo como promesa
            } else {
              /* Valido si trae rows de resultado valido la longitud */
              if (rows) {
                if (rows.length !== 0) {
                  if (callback) { callback(r$(1, 'Información actualizada.', rows)); } else { deferred.resolve(r$(1, 'Información actualizada.', rows)); }
                } else {
                  if (callback) { callback(r$(1, 'No se obtuvieron registros.', rows)); } else { deferred.resolve(r$(1, 'No se obtuvieron registros.', rows)); }
                }
              } else {
                if (callback) { callback(r$(1, 'No se obtuvieron resultados.', rows)); } else { deferred.reject(r$(1, 'No se obtuvieron resultados.', rows)); }
              }
            }
          });
        } else {
          if (error) {
            if (callback) { callback(r$(0, error.toString(), null)); } else { deferred.reject(r$(0, error.toString(), error)); }
          } else {
            if (callback) { callback(r$(0, 'Sin conexión a la base de datos', null)); } else { deferred.reject(r$(0, 'Sin conexión a la base de datos', null)); }
          }
        }
      });

      return deferred.promise;
    },
    /* FUNCIÓN IF EXISTS QUE REGRES TRU O FALSE */
    ifexists: function (query, parameters, callback) {
      /* Valido el query */
      validateQuery(query, parameters);

      var promise; /* variable para la promesa */
      /* En caso de traer ";" lo reemplazo por un espacio vacio */
      query = query.replace(';', '');
      /* formo el query if exists */
      var queryExists = 'SELECT CASE WHEN EXISTS (' + query + ') THEN 1 ELSE 0 END AS Existe;';

      if (callback) {
        /* Ejecuto el query con la función de query */
        this.query(queryExists, parameters, callback);
      } else {
        /* Si no trae función entonces igualamos a deferred ya que ahí traera el resultado de la promesa */
        promise = this.query(queryExists, parameters);
      }

      return promise; /* Regreso mi objeto de promesa */
    },
    /* FUNCIÓN INSERT */
    insert: function (table, params, callback) {
      validateQuery(table, params); /* Valido que los datos enviados por parametros sean correctos */

      var promise; /* variable para la promesa */
      var questionMarks = '';
      var query = '';
      var columns = '';
      var keyLength = Object.keys(params).length;
      var parameters = [];
      var count = 1;

      /* Estructuro el query y los parametros para ejecutarlo */
      for (var param in params) {
        parameters.push(params[param]);

        if (questionMarks && columns) {
          if (count === keyLength) {
            columns = columns + param + ')';
            questionMarks = questionMarks + '?);';
          } else {
            columns = columns + param + ', ';
            questionMarks = questionMarks + '?,';
          }
        } else {
          if (count === keyLength) {
            columns = ' (' + param + ')';
            questionMarks = ' VALUES ( ? );';
          } else {
            columns = ' (' + param + ', ';
            questionMarks = ' VALUES (?,';
          }
        }

        count++;
      }

      /* Armo el query final */
      query = 'INSERT INTO ' + table + columns + questionMarks;

      if (callback) {
        /* Ejecuto el query con la función de query */
        this.query(query, parameters, callback);
      } else {
        /* Si no trae función entonces igualamos a deferred ya que ahí traera el resultado de la promesa */
        promise = this.query(query, parameters);
      }

      return promise; /* Regreso mi objeto de promesa */
    },
    /* FUNCIÓN UPDATE */
    update: function (table, params, where, callback) {
      validateQuery(table, params); /* Valido que los datos enviados por parametros sean correctos */

      /* Esta es mi variable para la promesa */
      var promise;
      var query = '';
      var columns = '';
      var filter = '';
      var keyLength = Object.keys(params).length;
      var parameters = [];
      var count = 1;

      /* Estructuro el query y los parametros para ejecutarlo */
      for (var param in params) {
        parameters.push(params[param]);

        if (columns) {
          if (count === keyLength) { columns = columns + param + ' = ? '; } else { columns = columns + param + ' = ?, '; }
        } else {
          if (count === keyLength) { columns = ' SET ' + param + ' = ? '; } else { columns = ' SET ' + param + ' = ?, '; }
        }

        if (count === keyLength) {
          var count2 = 1;
          var keyLength2 = Object.keys(where).length;

          for (var wh in where) {
            parameters.push(where[wh]);

            if (filter) {
              if (count2 === keyLength2) { filter = filter + ' ' + wh + ' = ?;'; } else { filter = filter + ' ' + wh + ' = ? AND'; }
            } else {
              if (count2 === keyLength2) { filter = 'WHERE ' + wh + ' = ?;'; } else { filter = 'WHERE ' + wh + ' = ? AND'; }
            }

            count2++;
          }
        }

        count++;
      }

      /* Armo el query final */
      if (filter) { query = 'UPDATE ' + table + columns + filter; } else { query = 'UPDATE ' + table + columns; }

      if (callback) {
        /* Ejecuto el query con la función de query */
        this.query(query, parameters, callback);
      } else {
        /* Si no trae función entonces igualamos a deferred ya que ahí traera el resultado de la promesa */
        promise = this.query(query, parameters);
      }

      return promise; /* Regreso mi objeto de promesa */
    },
    /* FUNCIÓN DELETE */
    delete: function (table, where, callback) {
      validateQuery(table, where); /* Valido que los datos enviados por parametros sean correctos */

      var promise; /* Esta es mi variable para la promesa */
      var query = '';
      var filter = '';
      var keyLength = Object.keys(where).length;
      var parameters = [];
      var count = 1;

      for (var wh in where) {
        parameters.push(where[wh]);

        if (filter) {
          if (count === keyLength) { filter = filter + ' ' + wh + ' = ?;'; } else { filter = filter + ' ' + wh + ' = ? AND'; }
        } else {
          if (count === keyLength) { filter = ' WHERE ' + wh + ' = ?;'; } else { filter = ' WHERE ' + wh + ' = ? AND'; }
        }

        count++;
      }

      if (filter) { query = 'DELETE FROM ' + table + filter; } else { query = 'DELETE FROM ' + table; }

      if (callback) {
        /* Ejecuto el query con la función de query */
        this.query(query, parameters, callback);
      } else {
        /* Si no trae función entonces igualamos a deferred ya que ahí traera el resultado de la promesa */
        promise = this.query(query, parameters);
      }

      return promise; /* Regreso mi objeto de promesa */
    },

    now: function () {
      function prepararDigitos(digit) {
        if (digit >= 0 && digit < 10) return '0' + digit.toString();
        return digit.toString();
      }

      var today = new Date();

      var todayMySql = today.getFullYear() + '-' +
        prepararDigitos(today.getMonth() + 1) + '-' +
        prepararDigitos(today.getDate()) + ' ' +
        prepararDigitos(today.getHours()) + ':' +
        prepararDigitos(today.getMinutes()) + ':' +
        prepararDigitos(today.getSeconds());

      return todayMySql;
    },

    log: function () {
      /* Imprimo en consola la conexión */
      if (console) { console.log(this); }

      return this; /* return this; para poder encadenar esta función con una función padre */
    },

  };

  /* Objeto principal y su inicialización y valores default en caso de que no se manden por parametro, además se crea la conexión */
  MySql.Init = function i() { };

  /* Al objeto "MySql.Init" le pongo el prototipo del objeto "MySql", el cual trae todas las funciones del Framework dentro del IIFE */
  MySql.Init.prototype = MySql.prototype;

  global.MySql = global.mysql = global.d$ = MySql;
} (this, this.r$)); /* Paso objeto window del global para usarlo en mi IIFE */

/*
// IFIEE para encriptación
*/

/* IIFE Crypto para protejer mi Framework */
(function (global) {
  const nodecrypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'Cryp70CsD3s@rr01103x73rn0C0mpuS0lu10n32@24052016';

  /* Objeto que regresa el objeto principal */
  var Crypto = function () { return new Crypto.Init(); };

  /* Si no es string fuerzo a que sea string para poderlo encriptar, si no lo dejo igual */
  function validateString(obj) {
    if (obj) {
      if (!(typeof obj === 'string')) { return obj.toString(); } else { return obj; }
    } else { return ''; }
  }

  /* Funciones del prototipo */
  Crypto.prototype = {
    /* Encriptar */
    encrypt: function (text) {
      try {
        text = validateString(text);
        if (text) {
          var cipher = nodecrypto.createCipher(algorithm, password);
          var crypted = cipher.update(text, 'utf8', 'hex');
          crypted += cipher.final('hex');
          return crypted;
        } else {
          return '';
        }
      } catch (error) {
        return '';
      }
    },

    /* Desencriptar */
    decrypt: function (text) {
      try {
        if (text) {
          var decipher = nodecrypto.createDecipher(algorithm, password);
          var dec = decipher.update(text, 'hex', 'utf8');
          dec += decipher.final('utf8');
          return dec;
        } else {
          return '';
        }
      } catch (error) {
        return '';
      }
    },

  };

  /* Objeto principal y su inicialización y valores default en caso de que no se manden por parametro */
  Crypto.Init = function () { };

  /* Al objeto "Crypto.Init" le pongo el prototipo de "Crypto", el cual trae todas las funciones del Framework */
  Crypto.Init.prototype = Crypto.prototype;

  /* Pongo en el global las variables "Crypto" y "R$" y las pongo igual que el objeto "Crypto" */
  global.Encryption = global.encryption = global.e$ = Crypto;
} (this)); /* Paso objeto window del global para usarlo en mi IIFE */

/*
// IFIEE para funciones generales
*/

/* IIFE Functions para protejer mi Framework */
(function (global) {
  /* Objeto que regresa el objeto principal */
  var Functions = function () { return new Functions.Init(); };

  /* Funciones del prototipo */
  Functions.prototype = {
    /* Valida si el result (success, message, data) es 1 y contiene datos en "data" */
    esResultValido: function (objResult) {
      try {
        if (objResult) {
          if (objResult.success === 1) {
            if (objResult.data) {
              return true;
            } else { return false; }
          } else { return false; }
        } else { return false; }
      } catch (error) { return false; }
    },
    /* si success === 1 entonces regresa el objeto en data */
    returnData: function (result) {
      if (result.success === 1) { return result.data; } else { return result; }
    },

  };

  /* Objeto principal y su inicialización y valores default en caso de que no se manden por parametro */
  Functions.Init = function () { };

  /* Al objeto "Functions.Init" le pongo el prototipo de "Functions", el cual trae todas las funciones del Framework */
  Functions.Init.prototype = Functions.prototype;

  /* Pongo en el global las variables "Functions" y "f$" y las pongo igual que el objeto "Functions" */
  global.Functions = global.functions = global.f$ = Functions;
} (this)); /* Paso objeto window del global para usarlo en mi IIFE */

/*
// Agrego funciones al prototipo
*/

/* Valida si el formato del correo es valido */
String.prototype.esCorreoElectronicoValido = function () {
  try {
    var regularexpressions = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (regularexpressions.test(this)) { return true; } else { return false; }
  } catch (error) { return false; }
};

/* Si la cadena es vacia es true, pero no puedes validar null o undefined */
function fn_esVacio(cadena) {
  try {
    if (cadena) {
      if (cadena.trim() === '') { return true; } else { return false; }
    } else { return true; }
  } catch (error) {
    return true;
  }
}

/* Sobreescribo el prototipo del string, es decir solo para objetos de tipo string aplica */
String.prototype.esVacio = function () {
  return fn_esVacio(this);
};

/* si una cadena de texto es numerica entonces es true, si no es false */
function fn_esNumerico(numero) {
  try {
    return (numero - 0) === numero && ('' + numero).trim().length > 0;
  } catch (error) {
    return false;
  }
}

/* Sobreescribo el prototipo del string, es decir solo para objetos de tipo string aplica */
String.prototype.esNumerico = function () {
  return fn_esNumerico(this);
};

/* Función que recibe un minimo y maximo para validar la longitud de los caracteres solo para tipo string */
String.prototype.longitudValida = function (minimo, maximo) {
  try {
    minimo = minimo || 0;
    maximo = maximo || 255;
    if (this) {
      if (this.length >= minimo && this.length <= maximo) { return true; } else { return false; }
    } else { return false; }
  } catch (error) { return false; }
};

/* Valida si el RFC es valido solo para tipo string */
String.prototype.esRFCValido = function () {
  try {
    var strCorrecta;
    strCorrecta = this;
    if (this.length === 12) { var valid = '^(([A-Z]|[a-z]){3})([0-9]{6})((([A-Z]|[a-z]|[0-9]){3}))'; } else { var valid = '^(([A-Z]|[a-z]|\s){1})(([A-Z]|[a-z]){3})([0-9]{6})((([A-Z]|[a-z]|[0-9]){3}))'; }
    var validRfc = new RegExp(valid);
    var matchArray = strCorrecta.match(validRfc);
    if (matchArray == null) { return false; } else { return true; }
  } catch (error) { return false; }
};
