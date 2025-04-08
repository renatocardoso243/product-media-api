# API de Produtos com Upload de Imagens

API completa para gerenciamento de produtos com upload de imagens, construída com Node.js, Express, Sequelize e PostgreSQL.

## Recursos

- CRUD completo de produtos
- Upload de imagens (JPEG, PNG, WebP)
- Geração automática de thumbnails (Em desenvolvimento)
- Documentação Swagger integrada
- Validação de dados
- Tratamento de erros robusto
- Autenticação JWT

## Tecnologias

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL, Sequelize (ORM)
- **Upload de Arquivos**: Multer, Sharp (processamento de imagens)
- **Documentação**: Swagger UI
- **Autenticação**: JWT (JSON Web Token)
- **Outras**: CORS, Body-parser, UUID

## Pré-requisitos

- Node.js (v18+)
- PostgreSQL (v12+)
- NPM ou Yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/renatocardoso243/product-media-api.git
cd product-media-api
```

2. Instalação das Dependências

Execute o seguinte comando na raiz do projeto:

```bash
# Dependências de produção
npm install express sequelize pg pg-hstore multer sharp cors body-parser dotenv swagger-ui-express swagger-jsdoc uuid jsonwebtoken bcryptjs

# Dependências de desenvolvimento (opcional)
npm install nodemon sequelize-cli --save-dev
```

3. Configure o banco de dados:

- Crie um banco PostgreSQL
- Atualize as credenciais em `src/config/database.js`

4. Execute as migrações:

```bash
npx sequelize-cli db:migrate
```

5. Inicie o servidor:

```bash
npm run dev
```

## Endpoints

A API estará disponível em `http://localhost:3000/api`

### Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

## Rotas da API

### Produtos

| Método | Rota              | Descrição                        |
| ------ | ----------------- | -------------------------------- |
| POST   | /api/products     | Cria um novo produto com imagem  |
| GET    | /api/products     | Lista todos os produtos          |
| GET    | /api/products/:id | Obtém um produto específico      |
| PUT    | /api/products/:id | Atualiza um produto              |
| DELETE | /api/products/:id | Remove um produto e suas imagens |
-----------------------------------------------------------------
| POST   | /api/auth/register | Cria um novo usuário             |
| POST   | /api/auth/login    | Testa o login do usuário         |
| GET    | /api/auth/users    | Lista todos os usuários          |
| GET    | /api/auth/users/:id| Lista um usuário específico      |
| PUT    | /api/auth/users/:id| Atualiza um usuário              |
| DELETE | /api/auth/users/:id| Remove um usuário                |

## Estrutura do Projeto

```
node-crud-postgres/
├── src/
│   ├── config/       # Configurações
│   ├── controllers/  # Lógica dos endpoints
│   ├── migrations/   # Criação de tabelas
│   ├── models/       # Modelos do banco de dados
│   ├── routes/       # Definição de rotas
│   ├── seeders/      # Inserção de dados nas tabelas
│   ├── uploads/      # Imagens enviadas (gerado automaticamente)
│   └── server.js     # Ponto de entrada
├── .sequelizerc      # Configuração do Sequelize CLI
├── .gitignore
└── package.json
```

## Upload de Imagens

Para enviar imagens, use `multipart/form-data` com o campo `image`.

**Exemplo no Postman:**

- Método: POST ou PUT
- Body → form-data
- Adicione campo `image` (tipo File)
- Adicione outros campos como texto

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com:

```ini
DB_HOST=localhost
DB_NAME=products
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_PORT=5432
PORT=3000
```

## Testando

1. **Criar produto**:

```bash
curl -X POST -F "name=Notebook" -F "price=1999.99" -F "image=@/caminho/da/imagem.jpg" http://localhost:3000/api/products
```

2. **Listar produtos**:

```bash
curl http://localhost:3000/api/products
```

## Roadmap

### Prioridade Alta

- [x] Autenticação JWT
- [ ] Testes automatizados
- [ ] Configuração de deploy

### Prioridade Média

- [ ] Documentação Swagger avançada
- [ ] Health check endpoint

### Prioridade Baixa

- [ ] Frontend básico
- [ ] CI/CD pipeline

## Licença

MIT

Copyright (c) 2025 RENATO DOS SANTOS CARDOSO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Autor

Renato dos Santos Cardoso - renatocardoso77@hotmail.com

---

