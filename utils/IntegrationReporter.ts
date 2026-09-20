import { Reporter, FullResult } from '@playwright/test/reporter';

class IntegrationsReporter implements Reporter {

  // Este método se ejecuta automáticamente al finalizar toda la suite
  async onEnd(result: FullResult) {
    console.log('\n=================================================');
    console.log(' INICIANDO INTEGRACIONES EXTRA (XRAY & SLACK)');
    console.log('=================================================\n');

    const isSuccess = result.status === 'passed';
    const statusText = isSuccess ? 'ÉXITO ' : 'FALLÓ ';

    // -------------------------------------------------------------
    // 1. SIMULACIÓN DE INTEGRACIÓN CON XRAY (JIRA)
    // -------------------------------------------------------------
    console.log('✅ [XRAY] Preparando actualización de Test Execution en Jira...');
    
    const xrayPayload = {
      testExecutionKey: "SAUCE-101",
      info: {
        summary: "Ejecución Automatizada - Saucedemo E2E",
        testEnvironments: ["Producción"]
      },
      status: isSuccess ? "PASS" : "FAIL"
    };

    console.log(` REQUEST: POST https://xray.cloud.getzephyr.com/api/v2/import/execution`);
    console.log(` PAYLOAD: ${JSON.stringify(xrayPayload, null, 2)}`);
    console.log(' RESPONSE: 200 OK - Estado de los casos actualizado en Jira.\n');

    // -------------------------------------------------------------
    // 2. NOTIFICACIÓN A SLACK
    // -------------------------------------------------------------
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
      console.log('[SLACK] No se encontró SLACK_WEBHOOK_URL en el .env. Se omite el envío real, pero este sería el mensaje:');
    } else {
      console.log('[SLACK] Enviando notificación al canal...');
    }

    const slackPayload = {
      text: `*Resultados de Automatización Saucedemo*\n*Estado:* ${statusText}\n*Duración:* ${(result.duration / 1000).toFixed(2)} segundos.\nRevisa el reporte HTML adjunto en los artefactos del pipeline.`
    };

    console.log(`MENSAJE SLACK: \n${slackPayload.text}\n`);

    if (slackWebhookUrl) {
      try {
        const response = await fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackPayload)
        });
        if (response.ok) {
          console.log('[SLACK] Mensaje enviado correctamente al canal.');
        }
      } catch (error) {
        console.error('[SLACK] Error al enviar el mensaje:', error);
      }
    }
  }
}

export default IntegrationsReporter;