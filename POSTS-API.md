# API de Posts - Documentação de Rotas

Esta documentação descreve as rotas disponíveis para gerenciamento de posts na API.

## Base URL

```
http://localhost:3000/api
```

---

## Rotas Disponíveis

### 1. Criar Post

**POST** `/api/posts`

Cria um novo post com upload de imagem para AWS S3.

#### Autenticação

✅ **Obrigatória** - Token JWT no header `Authorization`

#### Headers

```
Authorization: Bearer <token-jwt-obtido-no-signin>
Content-Type: multipart/form-data
```

#### Body (Form Data)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | Sim | Título do post (mínimo 1 caractere) |
| `subtitle` | string | Sim | Subtítulo do post (mínimo 1 caractere) |
| `body` | string | Sim | Corpo completo do post (mínimo 1 caractere) |
| `tag` | string | Sim | Tag do post (mínimo 1 caractere) |
| `category` | enum | Sim | Categoria do post. Valores permitidos: `graduação`, `extensão`, `pesquisa`, `eventos` |
| `media` | file | Sim | Arquivo de imagem (máximo 10MB) |

#### Validações

- Todos os campos de texto devem ter pelo menos 1 caractere
- O campo `category` deve ser um dos valores do enum: `graduação`, `extensão`, `pesquisa`, `eventos`
- O arquivo `media` é obrigatório e não pode exceder 10MB
- O arquivo será enviado para AWS S3 e a URL retornada será salva no campo `media` do post

#### Resposta de Sucesso (201 Created)

```json
{
  "post": {
    "id": "uuid-gerado",
    "title": "Título do Post",
    "subtitle": "Subtítulo do Post",
    "body": "Corpo completo do post aqui...",
    "tag": "tecnologia",
    "media": "https://bucket-s3.amazonaws.com/userid1234567890.jpg",
    "category": "graduação",
    "user": {
      "id": "uuid-do-usuario",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "student",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Respostas de Erro

**401 Unauthorized** - Token ausente ou inválido:
```json
{
  "error": "Authorization header is required"
}
```
ou
```json
{
  "error": "Invalid or expired token"
}
```

**400 Bad Request** - Arquivo não enviado:
```json
{
  "error": "Media file is required"
}
```

**400 Bad Request** - Erro de validação:
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Title is required",
      "path": ["title"]
    },
    {
      "code": "invalid_enum_value",
      "options": ["graduação", "extensão", "pesquisa", "eventos"],
      "path": ["category"],
      "message": "Category must be graduação, extensão, pesquisa, or eventos"
    }
  ]
}
```

**400 Bad Request** - Usuário não encontrado:
```json
{
  "error": "User not found"
}
```

**413 Payload Too Large** - Arquivo maior que 10MB:
```
File too large
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

#### Exemplo de Requisição (cURL)

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer seu-token-jwt-aqui" \
  -F "title=Título do Post" \
  -F "subtitle=Subtítulo" \
  -F "body=Corpo completo do post aqui" \
  -F "tag=tecnologia" \
  -F "category=graduação" \
  -F "media=@/caminho/para/imagem.jpg"
```

#### Exemplo de Requisição (JavaScript/Fetch)

```javascript
const formData = new FormData();
formData.append('title', 'Título do Post');
formData.append('subtitle', 'Subtítulo');
formData.append('body', 'Corpo completo do post aqui');
formData.append('tag', 'tecnologia');
formData.append('category', 'graduação');
formData.append('media', fileInput.files[0]);

fetch('http://localhost:3000/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token-jwt-aqui'
  },
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

### 2. Listar Posts

**GET** `/api/posts`

Lista todos os posts cadastrados.

#### Autenticação

❌ **Não obrigatória** - Rota pública

#### Headers

Nenhum header obrigatório

#### Query Parameters

Nenhum parâmetro de query disponível

#### Resposta de Sucesso (200 OK)

```json
{
  "posts": [
    {
      "id": "uuid-do-post",
      "title": "Título do Post",
      "subtitle": "Subtítulo do Post",
      "body": "Corpo completo do post aqui...",
      "tag": "tecnologia",
      "media": "https://bucket-s3.amazonaws.com/userid1234567890.jpg",
      "category": "graduação",
      "user": {
        "id": "uuid-do-usuario",
        "name": "João Silva",
        "email": "joao@example.com",
        "role": "student",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-do-post-2",
      "title": "Outro Post",
      "subtitle": "Outro Subtítulo",
      "body": "Corpo de outro post...",
      "tag": "pesquisa",
      "media": "https://bucket-s3.amazonaws.com/userid0987654321.jpg",
      "category": "pesquisa",
      "user": {
        "id": "uuid-do-usuario-2",
        "name": "Maria Santos",
        "email": "maria@example.com",
        "role": "teacher",
        "createdAt": "2024-01-02T00:00:00.000Z"
      },
      "createdAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

Se não houver posts:
```json
{
  "posts": []
}
```

#### Respostas de Erro

**500 Internal Server Error**:
```json
{
  "error": "Failed to list posts"
}
```

#### Exemplo de Requisição (cURL)

```bash
curl -X GET http://localhost:3000/api/posts
```

#### Exemplo de Requisição (JavaScript/Fetch)

```javascript
fetch('http://localhost:3000/api/posts')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## Modelo de Dados

### Post

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador único do post |
| `title` | string | Título do post |
| `subtitle` | string | Subtítulo do post |
| `body` | string | Corpo completo do post |
| `tag` | string | Tag do post |
| `media` | string (URL) | URL da imagem no AWS S3 |
| `category` | enum | Categoria do post: `graduação`, `extensão`, `pesquisa`, `eventos` |
| `user` | User | Objeto com informações do usuário criador |
| `createdAt` | Date (ISO 8601) | Data de criação do post |

### User (dentro do Post)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador único do usuário |
| `name` | string | Nome do usuário |
| `email` | string | Email do usuário |
| `role` | enum | Role do usuário: `student`, `admin`, `teacher` |
| `createdAt` | Date (ISO 8601) | Data de criação do usuário |

---

## Categorias Disponíveis

O campo `category` aceita os seguintes valores:

- `graduação`
- `extensão`
- `pesquisa`
- `eventos`

---

## Observações Importantes

1. **Upload de Arquivos**: O arquivo é armazenado temporariamente na memória durante o processamento (multer memoryStorage) antes de ser enviado para AWS S3.

2. **Autenticação**: Para criar posts, é necessário obter um token JWT através do endpoint `/api/auth/signin`.

3. **Limite de Arquivo**: O tamanho máximo do arquivo é de 10MB.

4. **URL da Mídia**: A URL retornada no campo `media` é a URL pública do arquivo no AWS S3 após o upload.

5. **UserId**: O `userId` é extraído automaticamente do token JWT no header `Authorization`, não é necessário enviá-lo no body da requisição.

6. **Formato de Data**: Todas as datas são retornadas no formato ISO 8601 (ex: `2024-01-01T00:00:00.000Z`).

---

## Exemplo de Fluxo Completo

1. **Criar usuário** (se necessário):
   ```
   POST /api/auth/signup
   ```

2. **Fazer login para obter token**:
   ```
   POST /api/auth/signin
   ```
   Retorna: `{ "token": "...", "user": {...} }`

3. **Criar post com imagem**:
   ```
   POST /api/posts
   Header: Authorization: Bearer <token>
   Body: multipart/form-data
   ```

4. **Listar todos os posts**:
   ```
   GET /api/posts
   ```
