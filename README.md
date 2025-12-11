Para ejecutar el programa seguir los siguientes pasos :

1. Descargar el código, ya sea con un Git Clone o mediante ZIP

2. Configurar la base de datos

  • Tener instalado MongoDB y asegurarse de que mongod.exe este en ejecución

  • En MongoDB Compass poner Connect -> Create Database. El nombre de la base de datos sera "casino"

  • Crear las colecciones que tendra, "historial" y "usuario", con Create Collection

  • Seleccionar una colección -> Add Data -> Import JSON or CSV file y seleccionar el archivo .json que corresponda a la colección dentro de la carpeta "Base de datos"

3. Doble click en "Iniciar servidor.bat" (esto ejecutara un comando en Windows que iniciará el programa. También es necesario tener instalado NodeJS)

4. En algún navegador web, poner como URL lo siguiente: localhost:777 (esto si no se modifico el número de puerto en el app.js)
