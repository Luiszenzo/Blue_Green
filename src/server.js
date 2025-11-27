const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

app.get('/', (req, res) => {
    res.json({
        message: `Bienvenido al ambiente ${ENVIRONMENT}`,
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', environment: ENVIRONMENT });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}, ambiente: ${ENVIRONMENT}`);
});