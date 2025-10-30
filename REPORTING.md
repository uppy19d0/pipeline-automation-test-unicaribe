# 📊 Sistema de Reportes y Notificaciones

Este proyecto incluye un sistema completo de generación de reportes y notificaciones para los resultados de las pruebas automatizadas.

## 🚀 Características

### Generación de Reportes
- **Reportes HTML**: Reportes visuales con gráficos y estadísticas detalladas
- **Reportes JSON**: Datos estructurados para integración con otras herramientas
- **Reportes Markdown**: Documentación legible para README y documentación
- **Reportes JUnit XML**: Compatible con sistemas CI/CD estándar

### Sistema de Notificaciones
- **Email**: Notificaciones por correo electrónico con reportes adjuntos
- **Slack**: Integración con Slack mediante webhooks
- **Microsoft Teams**: Notificaciones en canales de Teams
- **Discord**: Mensajes automáticos en servidores de Discord
- **Consola**: Resumen detallado en la terminal

## 📋 Uso Rápido

### Ejecutar Pruebas con Reportes
```bash
# Ejecutar todas las pruebas con generación automática de reportes
npm run test:report

# Ejecutar con salida detallada
npm run test:report -- --verbose

# Ejecutar pruebas específicas
npm run test:report -- --testNamePattern="Calculator"
```

### Solo Generar Reportes (sin ejecutar pruebas)
```javascript
const ReportGenerator = require('./src/reportGenerator');
const reportGenerator = new ReportGenerator();

// Generar reporte con datos existentes
const reportData = await reportGenerator.generateTestReport(testResults);
```

## ⚙️ Configuración

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las variables necesarias:

```bash
cp .env.example .env
```

#### Configuración de Email
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NOTIFICATION_EMAIL=team@yourcompany.com
```

#### Configuración de Webhooks
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
TEAMS_WEBHOOK_URL=https://yourcompany.webhook.office.com/webhookb2/YOUR-TEAMS-WEBHOOK
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK
```

### Configuración de Gmail

Para usar Gmail como servidor SMTP:

1. Habilita la autenticación de 2 factores en tu cuenta de Google
2. Genera una contraseña de aplicación:
   - Ve a [Configuración de la cuenta de Google](https://myaccount.google.com/)
   - Seguridad → Contraseñas de aplicaciones
   - Genera una nueva contraseña para "Correo"
3. Usa esta contraseña en `SMTP_PASS`

### Configuración de Slack

1. Ve a tu workspace de Slack
2. Crea una nueva aplicación en [api.slack.com](https://api.slack.com/apps)
3. Habilita "Incoming Webhooks"
4. Crea un nuevo webhook para el canal deseado
5. Copia la URL del webhook a `SLACK_WEBHOOK_URL`

### Configuración de Microsoft Teams

1. Ve al canal donde quieres recibir notificaciones
2. Haz clic en "..." → "Conectores"
3. Busca y configura "Incoming Webhook"
4. Copia la URL generada a `TEAMS_WEBHOOK_URL`

### Configuración de Discord

1. Ve al servidor de Discord
2. Configuración del canal → Integraciones → Webhooks
3. Crea un nuevo webhook
4. Copia la URL del webhook a `DISCORD_WEBHOOK_URL`

## 📁 Estructura de Reportes

Los reportes se generan en el directorio `reports/`:

```
reports/
├── html/
│   ├── latest-report.html
│   └── test-report-[timestamp].html
├── json/
│   ├── latest-report.json
│   └── test-report-[timestamp].json
├── junit/
│   └── junit.xml
├── coverage/
│   └── [archivos de cobertura de Jest]
├── latest-report.md
└── test-report-[timestamp].md
```

## 🎨 Personalización

### Personalizar Plantillas de Reportes

Puedes modificar las plantillas en `src/reportGenerator.js`:

```javascript
// Personalizar el HTML del reporte
generateHTMLContent(reportData) {
  // Tu plantilla HTML personalizada
}

// Personalizar el formato Markdown
generateMarkdownReport(reportData) {
  // Tu formato Markdown personalizado
}
```

### Personalizar Notificaciones

Modifica `src/notificationService.js` para personalizar los mensajes:

```javascript
// Personalizar mensaje de Slack
async sendSlackNotification(reportData) {
  const payload = {
    // Tu formato de mensaje personalizado
  };
}
```

### Agregar Nuevos Servicios de Notificación

```javascript
// En NotificationService
async sendCustomNotification(reportData) {
  // Implementa tu servicio personalizado
}

// Registra el servicio en sendNotifications()
if (this.customWebhookUrl) {
  const customResult = await this.sendCustomNotification(reportData);
  notifications.push({ type: 'custom', success: true, result: customResult });
}
```

## 🔧 API de Programación

### ReportGenerator

```javascript
const ReportGenerator = require('./src/reportGenerator');
const generator = new ReportGenerator();

// Generar reporte completo
const reportData = await generator.generateTestReport(jestResults);

// Generar solo reporte HTML
const htmlPath = await generator.generateHTMLReport(reportData);

// Generar solo reporte JSON
const jsonPath = await generator.generateJSONReport(reportData);
```

### NotificationService

```javascript
const NotificationService = require('./src/notificationService');
const notifier = new NotificationService();

// Enviar todas las notificaciones configuradas
const results = await notifier.sendNotifications(reportData, reportPaths);

// Enviar solo notificación por email
const emailResult = await notifier.sendEmailNotification(reportData, reportPaths);

// Enviar webhook personalizado
const customResult = await notifier.sendCustomWebhook(url, payload);
```

## 📊 Ejemplos de Reportes

### Reporte de Consola
```
============================================================
📊 REPORTE DE PRUEBAS
============================================================
Estado: ✅ ÉXITO
Total de Pruebas: 25
Exitosas: 25
Fallidas: 0
Omitidas: 0
Tasa de Éxito: 100%
Tiempo Total: 3.45s
Rama: main
Commit: abc123de
Generado: 30/10/2024 14:30:25
============================================================
```

### Notificación de Slack
```
📊 Reporte de Pruebas - 100% éxito
✅ Todas las pruebas pasaron

Total: 25 | Exitosas: 25 | Fallidas: 0
Tiempo: 3.45s | Rama: main | Commit: abc123de
```

## 🚀 Integración con CI/CD

### GitHub Actions

```yaml
name: Tests with Reports
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:report
        env:
          SMTP_USER: ${{ secrets.SMTP_USER }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
      - uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: reports/
```

### GitLab CI

```yaml
test_with_reports:
  stage: test
  script:
    - npm ci
    - npm run test:report
  artifacts:
    reports:
      junit: reports/junit/junit.xml
    paths:
      - reports/
  variables:
    SMTP_USER: $SMTP_USER
    SMTP_PASS: $SMTP_PASS
    SLACK_WEBHOOK_URL: $SLACK_WEBHOOK_URL
```

## 🛠️ Solución de Problemas

### Error de Autenticación SMTP
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solución**: Verifica que uses una contraseña de aplicación, no tu contraseña de Google normal.

### Webhook de Slack no funciona
```
Error: Request failed with status code 400
```
**Solución**: Verifica que la URL del webhook sea correcta y que el canal exista.

### Reportes no se generan
```
Error: ENOENT: no such file or directory, open 'reports/...'
```
**Solución**: El directorio se crea automáticamente. Verifica los permisos de escritura.

## 📚 Recursos Adicionales

- [Documentación de Jest](https://jestjs.io/docs/configuration)
- [API de Slack Webhooks](https://api.slack.com/messaging/webhooks)
- [Conectores de Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/)
- [Webhooks de Discord](https://discord.com/developers/docs/resources/webhook)
- [Nodemailer Documentation](https://nodemailer.com/about/)

## 🤝 Contribuir

Si encuentras bugs o tienes ideas para mejoras:

1. Abre un issue describiendo el problema o la mejora
2. Haz un fork del repositorio
3. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
4. Haz commit de tus cambios: `git commit -am 'Agregar nueva funcionalidad'`
5. Push a la rama: `git push origin feature/nueva-funcionalidad`
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
