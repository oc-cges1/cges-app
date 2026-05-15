@echo off
chcp 65001 >nul
title SISDEP — Iniciando sistema...
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║     CGES — Sistema Departamental de Seguridad        ║
echo  ║                   SISDEP v1.0                        ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

:: ── Verificar que Docker Desktop está corriendo ──────────────
echo  [1/5] Verificando Docker Desktop...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  ❌ ERROR: Docker Desktop no está en ejecución.
    echo.
    echo  Por favor:
    echo  1. Busca "Docker Desktop" en el menú de inicio
    echo  2. Ábrelo y espera a que el ícono de la ballena
    echo     aparezca en la barra de tareas
    echo  3. Vuelve a hacer doble clic en start.bat
    echo.
    pause
    exit /b 1
)
echo  ✅ Docker Desktop está activo.
echo.

:: ── Ir a la carpeta del proyecto ─────────────────────────────
cd /d "%~dp0"

:: ── Detener contenedores anteriores si existen ───────────────
echo  [2/5] Deteniendo instancias anteriores...
docker compose down --remove-orphans >nul 2>&1
echo  ✅ Listo.
echo.

:: ── Construir imágenes (solo si hay cambios) ─────────────────
echo  [3/5] Construyendo la aplicación...
echo  (Esto puede tardar varios minutos la primera vez)
echo.
docker compose build --quiet
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  ❌ ERROR al construir la aplicación.
    echo  Revisa la consola arriba para ver el error.
    echo.
    pause
    exit /b 1
)
echo  ✅ Aplicación construida correctamente.
echo.

:: ── Levantar todos los servicios ─────────────────────────────
echo  [4/5] Iniciando servicios...
docker compose up -d
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  ❌ ERROR al iniciar los servicios.
    echo.
    pause
    exit /b 1
)
echo  ✅ Servicios iniciados.
echo.

:: ── Esperar a que el backend esté listo ──────────────────────
echo  [5/5] Esperando que el sistema esté listo...
set intentos=0
:esperar
set /a intentos+=1
if %intentos% gtr 30 (
    color 0E
    echo.
    echo  ⚠️  El sistema tardó más de lo esperado en iniciar.
    echo  Abriendo el navegador de todas formas...
    goto abrir
)
docker exec sisdep_backend wget --quiet --tries=1 --spider http://localhost:4000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo  Esperando... intento %intentos%/30
    timeout /t 3 /nobreak >nul
    goto esperar
)

:abrir
echo  ✅ Sistema listo.
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║   ✅ SISDEP está corriendo en:                       ║
echo  ║      http://localhost                                ║
echo  ║                                                      ║
echo  ║   Abriendo navegador...                              ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

timeout /t 2 /nobreak >nul
start http://localhost

echo  El sistema seguirá corriendo en segundo plano.
echo  Para detenerlo usa stop.bat
echo.
pause