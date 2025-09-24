# 🚀 Configuración de Supabase - Guía Completa

## 📋 Pasos para configurar Supabase desde cero

### 1. Crear proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Elige tu organización
5. Completa los datos del proyecto:
   - **Name**: `septimoa-website` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura
   - **Region**: Elige la más cercana a tu ubicación
6. Haz clic en "Create new project"

### 2. Obtener las credenciales
1. En el dashboard de tu proyecto, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)

### 3. Configurar variables de entorno
1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima_aqui
PORT=3000
```

### 4. Crear la tabla en Supabase
1. Ve al dashboard de Supabase
2. Navega a **SQL Editor**
3. Ejecuta el siguiente SQL:

```sql
CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  telefono VARCHAR(50),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Configurar políticas de seguridad (RLS)
1. En el dashboard, ve a **Authentication** > **Policies**
2. Para la tabla `usuarios`, crea las siguientes políticas:

**Política de lectura (SELECT):**
```sql
CREATE POLICY "Permitir lectura pública" ON usuarios
FOR SELECT USING (true);
```

**Política de inserción (INSERT):**
```sql
CREATE POLICY "Permitir inserción pública" ON usuarios
FOR INSERT WITH CHECK (true);
```

**Política de actualización (UPDATE):**
```sql
CREATE POLICY "Permitir actualización pública" ON usuarios
FOR UPDATE USING (true);
```

**Política de eliminación (DELETE):**
```sql
CREATE POLICY "Permitir eliminación pública" ON usuarios
FOR DELETE USING (true);
```

### 6. Instalar dependencias y probar
```bash
npm install
node migrate.js
npm start
```

## 🔧 Comandos útiles

- **Probar conexión**: `node migrate.js`
- **Iniciar servidor**: `npm start`
- **Modo desarrollo**: `npm run dev`

## 🚨 Solución de problemas

### Error: "Las variables SUPABASE_URL y SUPABASE_ANON_KEY deben estar configuradas"
- Verifica que el archivo `.env` existe y tiene las variables correctas
- Asegúrate de que no hay espacios extra en las variables

### Error de conexión a Supabase
- Verifica que las credenciales sean correctas
- Asegúrate de que el proyecto esté activo en Supabase
- Revisa que la región del proyecto sea la correcta

### Error 403 o permisos
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que la tabla `usuarios` existe

## 📊 Verificar que todo funciona

1. Ejecuta `node migrate.js` - debe mostrar "Conexión a Supabase exitosa"
2. Inicia el servidor con `npm start`
3. Ve a `http://localhost:3000` y prueba registrar un usuario
4. Verifica en el dashboard de Supabase que el usuario aparezca en la tabla

¡Listo! 🎉 Tu aplicación ahora está conectada a Supabase.

