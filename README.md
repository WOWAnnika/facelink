# Postman Routes

## Foreslået rækkefølge

### 1. Opret user

**POST** - `http://localhost:3000/api/users`

**Body:**
```json
{
  "name": "Mikkel",
  "email": "mikkelersej123@gmail.com",
  "password": "123456"
}
```

---

### 2. Login

**POST** - `http://localhost:3000/api/login`

**Body:**
```json
{
  "email": "mikkelersej123@gmail.com",
  "password": "123456"
}
```

**Husk at gemme token (bearer token)**

---

### 3. Opret en post

**POST** - `http://localhost:3000/api/users/posts`

**Authorization:** Auth type → Bearer Token → Insert token

**Body:**
```json
{
  "text": "Det her er en test post"
}
```

**Husk at gemme id på post**

---

### 4. Like et post

**POST** - `http://localhost:3000/api/posts/:id/like`

Gem ID fra post og sæt ind i stedet for `:id` (`_id`)

**Authorization:** Auth type → Bearer Token → Insert token

*(Hvis det ikke virker, er det 100% Postman problemet)*

---

### 5. Se alle posts

**GET** - `http://localhost:3000/api/posts`

---

### 6. Se posts fra specific user

**GET** - `http://localhost:3000/api/users/:id`

---

### 7. Slet posts

**DELETE** - `http://localhost:3000/api/posts/:id`

Kun hvis man ejer den post

**Authorization:** Auth type → Bearer Token → Insert token
