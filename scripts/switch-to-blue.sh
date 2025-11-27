#!/bin/bash
set -e

# Recibir contraseña como parámetro
PASSWORD="$1"

if [ -z "$PASSWORD" ]; then
    echo "❌ Error: Se requiere la contraseña como parámetro"
    echo "Uso: $0 <password>"
    exit 1
fi

# Función para verificar salud
check_health() {
    local port=$1
    local service=$2
    local max_attempts=10
    local attempt=1

    echo "⏳ Verificando salud de $service (puerto $port)..."

    while [ $attempt -le $max_attempts ]; do
        if curl -s -f http://localhost:$port/health > /dev/null 2>&1; then
            echo "✅ $service está saludable"
            return 0
        fi
        echo "⏰ Intento $attempt/$max_attempts - $service no responde, esperando..."
        sleep 5
        ((attempt++))
    done

    echo "❌ $service no está saludable después de $max_attempts intentos"
    return 1
}

echo "🚀 Iniciando despliegue BLUE-GREEN..."
echo "🔄 Cambiando a BLUE..."

# Detectar ambiente actual
CURRENT_ENV=$(curl -s http://localhost | grep -o '"environment":"[^"]*' | cut -d'"' -f4 2>/dev/null || echo "unknown")
echo "🔍 Ambiente actual: $CURRENT_ENV"

echo "📦 Desplegando en BLUE..."
cd /srv/app/blue

# Copiar nueva aplicación
sudo cp -r /home/deployer/app/* .

docker compose build
docker compose up -d

# Verificar salud de BLUE
check_health 3001 "BLUE"

echo "🔀 Cambiando tráfico a BLUE..."
echo "$PASSWORD" | sudo -S rm -f /etc/nginx/sites-enabled/app_active.conf
echo "$PASSWORD" | sudo -S ln -s /etc/nginx/sites-available/app_blue.conf /etc/nginx/sites-enabled/app_active.conf
echo "$PASSWORD" | sudo -S nginx -t && echo "$PASSWORD" | sudo -S systemctl reload nginx

echo "✅ Cambiado a BLUE exitosamente"

echo "🎯 Verificando despliegue final..."
sleep 5
NEW_ENV=$(curl -s http://localhost | grep -o '"environment":"[^"]*' | cut -d'"' -f4)
echo "🎉 Despliegue completado. Ambiente activo: $NEW_ENV"

echo "📊 Estado de contenedores:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"