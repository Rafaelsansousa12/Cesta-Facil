# 🛒 Cesta Fácil

Sistema web para venda e entrega de cestas básicas.  
**TCC – FATEC Praia Grande – Análise e Desenvolvimento de Sistemas**

---

## 🚀 Como Executar

### Opção 1 — Desenvolvimento local (recomendado para testar)

**Pré-requisitos:** Java 21, Maven, Node.js 18+, MySQL 8

```bash
# 1. Criar banco MySQL
mysql -u root -p
CREATE DATABASE cestafacil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 2. Backend (novo terminal)
cd backend
mvn spring-boot:run

# 3. Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173  
- Backend:  http://localhost:8080  
- Swagger:  http://localhost:8080/swagger-ui.html

---

### Opção 2 — Docker Compose (produção / deploy completo)

**Pré-requisito:** Docker + Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost  
- Backend:  http://localhost:8080  
- Swagger:  http://localhost:8080/swagger-ui.html

---

## 🔑 Credenciais Padrão

| Perfil | E-mail                      | Senha     |
|--------|-----------------------------|-----------|
| Admin  | admin@cestafacil.com.br     | Admin@123 |
| Cliente | (cadastre-se na plataforma) | —        |

---

## 🗂 Estrutura do Projeto

```
cestafacil/
├── backend/                        # Java 21 + Spring Boot 3
│   ├── src/main/java/br/com/cestafacil/
│   │   ├── controller/             # REST Controllers
│   │   ├── service/                # Lógica de negócio (@Transactional)
│   │   ├── repository/             # Spring Data JPA
│   │   ├── model/entity/           # Entidades JPA
│   │   ├── model/dto/              # Data Transfer Objects
│   │   ├── model/enums/            # Enumerações
│   │   ├── security/               # JWT + Spring Security
│   │   ├── config/                 # SecurityConfig, SwaggerConfig
│   │   └── exception/              # GlobalExceptionHandler
│   ├── src/main/resources/
│   │   ├── application.yml         # Configurações
│   │   └── db/migration/           # Flyway (V1, V2)
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                       # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/                  # Telas da aplicação
│   │   │   ├── Home.jsx
│   │   │   ├── Catalogo.jsx
│   │   │   ├── Produto.jsx
│   │   │   ├── Carrinho.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Cadastro.jsx
│   │   │   ├── Pedidos.jsx
│   │   │   ├── PedidoDetalhe.jsx
│   │   │   ├── Perfil.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProdutos.jsx
│   │   │       └── AdminPedidos.jsx
│   │   ├── components/
│   │   │   └── common/             # Header, Footer, ProductCard, UI
│   │   ├── context/                # AuthContext, CartContext
│   │   ├── services/api.js         # Axios + interceptores JWT
│   │   └── App.jsx                 # Rotas React Router
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 📡 Endpoints Principais da API

| Método | Rota                          | Descrição                    | Auth    |
|--------|-------------------------------|------------------------------|---------|
| POST   | /api/v1/auth/login            | Login (retorna JWT)          | Pública |
| POST   | /api/v1/auth/register         | Cadastro de usuário          | Pública |
| GET    | /api/v1/auth/me               | Dados do usuário logado      | JWT     |
| GET    | /api/v1/produtos              | Catálogo paginado + filtros  | Pública |
| GET    | /api/v1/produtos/:id          | Detalhes do produto          | Pública |
| GET    | /api/v1/categorias            | Lista categorias             | Pública |
| POST   | /api/v1/pedidos               | Criar pedido (@Transactional)| JWT     |
| GET    | /api/v1/pedidos               | Meus pedidos                 | JWT     |
| GET    | /api/v1/pedidos/:id           | Detalhe do pedido            | JWT     |
| GET    | /api/v1/admin/dashboard       | Métricas do dashboard        | ADMIN   |
| POST   | /api/v1/admin/produtos        | Criar produto                | ADMIN   |
| PUT    | /api/v1/admin/produtos/:id    | Editar produto               | ADMIN   |
| DELETE | /api/v1/admin/produtos/:id    | Desativar produto            | ADMIN   |
| GET    | /api/v1/admin/pedidos         | Todos os pedidos             | ADMIN   |
| PATCH  | /api/v1/admin/pedidos/:id/status | Atualizar status          | ADMIN   |

---

## 🛠 Tecnologias

**Backend:** Java 21 · Spring Boot 3 · Spring Security · Spring Data JPA · Hibernate · Flyway · MySQL 8 · JJWT · Lombok · SpringDoc OpenAPI

**Frontend:** React 18 · Vite · React Router DOM · Tailwind CSS · Axios · React Hot Toast · Lucide React

**Infra:** Docker · Docker Compose · Nginx
