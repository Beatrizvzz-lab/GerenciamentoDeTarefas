# NestJS API - Auth, Users & Tasks

## 1. 🧰 Tecnologia Utilizada

**NestJS** foi escolhido por ser um framework robusto, escalável e com excelente suporte à arquitetura modular e princípios SOLID. Ele fornece suporte nativo a TypeScript, injeção de dependência, validação, testes e integrações com ferramentas modernas como Prisma, JWT e muito mais.

Além disso, a estrutura modular do NestJS favorece a manutenção e evolução da aplicação ao longo do tempo.

## 2. ⚙️ Setup do Projeto

Certifique-se de ter o **Node.js** (v18+) instalado.

Clone o repositório e instale as dependências:

```bash
git clone <repo-url>
cd <nome-do-projeto>
npm install
```

Crie o arquivo `.env` com base no `.env.example`.

## 3. 🚀 Como Executar Localmente

Para rodar o projeto em ambiente de desenvolvimento:

```bash
npm run start:dev
```

Isso iniciará o servidor na porta padrão (geralmente `http://localhost:3000`).

Antes disso, é necessário aplicar as migrations do Prisma:

```bash
npx prisma migrate dev
```

## 4. 🧪 Como Testar a API

Você pode testar os endpoints utilizando ferramentas como Postman ou Insomnia.

### Exemplos com `curl`

#### Criar usuário
```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"email": "john@example.com", "password": "123456", "name": John}'
```

#### Autenticar usuário
```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email": "john@example.com", "password": "123456"}'
```

#### Criar tarefa (com token JWT)
```bash
curl -X POST http://localhost:3000/tasks \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "title": "Finish the project in nestjs",
  "description": "create routes",
  "status": "pending",
  "dueDate": "2025-06-05T18:00:00Z"
}'
```

## 5. 🧠 Decisões Técnicas

- **NestJS**: escolhido por sua arquitetura baseada em módulos, escalabilidade e compatibilidade com boas práticas.
- **Prisma ORM**: facilita a comunicação com banco de dados, com migrações controladas e tipagem segura.
- **JWT com Passport**: mecanismo robusto e flexível de autenticação.
- **Estrutura modular**: pastas separadas por domínio (`auth`, `users`, `tasks`), seguindo boas práticas de DDD.
- **Pipes globais**: para validações automáticas e consistentes em toda a aplicação.

## 6. 🔮 Melhorias Futuras

- Cobertura de testes unitários e e2e com Jest.
- Implementação de roles e permissions mais robustas no JWT.
- Paginação e filtros avançados nos endpoints de usuários e tarefas.
- Versionamento da API (ex: `/v1/users`). 
- Integração CI/CD e deploy automatizado via Docker.