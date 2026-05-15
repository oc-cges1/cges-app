@echo off
chcp 65001 >nul
title SISDEP — Deteniendo sistema...
color 0C

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║     CGES — Sistema Departamental de Seguridad        ║
echo  ║                Deteniendo SISDEP...                  ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

:: ── Ir a la carpeta del proyecto ─────────────────────────────
cd /d "%~dp0"

:: ── Verificar Docker ─────────────────────────────────────────
echo  [1/2] Verificando Docker Desktop...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  ⚠️  Docker Desktop no está activo. No hay nada que detener.
    pause
    exit /b 0
)

:: ── Detener contenedores ─────────────────────────────────────
echo  [2/2] Deteniendo todos los servicios de SISDEP...
echo.
docker compose down
if %errorlevel% neq 0 (
    color 0E
    echo.
    echo  ⚠️  Hubo un problema al detener los servicios.
    echo  Puedes intentarlo manualmente con:
    echo  docker compose down
    echo.
    pause
    exit /b 1
)

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║   ✅ SISDEP detenido correctamente.                  ║
echo  ║                                                      ║
echo  ║   Los datos están guardados y seguros.               ║
echo  ║   Para volver a iniciar usa start.bat                ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
pause