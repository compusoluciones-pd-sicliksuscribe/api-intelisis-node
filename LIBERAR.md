Para liberar a producción la aplicación es necesario seguir los siguientes pasos:
*  El archivo **config.js** debe tener comentado los accesos de pruebas, y descomentados los de producción. 

*  Es necesario comprimir los archivos en un **.zip** para esto hay que seleccionar todos los archivos excepto **node_modules** y **package-lock.json**, con click derecho seleccionar la opción **enviar a** y **Carpeta comprimida(.zip)**, puedes nombrarlo de cualquier manera.

*  Dentro de la consola de amazon cs-ti, dentro del servicio elastick-beanstalk, seleccionar la instancia **intelisis-api**, hay que revisar el nombre de la versión actual, copiar el nombre y modificar el .zip creado anterior mente con este nombre, agregando el número de la nueva versión, siguiendo un versionado semántico.

*  Seleccionar la opción dentro de la instancia **Uload and Deploy** y subir el .zip creado anterior mente, con su nuevo nombre y seleccionar **Deploy**.