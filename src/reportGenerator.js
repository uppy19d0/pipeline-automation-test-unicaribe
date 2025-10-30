const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ReportGenerator {
  constructor() {
    this.reportsDir = path.join(process.cwd(), 'reports');
    this.ensureReportsDirectory();
  }

  ensureReportsDirectory() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    
    const subdirs = ['html', 'json', 'junit', 'coverage'];
    subdirs.forEach(dir => {
      const dirPath = path.join(this.reportsDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  async generateTestReport(testResults) {
    const timestamp = new Date().toISOString();
    const reportData = {
      timestamp,
      summary: this.extractSummary(testResults),
      testSuites: this.extractTestSuites(testResults),
      coverage: this.extractCoverage(),
      environment: this.getEnvironmentInfo()
    };

    // Generate multiple report formats
    await Promise.all([
      this.generateJSONReport(reportData),
      this.generateHTMLReport(reportData),
      this.generateMarkdownReport(reportData)
    ]);

    return reportData;
  }

  extractSummary(testResults) {
    return {
      totalTests: testResults.numTotalTests || 0,
      passedTests: testResults.numPassedTests || 0,
      failedTests: testResults.numFailedTests || 0,
      skippedTests: testResults.numPendingTests || 0,
      totalTime: testResults.testResults?.reduce((acc, suite) => acc + (suite.perfStats?.end - suite.perfStats?.start || 0), 0) || 0,
      success: testResults.success || false
    };
  }

  extractTestSuites(testResults) {
    if (!testResults.testResults) return [];
    
    return testResults.testResults.map(suite => ({
      name: suite.testFilePath ? path.basename(suite.testFilePath) : 'Unknown',
      fullPath: suite.testFilePath,
      status: suite.status,
      duration: suite.perfStats ? suite.perfStats.end - suite.perfStats.start : 0,
      tests: suite.assertionResults?.map(test => ({
        name: test.title,
        status: test.status,
        duration: test.duration || 0,
        errorMessage: test.failureMessages?.join('\n') || null
      })) || []
    }));
  }

  extractCoverage() {
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (fs.existsSync(coveragePath)) {
      try {
        return JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      } catch (error) {
        console.warn('Could not read coverage data:', error.message);
      }
    }
    return null;
  }

  getEnvironmentInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      timestamp: new Date().toISOString(),
      gitCommit: this.getGitCommit(),
      gitBranch: this.getGitBranch()
    };
  }

  getGitCommit() {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  getGitBranch() {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  async generateJSONReport(reportData) {
    const filePath = path.join(this.reportsDir, 'json', `test-report-${Date.now()}.json`);
    const latestPath = path.join(this.reportsDir, 'json', 'latest-report.json');
    
    fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));
    fs.writeFileSync(latestPath, JSON.stringify(reportData, null, 2));
    
    console.log(`JSON report generated: ${filePath}`);
    return filePath;
  }

  async generateHTMLReport(reportData) {
    const html = this.generateHTMLContent(reportData);
    const filePath = path.join(this.reportsDir, 'html', `test-report-${Date.now()}.html`);
    const latestPath = path.join(this.reportsDir, 'html', 'latest-report.html');
    
    fs.writeFileSync(filePath, html);
    fs.writeFileSync(latestPath, html);
    
    console.log(`HTML report generated: ${filePath}`);
    return filePath;
  }

  generateHTMLContent(reportData) {
    const { summary, testSuites, coverage, environment } = reportData;
    const successRate = summary.totalTests > 0 ? (summary.passedTests / summary.totalTests * 100).toFixed(2) : 0;
    
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Pruebas - ${reportData.timestamp}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .metric.success { border-left-color: #28a745; }
        .metric.danger { border-left-color: #dc3545; }
        .metric.warning { border-left-color: #ffc107; }
        .metric h3 { margin: 0 0 10px 0; color: #495057; }
        .metric .value { font-size: 2em; font-weight: bold; color: #212529; }
        .section { padding: 30px; border-top: 1px solid #dee2e6; }
        .section h2 { color: #495057; margin-bottom: 20px; }
        .test-suite { background: #f8f9fa; margin-bottom: 20px; border-radius: 8px; overflow: hidden; }
        .suite-header { background: #e9ecef; padding: 15px; font-weight: bold; display: flex; justify-content: between; align-items: center; }
        .suite-status { padding: 4px 8px; border-radius: 4px; color: white; font-size: 0.8em; }
        .suite-status.passed { background: #28a745; }
        .suite-status.failed { background: #dc3545; }
        .test-list { padding: 15px; }
        .test-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #dee2e6; }
        .test-item:last-child { border-bottom: none; }
        .test-status { padding: 2px 6px; border-radius: 3px; color: white; font-size: 0.7em; }
        .test-status.passed { background: #28a745; }
        .test-status.failed { background: #dc3545; }
        .error-message { color: #dc3545; font-size: 0.9em; margin-top: 5px; font-family: monospace; }
        .coverage-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
        .coverage-item { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
        .coverage-percentage { font-size: 1.5em; font-weight: bold; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Reporte de Pruebas</h1>
            <p>Generado el ${new Date(reportData.timestamp).toLocaleString('es-ES')}</p>
        </div>
        
        <div class="summary">
            <div class="metric ${summary.success ? 'success' : 'danger'}">
                <h3>Estado General</h3>
                <div class="value">${summary.success ? '✅ ÉXITO' : '❌ FALLO'}</div>
            </div>
            <div class="metric">
                <h3>Total de Pruebas</h3>
                <div class="value">${summary.totalTests}</div>
            </div>
            <div class="metric success">
                <h3>Pruebas Exitosas</h3>
                <div class="value">${summary.passedTests}</div>
            </div>
            <div class="metric ${summary.failedTests > 0 ? 'danger' : ''}">
                <h3>Pruebas Fallidas</h3>
                <div class="value">${summary.failedTests}</div>
            </div>
            <div class="metric">
                <h3>Tasa de Éxito</h3>
                <div class="value">${successRate}%</div>
            </div>
            <div class="metric">
                <h3>Tiempo Total</h3>
                <div class="value">${(summary.totalTime / 1000).toFixed(2)}s</div>
            </div>
        </div>

        <div class="section">
            <h2>📋 Suites de Pruebas</h2>
            ${testSuites.map(suite => `
                <div class="test-suite">
                    <div class="suite-header">
                        <span>${suite.name}</span>
                        <span class="suite-status ${suite.status}">${suite.status.toUpperCase()}</span>
                    </div>
                    <div class="test-list">
                        ${suite.tests.map(test => `
                            <div class="test-item">
                                <div>
                                    <span>${test.name}</span>
                                    ${test.errorMessage ? `<div class="error-message">${test.errorMessage}</div>` : ''}
                                </div>
                                <span class="test-status ${test.status}">${test.status}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        ${coverage ? `
        <div class="section">
            <h2>📈 Cobertura de Código</h2>
            <div class="coverage-grid">
                <div class="coverage-item">
                    <h4>Líneas</h4>
                    <div class="coverage-percentage">${coverage.total?.lines?.pct || 0}%</div>
                </div>
                <div class="coverage-item">
                    <h4>Funciones</h4>
                    <div class="coverage-percentage">${coverage.total?.functions?.pct || 0}%</div>
                </div>
                <div class="coverage-item">
                    <h4>Ramas</h4>
                    <div class="coverage-percentage">${coverage.total?.branches?.pct || 0}%</div>
                </div>
                <div class="coverage-item">
                    <h4>Declaraciones</h4>
                    <div class="coverage-percentage">${coverage.total?.statements?.pct || 0}%</div>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h2>🔧 Información del Entorno</h2>
            <p><strong>Node.js:</strong> ${environment.nodeVersion}</p>
            <p><strong>Plataforma:</strong> ${environment.platform} (${environment.arch})</p>
            <p><strong>Rama Git:</strong> ${environment.gitBranch}</p>
            <p><strong>Commit:</strong> ${environment.gitCommit.substring(0, 8)}</p>
        </div>

        <div class="footer">
            <p>Reporte generado automáticamente por CI Simple Node Project</p>
        </div>
    </div>
</body>
</html>`;
  }

  async generateMarkdownReport(reportData) {
    const { summary, testSuites, coverage, environment } = reportData;
    const successRate = summary.totalTests > 0 ? (summary.passedTests / summary.totalTests * 100).toFixed(2) : 0;
    
    const markdown = `# 📊 Reporte de Pruebas

**Generado:** ${new Date(reportData.timestamp).toLocaleString('es-ES')}

## 📈 Resumen

| Métrica | Valor |
|---------|-------|
| Estado General | ${summary.success ? '✅ ÉXITO' : '❌ FALLO'} |
| Total de Pruebas | ${summary.totalTests} |
| Pruebas Exitosas | ${summary.passedTests} |
| Pruebas Fallidas | ${summary.failedTests} |
| Pruebas Omitidas | ${summary.skippedTests} |
| Tasa de Éxito | ${successRate}% |
| Tiempo Total | ${(summary.totalTime / 1000).toFixed(2)}s |

## 📋 Suites de Pruebas

${testSuites.map(suite => `
### ${suite.name}
- **Estado:** ${suite.status}
- **Duración:** ${(suite.duration / 1000).toFixed(2)}s
- **Pruebas:** ${suite.tests.length}

${suite.tests.map(test => `- ${test.status === 'passed' ? '✅' : '❌'} ${test.name}${test.errorMessage ? `\n  \`\`\`\n  ${test.errorMessage}\n  \`\`\`` : ''}`).join('\n')}
`).join('\n')}

${coverage ? `## 📈 Cobertura de Código

| Tipo | Cobertura |
|------|-----------|
| Líneas | ${coverage.total?.lines?.pct || 0}% |
| Funciones | ${coverage.total?.functions?.pct || 0}% |
| Ramas | ${coverage.total?.branches?.pct || 0}% |
| Declaraciones | ${coverage.total?.statements?.pct || 0}% |
` : ''}

## 🔧 Información del Entorno

- **Node.js:** ${environment.nodeVersion}
- **Plataforma:** ${environment.platform} (${environment.arch})
- **Rama Git:** ${environment.gitBranch}
- **Commit:** ${environment.gitCommit.substring(0, 8)}

---
*Reporte generado automáticamente por CI Simple Node Project*
`;

    const filePath = path.join(this.reportsDir, `test-report-${Date.now()}.md`);
    const latestPath = path.join(this.reportsDir, 'latest-report.md');
    
    fs.writeFileSync(filePath, markdown);
    fs.writeFileSync(latestPath, markdown);
    
    console.log(`Markdown report generated: ${filePath}`);
    return filePath;
  }
}

module.exports = ReportGenerator;
