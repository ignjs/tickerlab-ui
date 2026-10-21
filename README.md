# TickerLab UI

`tickerlab-ui` es la interfaz web de TickerLab para consultar análisis de activos financieros. El terminal reúne búsqueda de símbolos, selección de periodos, gráficos de precios y métricas de análisis en una sola vista.

## Características

- **Terminal de análisis** con búsqueda de símbolos y periodos `1D`, `1W`, `1M`, `1Y`, `YTD` y `ALL`.
- **Watchlist** con accesos rápidos a IONQ, TSLA, NVDA, AAPL y MSFT. Los datos de precio y variación se muestran para el activo consultado; no hay un feed WebSocket conectado.
- **Gráfico interactivo** de velas y volumen, con pivotes High/Low y niveles recientes de soporte y resistencia.
- **Panel de métricas** con hit rate, factor de beneficio, Sharpe, retornos medios y medianos, drawdown máximo, AUC y estabilidad.
- **Estado de la API** actualizado periódicamente y estados de carga y error durante las consultas.
- **Diseño adaptable** para pantallas estrechas y grandes.

## Stack tecnológico

- React 19 y TypeScript
- Vite 8
- Zustand y Axios
- Lightweight Charts
- Tailwind CSS 4
- Lucide React
- Vitest y Testing Library

## Requisitos

- Node.js `20.19+` o `22.12+`
- npm
- `tickerlab-services` disponible en `http://localhost:8000`

## Instalación y ejecución

Desde la raíz del repositorio:

```bash
npm ci
npm run dev
```

Vite inicia el entorno de desarrollo en `http://localhost:5173`.

## Comandos

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Verificación de TypeScript y build de producción
npm run preview   # Vista previa del build
npm run lint      # Análisis estático con oxlint
npm test -- --run # Ejecutar las pruebas una vez
```

## Integración con el backend

El cliente HTTP de `src/api/client.ts` usa `http://localhost:8000` como URL base. Comprueba la disponibilidad mediante `GET /health` y envía los análisis a `POST /analysis/analyze`.

El cuerpo de análisis incluye el símbolo y el periodo seleccionado. Las selecciones se traducen así:

| Periodo de la interfaz | Timeframe de datos | Periodo de datos |
| --- | --- | --- |
| `1D` | `5m` | `1d` |
| `1W` | `30m` | `5d` |
| `1M` | `1d` | `1mo` |
| `1Y` | `1d` | `1y` |
| `YTD` | `1d` | `ytd` |
| `ALL` | `1d` | `max` |

## Estructura del proyecto

- `src/api/`: cliente REST para los servicios de análisis.
- `src/components/ConsoleDashboard.tsx`: composición principal del terminal.
- `src/components/terminal/`: barra de búsqueda, watchlist, gráfico y panel de métricas.
- `src/components/analysis/`: componentes de análisis, incluido el gráfico de precios.
- `src/store/`: estado global de ticker, periodo y resultados con Zustand.
- `src/types/`: tipos de solicitud y respuesta de análisis.
- `src/__tests__/` y `src/components/analysis/__tests__/`: pruebas.
