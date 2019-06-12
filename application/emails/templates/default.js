const imgClick = 'https://s3.amazonaws.com/marketplace.compusoluciones.com/images/clicksuscribe.png';

const html = body => (`
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="viewport" content="initial-scale=1.0" />
      <meta name="viewport" content="maximum-scale=1.0" />
      <meta name="viewport" content="user-scalable=no" />
      <meta name="viewport" content="width=device-width" />
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#FFFFFFFF">
      <meta name="msapplication-navbutton-color" content="#FFFFFFFF">
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="marketplace" />
      <meta name="application-tooltip" content="marketplace" />
      <meta name="apple-mobile-web-app-title" content="marketplace" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#FFFFFFFF" />
      <meta name="application-bavbutton-color" content="#FFFFFFFF" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#FFFFFFFF" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width">
      <title> ${body.subject} </title>
      <body bgcolor="#f3f3f3" align="center">
        <table style="background-color:#fff; width:98%; ">
          <tr height="10">
            <td width="10"></td>
            <td></td>
            <td width="10"></td>
        </tr>
        <tr height="10">
          <td width="10"></td>
          <td>
            <div align="center">
              <br>
              <a href="https://clicksuscribe.compusoluciones.com"> <img src="${imgClick}" width="250" /> </a>
              <br> <br> <br>
            </div>
          </td>
          <td width="10"></td>
      </tr>
      <tr height="10">
        <td width="10"></td>
        <td> <p align="justify"> <font size="5" face="Helvetica" color="#444"> <b>${body.title}!</b> </font> </p> </td>
        <td width="10"></td>
      </tr>
      <tr height="10">
        <td width="10"></td>
        <td> <p align="justify"> <font size="4" face="Helvetica" color="#89878B"> ${body.message} </font> </p> <br> </td>
        <td width="10"></td>
      </tr>
      <tr height="10">
        <td width="10"></td>
        <td>
          <p align="justify">
            <font size="-12"  face="Helvetica" color="#89878B">
              Este mensaje y sus adjuntos se dirigen exclusivamente a su destinatario, puede contener información privilegiada y/o confidencial
              y es para uso exclusivo de la persona o entidad de destino. Si usted no es el destinatario indicado
              queda notificado que la lectura, utilización divulgación y/o copia sin autorización puede estar
              prohibida en virtud de la legislación vigente. Si ha recibido este mensaje por error, le rogamos
              nos informe inmediatamente por esta misma vía y proceda a su destrucción.
              <a href="http://www.compusoluciones.com/aviso-de-privacidad/"> Aviso de Privacidad </a>
            </font>
          </p>
        </td>
        <td width="10"></td>
      </tr>
      <tr height="10">
        <td width="10"></td>
        <td></td>
      <td width="10"></td>
      </tr>
    </table>
    </body>
  </html>
`);

module.exports = html;
