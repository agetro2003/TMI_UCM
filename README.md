# Proyecto LetSave 

Proyecto de TECNOLOGÍAS MULTIMEDIA E INTERACCIÓN para: 
* Escanear y procesar facturas
* Comparar información sobre productos y establecimientos
* Guardar los gastos mensuales del usuario


## Para probar la aplicación se necesita: 
* node.js 
* npm
* Expo Go (en el móvil y con una versión compatible para ejecutar SDK 52)

## Proceso de prueba una vez clonado el repositorio
* Instalar dependencias 
```
npm install 
```

* Ejecutar proyecto (en caso de error pruebe agregar la flag --tunnel)
```
npx expo start --offline
```

* Escanear QR con la aplicación Expo Go

## Para crear APK (Solo podra ejecutarse en Android)

### Requisitos
* EAS CLI
* Cuenta en la plataforma EXPO

### Proceso 
* Agregar variables de entorno en la plataforma de EXPO
* Ejecutar comando para construir el proyecto en la plataforma de EXPO usando el perfil de producción.
```
eas build -p android --profile production
```
* Descargar APK escaneando el QR generado por la página.

## Variables de entorno
Tanto para las pruebas en Expo Go, como para la creacion de la APK es necesario tener las siguientes variables entorno: 
* EXPO_PUBLIC_ACCESS_KEY_ID = "" 
* EXPO_PUBLIC_SECRET_ACCESS_KEY = ""
* EXPO_PUBLIC_API_URL = ""
* EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY = ""

Estas variables deben registrarse en la plataforma de EXPO para la creación de la APK o en un archivo .env para pruebas mediante Expo Go
