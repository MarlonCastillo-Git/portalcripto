# PortalCripto

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
- pnpm **12.3.4**, versión indicada en `package.json`.
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
   pnpm install --frozen-lockfile
   ```

   Si pnpm no está instalado, puedes instalar la versión del proyecto con `npm install --global pnpm@12.3.4`.

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
