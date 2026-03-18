# BTG Pactual – Gestión de Fondos (FPV/FIC)

Aplicación web interactiva para la gestión de fondos de inversión FPV y FIC de BTG Pactual. Permite a los usuarios visualizar fondos disponibles, suscribirse, cancelar participaciones y consultar el historial de transacciones.

---

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Visualizar fondos | Lista de fondos con nombre, categoría y monto mínimo |
| Suscripción | Suscribirse a un fondo si el saldo es suficiente |
| Cancelación | Cancelar participación y ver saldo actualizado |
| Historial | Registro completo de suscripciones y cancelaciones |
| Notificaciones | Selección de método (email o SMS) al suscribirse |
| Validaciones | Mensajes de error si el saldo es insuficiente |

---

## Tecnologías

- **Angular 21** (Standalone Components)
- **TypeScript**
- **Angular Signals** – manejo de estado reactivo (`signal`, `computed`)
- **Angular Reactive Forms** – formularios con validación
- **Angular Router** – navegación con lazy loading
- **HttpClient** – consumo de mocks REST con interceptor de errores centralizado
- **RxJS** – manejo de streams asincrónicos
- **SCSS** – estilos responsivos con CSS Variables
- Sin dependencias de UI externas (Material, Bootstrap, etc.)

---

## Requisitos previos

- **Node.js** >= 18
- **npm** >= 9

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd fpv-app

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm start
```

Abrir en el navegador: **http://localhost:4200**

---

## Comandos disponibles

```bash
npm start          # Servidor de desarrollo (ng serve)
npm run build      # Build de producción
npm test           # Pruebas unitarias con Vitest
```

---

## Arquitectura del proyecto

```
src/
└── app/
    ├── models/
    │   ├── fund.model.ts            # Fund, FundCategory
    │   ├── transaction.model.ts     # Transaction, TransactionType, NotificationMethod
    │   ├── action-result.model.ts   # ActionResult, ActionErrorCode
    │   ├── toast.model.ts           # Toast, ToastType
    │   └── user.model.ts            # User
    │
    ├── services/
    │   ├── fund.service.ts          # GET /mock-funds.json vía HttpClient
    │   ├── user.service.ts          # GET /mock-user.json vía HttpClient
    │   ├── portfolio.service.ts     # Estado del portafolio + reglas de negocio
    │   ├── transaction.service.ts   # Historial de transacciones
    │   └── toast.service.ts        # Notificaciones tipo snackbar
    │
    ├── interceptors/
    │   └── http-error.interceptor.ts  # Centraliza manejo de errores HTTP
    │
    ├── pipes/
    │   └── cop-currency.pipe.ts     # Transforma número a moneda COP en templates
    │
    ├── utils/
    │   └── currency.utils.ts        # formatCOP() – función utilitaria pura
    │
    ├── components/
    │   ├── navbar/                  # Barra de navegación con saldo y enlaces
    │   ├── fund-card/               # Tarjeta de fondo con botones de acción
    │   ├── subscription-modal/      # Modal de confirmación con selección de notificación
    │   └── toast/                   # Renderiza las notificaciones activas
    │
    ├── pages/
    │   ├── home/                    # Página principal – fondos disponibles
    │   └── history/                 # Página de historial de transacciones
    │
    ├── app.ts                       # Componente raíz
    ├── app.routes.ts                # Rutas con lazy loading
    └── app.config.ts                # Providers globales (router, HttpClient, interceptor, initializer)
```

---

## Datos simulados (Mock API)

El servicio `FundService` simula una API REST con los siguientes fondos:

| ID | Nombre | Monto mínimo | Categoría |
|---|---|---|---|
| 1 | FPV_BTG_PACTUAL_RECAUDADORA | COP $75.000 | FPV |
| 2 | FPV_BTG_PACTUAL_ECOPETROL | COP $125.000 | FPV |
| 3 | DEUDAPRIVADA | COP $50.000 | FIC |
| 4 | FDO-ACCIONES | COP $250.000 | FIC |
| 5 | FPV_BTG_PACTUAL_DINAMICA | COP $100.000 | FPV |

El usuario inicia con un **saldo de COP $500.000**.

---

## Decisiones de diseño

- **Angular Signals**: se usa `signal()` y `computed()` para el estado reactivo en lugar de `BehaviorSubject`/`Observable`.
- **Lazy loading**: cada página se carga bajo demanda con `loadComponent()`.
- **Interceptor HTTP centralizado**: `httpErrorInterceptor` captura todos los errores de red sin necesidad de manejo individual en cada servicio.
- **`provideAppInitializer`**: los datos del usuario se cargan antes de que arranque la app, garantizando que el estado inicial esté disponible de forma síncrona.
- **Separación de responsabilidades (SRP)**: cada clase tiene una sola razón para cambiar — modelos en `models/`, utilidades puras en `utils/`, pipes solo para templates.
- **Diseño responsivo**: grilla de 3 columnas en escritorio, 2 en tablet y 1 en móvil.
- **Accesibilidad**: roles ARIA en modales, `aria-live` en toasts, etiquetas semánticas.

---

## Consideraciones sobre `PortfolioService` en producción

En este proyecto `PortfolioService` cumple dos roles simultáneamente porque no existe backend:

1. **Capa de estado** — mantiene el saldo y los fondos suscritos en signals
2. **Reglas de negocio** — valida saldo suficiente, detecta suscripciones duplicadas

En un entorno real con backend, esta separación sería explícita:

```
PortfolioApiService      → HttpClient calls
  subscribe()            → POST /api/portfolio/subscribe
  cancelSubscription()   → DELETE /api/portfolio/{fundId}

PortfolioStateService    → Angular Signals
  balance                → actualizado con la respuesta del API
  subscribedFundIds      → actualizado con la respuesta del API
```

La **validación de negocio** (saldo suficiente, no duplicados) residiría en el backend. El frontend podría mantener una pre-validación optimista para mejorar la UX, pero la fuente de verdad siempre sería la respuesta del API.
# customers-BTG
