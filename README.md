# Catálogo de cuentas — Aravia

Módulo para administrar el catálogo de cuentas: API en NestJS y pantalla en React.

## Cómo correrlo

    npm install
    npm install --prefix api
    npm install --prefix web
    npm run dev

- API: http://localhost:3000
- Web: http://localhost:5173

## Qué hace

- Crear cuenta (valida formato numérico, longitud 1/2/4/6, duplicado y padre existente).
- Consultar el catálogo como árbol anidado.
- Eliminar cuenta (rechaza si tiene hijas).
- Pantalla con árbol expandible, formulario con validación local y errores de la API junto a cada campo, eliminación con confirmación, y estados de carga y error.
- Opcionales: nivel y naturaleza visibles en el árbol; crear hija con código prellenado.

## Backend: Clean Architecture

    api/src/accounts/
    ├── domain/          # Account, errores de dominio, interfaz AccountRepository
    ├── application/     # casos de uso: crear, consultar árbol, eliminar
    └── infrastructure/  # repositorio en memoria, controller HTTP, filtro de errores

Las dependencias apuntan hacia adentro. `domain` y `application` no importan nada de NestJS
(verificable con `grep "@nestjs"`). La interfaz del repositorio la define el dominio y la
infraestructura la implementa. Los casos de uso son clases planas; `accounts.module.ts` es el
único lugar que las construye con Nest.

Los errores de dominio llevan `code` y `field`. Un filtro los traduce a HTTP
(400, 404, 409, 422) con el formato `{ code, message, field }`, que el frontend usa para
pintar cada error junto a su campo.

## Decisiones

- **Persistencia en memoria:** cabe en el tiempo de la prueba y la interfaz del repositorio
  permite cambiarla por una base de datos sin tocar dominio ni casos de uso. Contra: los
  datos se pierden al reiniciar.
- **Naturaleza:** se pide solo al crear una clase (1 dígito); los demás niveles la heredan.
  El enunciado no dice cómo se asigna, así que lo resolví así.
- **Frontend por funcionalidad:** `api/` (cliente HTTP), `features/accounts/` (componentes,
  hooks, tipos). Cada pieza tiene un solo trabajo y se ve de un vistazo dónde vive cada cosa.
- **Tailwind:** estilos rápidos sin curva de aprendizaje; no justificaba una librería de
  componentes para un árbol y un formulario.
- **TanStack Query:** resuelve carga, error e invalidación del árbol tras crear o eliminar,
  sin `useEffect` manuales.
- **Opcionales elegidos:** nivel y naturaleza (casi gratis y aclara la jerarquía) y crear
  hija con código prellenado (reutiliza el formulario y reduce errores de tipeo).

## Qué dejé afuera

- Tests automatizados.
- Búsqueda y renombrar.
- Validación de DTO con `class-validator` en el controller (la validación vive en el dominio).
- Persistencia real.

## Qué haría con más tiempo

- Tests unitarios del dominio y de los casos de uso (con el repositorio en memoria).
- Repositorio con base de datos real implementando la misma interfaz.
- Búsqueda abriendo las ramas con coincidencia.
- Abrir automáticamente el nodo padre al crear una hija.
- Impedir cambios concurrentes inconsistentes (por ejemplo, borrar un padre mientras se crea una hija).