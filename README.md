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

