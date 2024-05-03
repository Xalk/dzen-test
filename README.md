# Comments App
- Express
- Sqlite
- Prisma
- REST
  - POST /comments - to create comment 
  - GET /comments?orderBy=desc&page=1 - to get all comments (with pagination)
- Socket.io (subscribe to newComment, allComments, commentError)
- Docker

### Run the project locally
1. git clone https://github.com/Xalk/dzen-test.git
2. docker-compose up --build

To see the uploaded file go here:
http://localhost:8000/uploads/{fileName}

#### Deploy: https://dzen-test-95fi.onrender.com
