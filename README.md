# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

# API Usage with Thunder Client

If you are using VS Code:

1. Open the **Extensions** tab  
2. Search for **Thunder Client**  
3. Install the extension  
4. Go to **Thunder Client** in the sidebar  
5. Click **"New Request"**  
6. Enter the request URL (e.g., `http://localhost:4000/user`)  
7. Select the HTTP method (GET, POST, PUT, DELETE)  
8. For **POST** and **PUT** methods, go to the **Body** tab, choose `JSON`, and provide the required payload  

---

## Available Endpoints and Request Details

### Users (`/user`)

- `GET /user` — get all users  
- `GET /user/:id` — get a user by ID  
- `POST /user` — create a new user  
  **Body:**
  ```json
  {
    "login": "example",
    "password": "1234"
  }
  ```
- `PUT /user/:id` — update user password  
  **Body:**
  ```json
  {
    "oldPassword": "1234",
    "newPassword": "5678"
  }
  ```
- `DELETE /user/:id` — delete a user

---

### Artists (`/artist`)

- `GET /artist` — get all artists  
- `GET /artist/:id` — get an artist by ID  
- `POST /artist` — create a new artist  
  **Body:**
  ```json
  {
    "name": "Artist Name",
    "grammy": true
  }
  ```
- `PUT /artist/:id` — update an artist  
  **Body:**
  ```json
  {
    "name": "Updated Name",
    "grammy": false
  }
  ```
- `DELETE /artist/:id` — delete an artist

---

### Albums (`/album`)

- `GET /album` — get all albums  
- `GET /album/:id` — get an album by ID  
- `POST /album` — create a new album  
  **Body:**
  ```json
  {
    "name": "Album Name",
    "year": 2020,
    "artistId": "uuid or null"
  }
  ```
- `PUT /album/:id` — update an album  
  **Body:**
  ```json
  {
    "name": "Updated Name",
    "year": 2021,
    "artistId": "uuid or null"
  }
  ```
- `DELETE /album/:id` — delete an album

---

### Tracks (`/track`)

- `GET /track` — get all tracks  
- `GET /track/:id` — get a track by ID  
- `POST /track` — create a new track  
  **Body:**
  ```json
  {
    "name": "Track Name",
    "artistId": "uuid or null",
    "albumId": "uuid or null",
    "duration": 180
  }
  ```
- `PUT /track/:id` — update a track  
  **Body:**
  ```json
  {
    "name": "Updated Track",
    "artistId": "uuid or null",
    "albumId": "uuid or null",
    "duration": 200
  }
  ```
- `DELETE /track/:id` — delete a track

---

### Favorites (`/favs`)

- `GET /favs` — get all favorites, grouped by entity type  
  **Response format:**
  ```ts
  interface FavoritesResponse {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }
  ```

#### Add to favorites

- `POST /favs/track/:id` — add a track to favorites  
- `POST /favs/album/:id` — add an album to favorites  
- `POST /favs/artist/:id` — add an artist to favorites  

#### Remove from favorites

- `DELETE /favs/track/:id` — remove a track from favorites  
- `DELETE /favs/album/:id` — remove an album from favorites  
- `DELETE /favs/artist/:id` — remove an artist from favorites  


### Docker setup

To start the app in docker, you need to install **docker** and **docker compose** on your pc.

To start the application and PostgreSQL database using Docker:

```bash
docker-compose up --build
```
from the root directory of the app.

If you want to reset the database:
```bash
docker-compose down -v
docker-compose up --build
```