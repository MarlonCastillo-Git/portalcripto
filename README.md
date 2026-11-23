# PortalCripto (Tarea de Marlon Castillo)

URL público del despliegue en AWS Amplify: https://main.d1n4s1iqik4qs1.amplifyapp.com/
agregado el 22 de Noviembre.

Portal web en español para consultar criptomonedas almacenadas en Supabase. Permite explorar el catálogo, filtrar por categoría y abrir el detalle de cada moneda.

Las tarjetas y el detalle muestran **Precio :** y **Capitalización Total :**, en USD. La capitalización se presenta en miles, millones o billones, con hasta dos decimales. Se utiliza la escala española: un billón equivale a un millón de millones (10¹²).

Los precios provienen de los registros de la base de datos. La aplicación no consulta una API de cotizaciones ni actualiza esos valores automáticamente. Las páginas configuradas con revalidación cada 60 segundos pueden volver a consultar Supabase; eso no actualiza los precios almacenados.

## Tecnologías

- Next.js 16.3.6 con App Router y React 19.
- TypeScript y Tailwind CSS 4.
- Supabase (PostgreSQL) y `@supabase/supabase-js`.
- pnpm y ESLint.

## Instalación local

### Requisitos

- Node.js **22 o superior**, requerido por la versión instalada del cliente de Supabase.
- pnpm **10.34.9**, versión indicada en `package.json`.
- Un proyecto Supabase con las tablas, la relación y las políticas de lectura descritas más abajo.
- Conexión a Internet para instalar dependencias y consultar Supabase e imágenes externas.

Los comandos siguientes están pensados para macOS o Linux. En Windows, utilizar WSL: el script de desarrollo usa la sintaxis de variables de entorno de una shell POSIX.

### Pasos

1. Abre una terminal en el directorio del proyecto:

   ```bash
   cd /Users/marloncastillo/portalcripto
   ```

   Si guardaste el proyecto en otra ubicación, ajusta la ruta.

2. Comprueba las herramientas e instala las dependencias:

   ```bash
   node --version
   pnpm --version
   pnpm install --frozen-lockfile --node-linker=hoisted
   ```

   Si pnpm no está instalado, puedes instalar la versión del proyecto con `npm install --global pnpm@10.34.9`.

3. Crea o configura `.env.local` en la raíz del proyecto con las variables de la sección siguiente. Si ya existe, conserva sus valores válidos.

4. Inicia el servidor:

   ```bash
   pnpm dev
   ```

5. Abre `http://localhost:3000`. Si ese puerto está ocupado, utiliza la URL que indique la terminal, por ejemplo `http://localhost:3001`. Detén el servidor con `Ctrl+C`.

El script `dev` activa `WATCHPACK_POLLING=true` para evitar errores del observador de archivos, como `EMFILE`, mediante sondeo periódico.

## Variables de entorno

Archivo local: `.env.local`, junto a `package.json`.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICABLE
```

Los valores anteriores son marcadores de ejemplo; reemplázalos con la URL y la clave publicable de tu proyecto Supabase.

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de la API del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave publicable para las consultas sujetas a las políticas RLS. |

Ambas variables son obligatorias: `src/lib/supabase.ts` genera un error si falta alguna. Reinicia el servidor después de cambiarlas.

El prefijo `NEXT_PUBLIC_` permite que Next.js exponga estos valores al navegador. Usa únicamente la clave publicable; nunca coloques una clave secreta, `service_role` o la contraseña de la base de datos en estas variables. La protección de los datos depende de las políticas RLS de Supabase.

`.env.local` está excluido de Git mediante la regla `.env*` del proyecto. No incluyas credenciales reales en el README ni en archivos versionados. Para desplegar, configura estas mismas variables en el entorno del proveedor antes de compilar.

## Preparación de Supabase

La aplicación espera las siguientes tablas en el esquema `public`:

| Tabla | Columnas utilizadas |
| --- | --- |
| `categorias` | `id`, `nombre`, `slug`, `descripcion` |
| `criptomonedas` | `id`, `nombre`, `descripcion`, `preciousd`, `marketcap`, `totalmarketcap`, `imagen_url`, `categoria_id`, `created_at` |

- `categorias.slug` debe ser único.
- `criptomonedas.categoria_id` debe referenciar `categorias.id`; las consultas utilizan esa relación para obtener el nombre y el slug de la categoría.
- `preciousd` es el nombre exacto de la columna de precio unitario en USD.
- `totalmarketcap` contiene la capitalización numérica en USD.
- `marketcap` contiene una de las etiquetas `Bajo`, `Mediano` o `Alto`.
- Habilita RLS y políticas de `SELECT` para `anon` y `authenticated` en ambas tablas, según el acceso público de lectura previsto para este portal.

Carga previamente las categorías y las criptomonedas en Supabase. `pnpm install` y `pnpm dev` no crean tablas ni insertan datos. El portal no necesita permisos públicos de escritura.

## Rutas y organización

| Ruta | Contenido |
| --- | --- |
| `/` | Categorías y catálogo de criptomonedas. |
| `/categorias/[slug]` | Criptomonedas de una categoría. |
| `/criptos/[id]` | Detalle de una criptomoneda. |

- `src/app/`: páginas, diseño general y estados de carga, error y contenido no encontrado.
- `src/components/CriptomonedaCard.tsx`: tarjeta compartida del catálogo.
- `src/lib/supabase.ts`: configuración del cliente Supabase.
- `src/lib/queries.ts`: consultas de categorías y criptomonedas.
- `src/lib/types.ts`: tipos de datos.
- `src/lib/format.ts`: formato de capitalización.
- `next.config.ts`: configuración de imágenes remotas y orígenes de desarrollo.

## Comandos disponibles

| Comando | Función |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo. |
| `pnpm lint` | Ejecuta ESLint. |
| `pnpm exec tsc --noEmit` | Comprueba los tipos de TypeScript. |
| `pnpm build` | Genera la compilación de producción. |
| `pnpm start` | Sirve la compilación creada con `pnpm build`. |

La compilación de producción requiere las variables de entorno y acceso a Supabase, porque la generación de páginas consulta los datos.

## Problemas habituales

- **Faltan variables de entorno:** revisa los nombres en `.env.local` y reinicia `pnpm dev`.
- **Error al consultar datos:** comprueba la conexión, la URL y la clave publicable, las tablas, la relación y las políticas RLS de lectura.
- **Catálogo vacío:** verifica que existan registros visibles para el rol público en Supabase.
- **Imágenes rechazadas:** el dominio y la ruta de `imagen_url` deben estar permitidos en `images.remotePatterns` de `next.config.ts`. Ya están configurados los dominios de CoinGecko y CoinMarketCap utilizados por el catálogo.
- **Puerto ocupado:** abre el puerto alternativo indicado en la terminal.
- **Acceso desde otro dispositivo:** usa la IP local del equipo y el puerto indicado, en la misma red. Si cambia esa IP, revisa `allowedDevOrigins` en `next.config.ts`.


## Despliegue en AWS Amplify Hosting

El repositorio contiene una sola aplicación: conectar la rama `main` con la raíz
(del repositorio, no una carpeta llamada `main`). `amplify.yml` controla la
compilación y publica `.next` con Amplify Hosting Compute (plataforma
`WEB_COMPUTE`, framework de la rama `Next.js - SSR`). No usar hosting estático,
`out`, `public` ni una regla SPA que redirija todo a `/index.html`.

Se utiliza Next.js 15.5.29 porque la documentación de AWS consultada declara
soporte administrado para Next.js 12–15. Se conservan ISR y optimización de imágenes.
El entorno de compilación debe usar Amazon Linux 2023 y Node.js 22.
El buildspec selecciona Node.js 22 e instala pnpm 10.34.9; `.npmrc` y `pnpm-workspace.yaml` configuran
`node-linker=hoisted`, recomendado por AWS para pnpm.

Configurar en Amplify, antes del build:

- `NEXT_PUBLIC_SUPABASE_URL`: URL HTTPS del proyecto Supabase activo.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave publicable del mismo proyecto.

`scripts/amplify-env.mjs` valida y escribe únicamente estas variables públicas en
`.env.production` para su uso por los componentes del servidor. No imprime sus
valores. No usar claves secretas ni `service_role`. Los archivos `.env*` están
excluidos de Git. El build consulta Supabase al generar las páginas y necesita
acceso de red y permisos de lectura para `categorias` y `criptomonedas`.

Verificación local (Node.js 22):

```bash
pnpm install --frozen-lockfile --node-linker=hoisted
pnpm run build
pnpm run start
```

Después de subir los cambios a GitHub, confirmar que la implementación de `main`
muestra el commit nuevo y que Provision, Build y Deploy terminan correctamente.
Un build local exitoso no prueba la configuración de la cuenta de AWS. La pantalla
Welcome no identifica la causa: revisar los registros de implementación y la
plataforma configurada. No es necesario un `index.html` en la raíz de `.next`.

Si la aplicación existente está marcada como `WEB` en vez de `WEB_COMPUTE`,
un administrador puede corregirla desde AWS CloudShell (cuenta y región correctas):

```bash
aws amplify get-app --app-id d1n4s1iqik4qs1 --query 'app.{platform:platform,repository:repository}'
aws amplify update-app --app-id d1n4s1iqik4qs1 --platform WEB_COMPUTE
aws amplify update-branch --app-id d1n4s1iqik4qs1 --branch-name main --framework 'Next.js - SSR'
```

Consultar primero `get-app`; ejecutar las actualizaciones solo si son necesarias.
No se ejecutan automáticamente desde el proyecto.

Referencias oficiales:
- https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html
- https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html
- https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html
- https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html
- https://docs.aws.amazon.com/amplify/latest/userguide/redeploy-ssg-to-ssr.html
