#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Import our custom modules
const ReportGenerator = require('../src/reportGenerator');
const NotificationService = require('../src/notificationService');

class TestRunner {
  constructor() {
    this.reportGenerator = new ReportGenerator();
    this.notificationService = new NotificationService();
    this.projectRoot = path.resolve(__dirname, '..');
  }

  async runTests() {
    console.log('🚀 Iniciando ejecución de pruebas con generación de reportes...\n');
    
    try {
      // Run Jest tests and capture results
      const testResults = await this.executeJestTests();
      
      // Generate reports
      console.log('\n📊 Generando reportes...');
      const reportData = await this.reportGenerator.generateTestReport(testResults);
      
      // Get report file paths
      const reportPaths = {
        html: path.join(this.reportGenerator.reportsDir, 'html', 'latest-report.html'),
        json: path.join(this.reportGenerator.reportsDir, 'json', 'latest-report.json'),
        markdown: path.join(this.reportGenerator.reportsDir, 'latest-report.md')
      };
      
      // Send notifications
      console.log('\n📧 Enviando notificaciones...');
      const notifications = await this.notificationService.sendNotifications(reportData, reportPaths);
      
      // Summary
      this.printSummary(reportData, reportPaths, notifications);
      
      // Exit with appropriate code
      process.exit(testResults.success ? 0 : 1);
      
    } catch (error) {
      console.error('❌ Error durante la ejecución:', error.message);
      process.exit(1);
    }
  }

  async executeJestTests() {
    return new Promise((resolve, reject) => {
      // Jest configuration
      const jestArgs = [
        '--ci',
        '--coverage',
        '--reporters=default',
        '--reporters=jest-junit',
        '--json',
        '--outputFile=test-results.json'
      ];

      // Add verbose flag if requested
      if (process.argv.includes('--verbose')) {
        jestArgs.push('--verbose');
      }

      // Add specific test pattern if provided
      const testPattern = process.argv.find(arg => arg.startsWith('--testNamePattern='));
      if (testPattern) {
        jestArgs.push(testPattern);
      }

      console.log(`Ejecutando: jest ${jestArgs.join(' ')}`);
      
      const jest = spawn('npx', ['jest', ...jestArgs], {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      jest.on('close', (code) => {
        try {
          // Read Jest JSON output
          const resultsPath = path.join(this.projectRoot, 'test-results.json');
          let testResults = { success: code === 0 };
          
          if (fs.existsSync(resultsPath)) {
            const rawResults = fs.readFileSync(resultsPath, 'utf8');
            testResults = JSON.parse(rawResults);
            testResults.success = code === 0;
            
            // Clean up temporary file
            fs.unlinkSync(resultsPath);
          }
          
          resolve(testResults);
        } catch (error) {
          console.warn('⚠️  No se pudo leer el archivo de resultados JSON, usando datos básicos');
          resolve({
            success: code === 0,
            numTotalTests: 0,
            numPassedTests: 0,
            numFailedTests: 0,
            numPendingTests: 0,
            testResults: []
          });
        }
      });

      jest.on('error', (error) => {
        reject(new Error(`Error ejecutando Jest: ${error.message}`));
      });
    });
  }

  printSummary(reportData, reportPaths, notifications) {
    const { summary } = reportData;
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 RESUMEN DE EJECUCIÓN');
    console.log('='.repeat(60));
    
    // Test results
    console.log(`Estado: ${summary.success ? '✅ ÉXITO' : '❌ FALLO'}`);
    console.log(`Total de pruebas: ${summary.totalTests}`);
    console.log(`Exitosas: ${summary.passedTests}`);
    console.log(`Fallidas: ${summary.failedTests}`);
    
    // Reports generated
    console.log('\n📊 Reportes generados:');
    Object.entries(reportPaths).forEach(([type, filePath]) => {
      if (fs.existsSync(filePath)) {
        console.log(`  • ${type.toUpperCase()}: ${filePath}`);
      }
    });
    
    // Notifications sent
    console.log('\n📧 Notificaciones enviadas:');
    notifications.forEach(notification => {
      const status = notification.success ? '✅' : '❌';
      console.log(`  • ${notification.type.toUpperCase()}: ${status}`);
    });
    
    console.log('='.repeat(60) + '\n');
  }
}

// CLI interface
if (require.main === module) {
  const runner = new TestRunner();
  
  // Handle CLI arguments
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Uso: npm run test:report [opciones]

Opciones:
  --verbose              Mostrar salida detallada de las pruebas
  --testNamePattern=<pattern>  Ejecutar solo pruebas que coincidan con el patrón
  --help, -h            Mostrar esta ayuda

Variables de entorno para notificaciones:
  SMTP_HOST             Host del servidor SMTP (default: smtp.gmail.com)
  SMTP_PORT             Puerto SMTP (default: 587)
  SMTP_USER             Usuario SMTP
  SMTP_PASS             Contraseña SMTP
  NOTIFICATION_EMAIL    Email de destino para notificaciones
  SLACK_WEBHOOK_URL     URL del webhook de Slack
  TEAMS_WEBHOOK_URL     URL del webhook de Microsoft Teams
  DISCORD_WEBHOOK_URL   URL del webhook de Discord

Ejemplos:
  npm run test:report
  npm run test:report -- --verbose
  npm run test:report -- --testNamePattern="Calculator"
`);
    process.exit(0);
  }
  
  runner.runTests().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
