# TickerLab UI

`tickerlab-ui` es el panel de control y visualización para el ecosistema TickerLab. Proporciona una interfaz intuitiva para ejecutar pipelines de análisis cuantitativo y visualizar la robustez de los patrones detectados en activos financieros.

## 🚀 Características

- **Dashboard de Análisis**: Interfaz optimizada para la búsqueda de tickers y selección de temporalidades.
- **Visualización de Pivots**: Integración con `lightweight-charts` (TradingView) para representar la estructura de precios y los puntos de giro (Highs/Lows).
- **Métricas Cuantitativas**: Visualización instantánea de KPIs como Sharpe Ratio, Sortino, Win Rate y Profit Factor.
- **Validación Walk-forward**: Panel de robustez que muestra el score general y el desempeño detallado por folds.
- **Estado en Tiempo Real**: Gestión de estados de carga y errores mediante Zustand.

## 🛠️ Stack Tecnológico

- **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Visualización**: [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) (TradingView)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)

## 📦 Instalación y Ejecución

### Requisitos previos
- Node.js $\ge$ 18.0.0
- `tickerlab-services` ejecutándose en `http://localhost:8000`

### Instalación local
```bash
# Navegar al directorio del UI
cd tickerlab-ui

# Instalar dependencias
npm install
```

### Ejecución en desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

## 🔌 Integración con el Backend

La aplicación se comunica con `tickerlab-services` a través del cliente definido en `src/api/client.ts`.

**Endpoint principal:**
- `POST /analysis/analyze`: Envía el símbolo y timeframe para obtener el análisis completo.

## 📂 Estructura del Proyecto

- `src/api/`: Clientes de comunicación con el servidor.
- `src/components/`: Componentes modulares de la interfaz.
  - `layout/`: Componentes estructurales (TopBar, etc).
  - `analysis/`: Componentes de visualización de datos (PriceChart, MetricsCard).
- `src/store/`: Gestión de estado global con Zustand.
- `src/types/`: Definiciones de TypeScript para las respuestas de la API.
