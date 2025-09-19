# Septimoa.com - Sistema de Registro de Usuarios

Una aplicación web moderna para el registro y gestión de usuarios, desarrollada con Node.js, Express y SQLite.

## 🚀 Características

- ✅ Formulario de registro de usuarios con validación
- ✅ Base de datos SQLite para almacenamiento persistente
- ✅ Interfaz web moderna y responsive
- ✅ API REST completa para CRUD de usuarios
- ✅ Edición y eliminación de usuarios
- ✅ Diseño atractivo con gradientes y animaciones
- ✅ Notificaciones en tiempo real
- ✅ Validación de email en tiempo real

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   # Si tienes git instalado
   git clone <url-del-repositorio>
   cd septimoa-website
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar la aplicación**
   ```bash
   # Modo desarrollo (con auto-reload)
   npm run dev
   
   # Modo producción
   npm start
   ```

4. **Acceder a la aplicación**
   - Abre tu navegador y ve a: `http://localhost:3000`

## 🗄️ Base de Datos

La aplicación utiliza SQLite como base de datos. El archivo `database.sqlite` se creará automáticamente al ejecutar la aplicación por primera vez.

### Esquema de la tabla usuarios:
- `id`: Identificador único (autoincremental)
- `nombre`: Nombre completo del usuario (requerido)
- `email`: Email del usuario (requerido, único)
- `telefono`: Teléfono del usuario (opcional)
- `descripcion`: Descripción del usuario (opcional)
- `fecha_registro`: Fecha y hora de registro (automática)

## 🌐 API Endpoints

### Obtener todos los usuarios
```
GET /api/usuarios
```

### Obtener un usuario específico
```
GET /api/usuarios/:id
```

### Crear nuevo usuario
```
POST /api/usuarios
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "telefono": "+1234567890",
  "descripcion": "Descripción del usuario"
}
```

### Actualizar usuario
```
PUT /api/usuarios/:id
Content-Type: application/json

{
  "nombre": "Juan Pérez Actualizado",
  "email": "juan.nuevo@ejemplo.com",
  "telefono": "+1234567890",
  "descripcion": "Nueva descripción"
}
```

### Eliminar usuario
```
DELETE /api/usuarios/:id
```

## 🌍 Configuración del Dominio Septimoa.com

### Opción 1: Hosting Tradicional (Recomendado)

1. **Elegir un proveedor de hosting**
   - Heroku (gratis con limitaciones)
   - DigitalOcean
   - AWS
   - Google Cloud Platform
   - Vercel
   - Netlify

2. **Preparar la aplicación para producción**
   ```bash
   # Instalar PM2 para gestión de procesos
   npm install -g pm2
   
   # Crear archivo de configuración PM2
   echo '{
     "apps": [{
       "name": "septimoa-app",
       "script": "server.js",
       "instances": 1,
       "exec_mode": "cluster",
       "env": {
         "NODE_ENV": "production",
         "PORT": 3000
       }
     }]
   }' > ecosystem.config.js
   ```

3. **Subir archivos al servidor**
   - Subir todos los archivos del proyecto
   - Ejecutar `npm install --production`
   - Iniciar con `pm2 start ecosystem.config.js`

4. **Configurar el dominio**
   - En tu proveedor de dominios (GoDaddy, Namecheap, etc.)
   - Crear un registro A que apunte a la IP de tu servidor
   - O crear un registro CNAME que apunte a tu subdominio del hosting

### Opción 2: Vercel (Más Fácil)

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Crear archivo vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

3. **Desplegar**
   ```bash
   vercel
   ```

4. **Configurar dominio personalizado**
   - En el dashboard de Vercel
   - Ir a Settings > Domains
   - Agregar "septimoa.com"
   - Configurar los registros DNS según las instrucciones

### Opción 3: Heroku

1. **Instalar Heroku CLI**
   - Descargar desde: https://devcenter.heroku.com/articles/heroku-cli

2. **Crear archivo Procfile**
   ```
   web: node server.js
   ```

3. **Desplegar**
   ```bash
   # Login en Heroku
   heroku login
   
   # Crear aplicación
   heroku create septimoa-app
   
   # Desplegar
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

4. **Configurar dominio personalizado**
   ```bash
   heroku domains:add septimoa.com
   ```

### Configuración DNS

En tu proveedor de dominios, configura:

**Para hosting con IP fija:**
- Tipo: A
- Nombre: @
- Valor: [IP de tu servidor]

**Para hosting con subdominio:**
- Tipo: CNAME
- Nombre: www
- Valor: [subdominio de tu hosting]

**Para Heroku/Vercel:**
- Tipo: CNAME
- Nombre: www
- Valor: [tu-app.herokuapp.com] o [tu-app.vercel.app]

## 🔧 Configuración Avanzada

### Variables de Entorno

Crear archivo `.env`:
```
PORT=3000
NODE_ENV=production
DB_PATH=./database.sqlite
```

### SSL/HTTPS

Para habilitar HTTPS:

1. **Con Let's Encrypt (gratis)**
   ```bash
   # Instalar certbot
   sudo apt-get install certbot
   
   # Obtener certificado
   sudo certbot certonly --standalone -d septimoa.com
   ```

2. **Modificar server.js para HTTPS**
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('/path/to/private-key.pem'),
     cert: fs.readFileSync('/path/to/certificate.pem')
   };
   
   https.createServer(options, app).listen(443);
   ```

## 📱 Características de la Interfaz

- **Diseño Responsive**: Se adapta a móviles, tablets y desktop
- **Validación en Tiempo Real**: Validación de email mientras escribes
- **Notificaciones**: Feedback inmediato para todas las acciones
- **Modal de Edición**: Interfaz elegante para editar usuarios
- **Animaciones**: Transiciones suaves y efectos visuales
- **Iconos**: Font Awesome para una mejor experiencia visual

## 🚀 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Roles y permisos
- [ ] Búsqueda y filtros
- [ ] Exportar datos a CSV/Excel
- [ ] Paginación para grandes cantidades de usuarios
- [ ] Dashboard con estadísticas
- [ ] API de autenticación con JWT
- [ ] Integración con servicios de email

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la consola del navegador para errores
2. Verifica que el servidor esté ejecutándose
3. Comprueba la conexión a la base de datos
4. Revisa los logs del servidor

## 📄 Licencia

MIT License - Puedes usar este proyecto libremente para fines comerciales y no comerciales.

---

**¡Tu sitio web Septimoa.com está listo para funcionar!** 🎉


