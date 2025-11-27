// src/server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

// Servir archivos estáticos (CSS, imágenes)
app.use(express.static('public'));

// Ruta principal con HTML
app.get('/', (req, res) => {
    const isBlue = ENVIRONMENT === 'blue';
    const color = isBlue ? '#007bff' : '#28a745';
    const backgroundColor = isBlue ? '#e3f2fd' : '#e8f5e8';
    const textColor = isBlue ? '#0056b3' : '#1e7e34';
    
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blue-Green Deployment</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, ${backgroundColor}, #ffffff);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.5s ease;
            }
            
            .container {
                text-align: center;
                padding: 40px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border: 4px solid ${color};
                max-width: 500px;
                animation: fadeIn 0.8s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .environment-badge {
                background: ${color};
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 1.5em;
                font-weight: bold;
                margin-bottom: 20px;
                display: inline-block;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            h1 {
                color: ${textColor};
                margin-bottom: 10px;
            }
            
            .info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin: 15px 0;
                border-left: 4px solid ${color};
            }
            
            .stats {
                display: flex;
                justify-content: space-around;
                margin: 20px 0;
            }
            
            .stat {
                text-align: center;
            }
            
            .stat-value {
                font-size: 1.5em;
                font-weight: bold;
                color: ${color};
            }
            
            .deployment-info {
                background: ${backgroundColor};
                padding: 15px;
                border-radius: 10px;
                margin-top: 20px;
            }
            
            .version {
                color: #6c757d;
                font-size: 0.9em;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="environment-badge">
                ${ENVIRONMENT.toUpperCase()}
            </div>
            
            <h1>¡Despliegue ${isBlue ? 'BLUE' : 'GREEN'} Activo!</h1>
            
            <div class="info">
                <strong>Estrategia:</strong> Blue-Green Deployment<br>
                <strong>Estado:</strong> <span style="color: ${color}">●</span> En línea
            </div>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-value">${isBlue ? '🚀' : '🌿'}</div>
                    <div>Ambiente</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${port}</div>
                    <div>Puerto</div>
                </div>
                <div class="stat">
                    <div class="stat-value">✅</div>
                    <div>Salud</div>
                </div>
            </div>
            
            <div class="deployment-info">
                <h3>Información del Despliegue</h3>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <p><strong>Versión:</strong> 1.0.0</p>
                <p><strong>Estrategia:</strong> Cada push alterna entre Blue y Green</p>
            </div>
            
            <div class="version">
                Última actualización: ${new Date().toLocaleString()}
            </div>
        </div>
        
        <script>
            // Efectos visuales adicionales
            document.addEventListener('DOMContentLoaded', function() {
                const badge = document.querySelector('.environment-badge');
                
                setInterval(() => {
                    badge.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        badge.style.transform = 'scale(1)';
                    }, 300);
                }, 3000);
                
                // Mostrar notificación del ambiente
                console.log('Ambiente activo: ${ENVIRONMENT}');
            });
        </script>
    </body>
    </html>
    `);
});

// Mantener la ruta API para health checks y GitHub Actions
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString()
    });
});

// Ruta API para obtener información en JSON (para GitHub Actions)
app.get('/api/info', (req, res) => {
    res.json({
        message: `Bienvenido al ambiente ${ENVIRONMENT}`,
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        status: "active"
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en puerto ${port}, ambiente: ${ENVIRONMENT}`);
    console.log(`📊 Health check disponible en: http://localhost:${port}/health`);
    console.log(`🔧 API info disponible en: http://localhost:${port}/api/info`);
});