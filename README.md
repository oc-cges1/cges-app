# SISDEP — Sistema Departamental de Seguridad
### Centro de Gestión de Emergencias y Seguridad — CGES
### Gobernación del Valle del Cauca

---

## Stack

| Capa       | Tecnología                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite 5 + TypeScript          |
| Backend    | Node.js + Express + TypeScript          |
| Base datos | PostgreSQL 16 + Prisma ORM              |
| Auth       | JWT (access + refresh) + bcrypt         |
| Mapas      | Leaflet + GeoJSON                       |
| Deploy     | Docker + Nginx + GitHub Actions         |

---

## Estructura

```
sisdep/
├── backend/          API REST Node.js + Express
├── frontend/         React + Vite + TypeScript
├── docker-compose.yml           (desarrollo)
├── docker-compose.prod.yml      (producción)
└── .github/workflows/deploy.yml (CI/CD)
```

---

## Inicio rápido (sin Docker)

```bash
# 1. PostgreSQL local con Docker
docker compose up postgres -d

# 2. Backend
cd backend
cp .env.example .env        # editar con tus valores
npm install
npm run db:generate
npm run db:migrate
npm run dev
# → http://localhost:4000

# 3. Frontend (nueva terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
# → http://localhost:5173
```

---

## Inicio rápido (con Docker completo)

```bash
cp backend/.env.example backend/.env   # editar
docker compose up --build -d

# Primera vez: migrar BD
docker compose exec backend npx prisma migrate dev

# Logs
docker compose logs -f backend
docker compose logs -f frontend
```

---

## Variables de entorno (backend/.env)

```env
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://sisdep_user:sisdep_pass@localhost:5432/sisdep_db"

# Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=64_caracteres_aleatorios_aqui
JWT_REFRESH_SECRET=otros_64_caracteres_diferentes_aqui
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

BCRYPT_ROUNDS=12

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@email.com
SMTP_PASS=app_password
EMAIL_FROM="CGES <no-reply@cges.gov.co>"
```

---

## Endpoints API

| Método | Ruta                    | Auth | Descripción               |
|--------|-------------------------|------|---------------------------|
| POST   | /auth/register          | No   | Registro de usuario       |
| POST   | /auth/login             | No   | Inicio de sesión          |
| POST   | /auth/refresh           | No   | Renovar access token      |
| POST   | /auth/logout            | Sí   | Cerrar sesión             |
| GET    | /auth/profile           | Sí   | Perfil del usuario        |
| POST   | /auth/forgot-password   | No   | Solicitar reset           |
| POST   | /auth/reset-password    | No   | Cambiar contraseña        |
| GET    | /auth/verify-email      | No   | Verificar correo          |
| GET    | /health                 | No   | Health check              |

---

## Rutas del frontend

| Ruta                        | Descripción                          |
|-----------------------------|--------------------------------------|
| /auth/login                 | Inicio de sesión (pública)           |
| /auth/register              | Registro (pública)                   |
| /auth/forgot-password       | Recuperar contraseña (pública)       |
| /auth/reset-password        | Nueva contraseña (pública)           |
| /                           | Dashboard principal (protegida)      |
| /georeferenciacion          | Mapa Leaflet con capas GeoJSON       |
| /camaras                    | Cámaras de videovigilancia           |
| /observatorio               | Observatorio del Delito              |
| /observatorio/boletines     | Boletines del Observatorio           |
| /observatorio/informes      | Informes del Observatorio            |
| /looker-studio              | Reporte embebido Looker Studio       |
| /[otros-módulos]            | Módulos en desarrollo                |

---

## Archivos GeoJSON requeridos (en frontend/public/)

```
frontend/public/
├── camaras_valle.geojson    ← puntos de cámaras CGES
├── valle_del_cauca.geojson  ← límite departamental
├── co.geojson               ← límite nacional
├── zones.geojson            ← zonas de seguridad
└── pois.geojson             ← puntos de interés
```

---

## Agregar submódulos a cualquier módulo

Editar `frontend/src/data/submodules.ts`:

```ts
// 1. Agregar en SUB_MODULES:
{
  id:          'nuevo-sub',
  name:        'Nombre',
  description: 'Descripción',
  path:        '/modulo-padre/nuevo-sub',
  icon:        '📋',
  accentColor: '#1A7FBF',
  color:       '#071624',
  status:      'development',
  parentId:    'modulo-padre',   // ← ID del módulo padre
},

// 2. Agregar en MODULE_META si el padre no tiene entrada:
'modulo-padre': {
  id:          'modulo-padre',
  name:        'Nombre del Padre',
  description: 'Descripción',
  icon:        '🔭',
  accentColor: '#1A7FBF',
  parentPath:  '/sistema-departamental-de-seguridad',
  parentName:  'Sistema Departamental',
},
```

Luego agregar las rutas en `frontend/src/App.tsx`.

---

## Producción en servidor Linux

```bash
mkdir -p /opt/sisdep/backups /opt/sisdep/ssl
cd /opt/sisdep

# Copiar archivos
cp docker-compose.prod.yml .
cp .env.production.example .env.production
nano .env.production   # editar con valores reales

# Primera vez
docker compose -f docker-compose.prod.yml up -d postgres
sleep 10
docker compose -f docker-compose.prod.yml run --rm backend \
  npx prisma migrate deploy
docker compose -f docker-compose.prod.yml up -d

# Verificar
curl http://localhost/nginx-health
curl http://localhost/auth/health
```

---

## Secrets de GitHub (para CI/CD)

Configurar en Settings → Secrets and variables → Actions:

| Secret          | Valor                                |
|-----------------|--------------------------------------|
| SERVER_HOST     | IP o dominio del servidor            |
| SERVER_USER     | Usuario SSH (ej: ubuntu)             |
| SERVER_SSH_KEY  | Clave SSH privada del servidor       |

---

## Comandos útiles

```bash
# Ver estado de servicios
docker compose ps

# Acceder a la BD
docker compose exec postgres psql -U sisdep_user -d sisdep_db

# Prisma Studio (visualizar BD)
cd backend && npm run db:studio
# → http://localhost:5555

# Backup manual
bash /opt/sisdep/scripts/backup.sh

# Logs en producción
docker compose -f docker-compose.prod.yml logs -f --tail=100
```
