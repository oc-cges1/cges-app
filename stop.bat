@echo off
title SISDEP - Deteniendo sistema...
color 0C

echo.
echo  ================================================
echo  CGES - Sistema Departamental de Seguridad
echo  Deteniendo SISDEP...
echo  ================================================
echo.

cd /d "%~dp0"

echo  [1/2] Verificando Docker Desktop...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  Docker Desktop no esta activo. No hay nada que detener.
    pause
    exit /b 0
)

echo  [2/2] Deteniendo todos los servicios de SISDEP...
echo.
docker compose down
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: Hubo un problema al detener los servicios.
    echo  Puedes intentarlo manualmente con: docker compose down
    echo.
    pause
    exit /b 1
)

echo.
echo  ================================================
echo  SISDEP detenido correctamente.
echo  Los datos estan guardados y seguros.
echo  Para volver a iniciar usa start.bat
echo  ================================================
echo.
pause
