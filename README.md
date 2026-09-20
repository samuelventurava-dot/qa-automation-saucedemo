# QA Automation Framework - Saucedemo E2E 

Este repositorio contiene la prueba técnica para la posición de QA Automation Sr. El proyecto consiste en un framework de automatización robusto, escalable y mantenible construido sobre el sitio transaccional [Saucedemo](https://www.saucedemo.com/), cubriendo flujos críticos de E2E (End-to-End).

## Justificación del Stack Tecnológico

La selección de tecnologías se basó en los principios de modernidad, velocidad, prevención de *flaky tests* y mantenibilidad a largo plazo:

*   **Lenguaje: TypeScript.** Aporta tipado estático sobre JavaScript, previniendo errores en tiempo de compilación y mejorando drásticamente la autodocumentación del código. Se alinea naturalmente con el ecosistema de desarrollo Front-end moderno y su manejo asíncrono (`async/await`) es ideal para interacciones web.
*   **Framework: Playwright.** Superior en rendimiento e intercepción de red comparado con soluciones WebDriver tradicionales. Su mecanismo de *auto-waiting* nativo elimina la necesidad de esperas explícitas inestables (`sleep` o `waits` artificiales), resolviendo de raíz la inestabilidad.
*   **Gestor de dependencias: npm.** Es el estándar universal en el ecosistema Node.js, garantizando resolución de dependencias estable mediante `package-lock.json` y compatibilidad total entre entornos Linux y Windows.
*   **Test Runner: Playwright Test.** Incluye ejecución en paralelo de forma nativa, aislamiento total mediante *Browser Contexts*, gestión de *fixtures* y lógica de reintentos incorporada. Evita acoplar herramientas de terceros (como Mocha o Jest) manteniendo la arquitectura limpia.
*   **Reportería: Playwright HTML Reporter + Custom API Reporter.** El reporte HTML nativo ofrece trazas interactivas (*Trace Viewer*) y capturas automáticas invaluables para el *debugging*. Adicionalmente, se desarrolló un *Custom Reporter* para integrarse asíncronamente con herramientas de gestión de terceros (Slack y Jira/Xray).

## Arquitectura y Patrones de Diseño

*   **Page Object Model (POM):** Implementado estrictamente para separar la capa de interacción de la UI (selectores y acciones) de la lógica de negocio de las pruebas, evitando el "código espagueti".
*   **Data-Driven & Sin Hardcoding:** 
    *   Las credenciales sensibles y variables de entorno se inyectan a través de un archivo `.env` (ignorado en el control de versiones).
    *   La data dinámica de las pruebas (usuarios, productos) se consume desde archivos `.json` en el directorio `data/`.
*   **Selectores Dinámicos:** Uso preferencial del atributo `data-test="..."` para asegurar que las pruebas no se rompan ante cambios estéticos de CSS o estructura del DOM.
*   **Wrapper CustomStep:** Se implementó una función envoltorio (`utils/customStep.ts`) sobre `test.step` para garantizar capturas de pantalla exactas a nivel de paso (antes/después de acciones clave) integradas al reporte, sin contaminar los Page Objects con aserciones o lógica de reporte.
*   **Aserciones Flexibles (Soft Assertions):** Implementación de `expect.soft()` para validar elementos no bloqueantes sin detener la suite completa ante un fallo parcial.

## Cobertura de Pruebas (5 Casos Front-End)

1.  **CP01:** Login exitoso y redirección al inventario.
2.  **CP02:** Validación de prevención de acceso y mensajes de error (Usuario bloqueado).
3.  **CP03:** Gestión de carrito (Adición dinámica de productos y validación de contadores y listados).
4.  **CP04:** Ordenamiento dinámico matemático de elementos del inventario (Low to High).
5.  **CP05:** Checkout E2E completo, desde autenticación hasta confirmación de la orden.

---

## Configuración y Ejecución Local

### Prerrequisitos
*   Node.js (v18 o superior)
*   Git
*   Docker (opcional, para ejecución contenerizada)

### 1. Instalación
Clona el repositorio e instala las dependencias exactas usando `ci` para una instalación limpia:
```bash
git clone <URL_DEL_REPOSITORIO>
cd qa-automation-saucedemo
npm ci
```

### Comandos de Ejecución de Pruebas
Playwright ofrece múltiples formas de ejecutar la suite dependiendo de la necesidad:

Ejecución estándar en paralelo (Headless - Recomendada para CI):

```bash
npx playwright test
```

Ejecución con Interfaz Gráfica (Headed - Para debugging visual):
```bash
npx playwright test --headed
```

Ejecutar un archivo de pruebas específico:
```bash
npx playwright test tests/login.spec.ts
```

Modo UI (Interfaz interactiva de Playwright):
```bash
npx playwright test --ui
```

Visualizar el reporte HTML con evidencias (Screenshots y Traces):
```bash
npx playwright show-report
```