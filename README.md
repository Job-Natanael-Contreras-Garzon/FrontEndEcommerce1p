# FrontEndEcommerce1p
 
# Estructura para Frontend en Angular - FlaskEcommerce

## Estructura de Directorios

```
flask-ecommerce-admin/
├── angular.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── main.ts
    ├── polyfills.ts
    ├── index.html
    ├── styles.scss
    ├── environments/
    │   ├── environment.ts
    │   └── environment.prod.ts
    └── app/
        ├── app.module.ts
        ├── app-routing.module.ts
        ├── core/                        # singleton services, interceptors, guards, modelos
        │   ├── services/
        │   │   ├── api.service.ts       # carga base de tu API  
        │   │   ├── auth.service.ts      # login, logout, manejo de token
        │   ├── interceptors/
        │   │   └── token.interceptor.ts # añade JWT a cada petición
        │   ├── guards/
        │   │   └── auth.guard.ts        # protege rutas admin
        │   ├── models/                  # interfaces TS (User, Product, Order…)
        │   │   └── user.model.ts
        │   └── core.module.ts
        ├── shared/                      # componentes y utilidades reutilizables
        │   ├── components/
        │   │   ├── header/
        │   │   │   ├── header.component.ts
        │   │   │   └── header.component.html
        │   │   ├── footer/
        │   │   └── alert/
        │   ├── pipes/
        │   │   └── date-format.pipe.ts
        │   ├── directives/
        │   │   └── has-role.directive.ts
        │   └── shared.module.ts
        ├── layouts/
        │   ├── auth-layout/             # login, error pages…
        │   └── admin-layout/            # menú lateral, toolbar, footer
        ├── features/                    # agrupado por casos de uso
        │   ├── auth/                    # login, register, reset-password
        │   │   ├── login/
        │   │   └── register/
        │   ├── dashboard/               # vistas iniciales del admin
        │   ├── users/                   # CRUD usuarios admin
        │   ├── products/                # CRUD productos
        │   ├── orders/                  # gestión de pedidos
        │   └── reports/                 # generación de informes
        └── styles/                      # variables SCSS, temas…

```

# Panel de Administración – Vistas y Endpoints

> Este documento reúne el diseño de las pantallas principales del panel web (tablas, filtros y botones) **y** los endpoints REST que las respaldan.

---

## 0 · Autenticación

| Acción | Endpoint | Método | Cuerpo JSON | Respuesta JSON |
|--------|----------|--------|-------------|----------------|
| Sign Up | `/api/auth/signup` | **POST** | `{ username, email, password, roles? }` | `{ message }` |
| Sign In | `/api/auth/signin` | **POST** | `{ username, password }` | `{ id, username, email, roles, accessToken }` |

--------|----------|--------|-------------|----------------|
| Login  | `/api/login`    | **POST** | `{ email, password }` | `{ status, message, token, user_id }` |
| Registro | `/api/register` | **POST** | `{ name, email, password }` | `{ status, message, user_id }` |

---

## 1 · Gestión de Usuarios

### Vista (Frontend)

| ID | Nombre de usuario | Email | Roles | Acciones |
|----|-------------------|-------|-------|----------|
| 60d21b4667… | usuario123 | usuario@ejemplo.com | Admin | ✏️ 🗑️ |

- Filtro por rol (admin / usuario).
- Botón **Nuevo Usuario**.

### Endpoints

| Operación | Endpoint | Método | Cuerpo JSON | Encabezados | Respuesta |
|-----------|----------|--------|-------------|-------------|-----------|
| Obtener todos | `/api/users` | GET | — | `x-access-token` | Array de usuarios |
| Obtener uno  | `/api/users/:id` | GET | — | `x-access-token` | Usuario |
| Crear        | — *(no definido)* | POST | `{ username, email, password }` | `x-access-token` | nuevo usuario |
| Actualizar   | `/api/users/:id` | PUT | `{ username, email, password }` | `x-access-token` | mensaje éxito |
| Eliminar     | `/api/users/:id` | DELETE | — | `x-access-token` | mensaje éxito |

---

## 2 · Gestión de Categorías

### Vista (Frontend)

| ID | Nombre | Descripción | Acciones |
|----|--------|-------------|----------|
| 60d21b4667… | Electrónica | Productos electrónicos | ✏️ 🗑️ |

- Botón **Nueva Categoría**.

### Endpoints

| Operación | Endpoint | Método | Cuerpo JSON | Encabezados | Respuesta |
|-----------|----------|--------|-------------|-------------|-----------|
| Obtener todas | `/api/categories` | GET | — | — | Array de categorías |
| Obtener una  | `/api/categories/:id` | GET | — | — | Categoría |
| Crear        | `/api/categories` | POST | `{ name, description }` | `x-access-token` | Categoría creada |
| Actualizar   | `/api/categories/:id` | PUT | `{ name, description }` | `x-access-token` | mensaje éxito |
| Eliminar     | `/api/categories/:id` | DELETE | — | `x-access-token` | mensaje éxito |

---

## 3 · Gestión de Productos

### Vista (Frontend)

| ID | Nombre | Precio | Categoría | Stock | Imagen | Acciones |
|----|--------|--------|-----------|-------|--------|----------|
| 60d21b4667… | Smartphone XYZ | 599.99 | Electrónica | 50 | [🔗] | ✏️ 🗑️ |

- Filtros: categoría, precio, stock.
- Botón **Nuevo Producto**.

### Endpoints

| Operación | Endpoint | Método | Cuerpo JSON | Encabezados | Respuesta |
|-----------|----------|--------|-------------|-------------|-----------|
| Obtener todos | `/api/products` | GET | query params | — | Array de productos |
| Obtener uno   | `/api/products/:id` | GET | — | — | Producto |
| Crear         | `/api/products` | POST | `{ name, description, price, category, stock, imageUrl }` | `x-access-token` | Producto creado |
| Actualizar    | `/api/products/:id` | PUT | campos a cambiar | `x-access-token` | mensaje éxito |
| Eliminar      | `/api/products/:id` | DELETE | — | `x-access-token` | mensaje éxito |

---

## 4 · Gestión de Órdenes / Pedidos

### Vista (Frontend)

| ID | Usuario | Fecha | Total | Estado | Dirección de envío | Acciones |
|----|---------|-------|-------|--------|--------------------|----------|
| 60d21b4667… | usuario123 | 2023‑06‑20 | 599.99 | Pendiente | Calle Principal | ✏️ 🔍 |

- Filtros por estado y fecha.

### Endpoints

| Operación | Endpoint | Método | Cuerpo JSON | Encabezados | Respuesta |
|-----------|----------|--------|-------------|-------------|-----------|
| Obtener todas | `/api/orders` | GET | — | `x-access-token` | Array de órdenes |
| Obtener una  | `/api/orders/:id` | GET | — | `x-access-token` | Orden |
| Crear        | `/api/orders` | POST | `{ products[], shippingAddress }` | `x-access-token` | Orden creada |
| Cambiar estado | `/api/orders/:id/status` | PUT | `{ status }` | `x-access-token` | mensaje éxito |
| Eliminar *(si aplica)* | — | — | — | — | — |

---

> **Notas de seguridad**
> *Todos los endpoints que modifican recursos requieren el encabezado* `x-access-token` *con un JWT válido (rol admin donde corresponda).*

