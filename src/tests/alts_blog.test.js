const supertest = require("supertest");
const app = require("./index");

describe("auth", () => {
    // signup
    it("POST /signup", async() => {
        const response = await supertest(app).post('/signup').send({
            "email":"johndoe@example.com",
            "password": "john_pswd_doe",
            "first_name": "John",
            "last_name": "Doe"
        });
        expect(response.statusCode).toBe(201);
    });

    // signin
    it("POST /signin", async() => {
        const response = await supertest(app).post('/signin').send({
            "email":"johndoe@example.com",
            "password": "john_pswd_doe"
        });
        expect(response.statusCode).toBe(200);
    });

})

describe('users', () => {
    // Update user's details
    it("PATCH /users", async() => {
        const response = await supertest(app).patch('/users').send({
            "last_name":"Doeling"
        });
        expect(response.statusCode).toBe(401);
    });

    // Delete user
    it("DELETE /users", async() => {
        const response = await supertest(app).delete('/users').send({});
        expect(response.statusCode).toBe(401);
    });

    
})

describe('blogs', () => {
    // Create a blog post
    it("POST /blogs",async() => {
        const response = await supertest(app).post('/blogs').send({
            "title": "Test Blog",
            "description": "This is a test blog post",
            "tags": ["test", "example", "blog"],
            "body": "This is a demo blog post, nothing serious."
        });
        expect(response.statusCode).toBe(401);
    });

    // Get all blog posts
    it("GET /blogs", async() => {
        const response = await supertest(app).get('/blogs').send({});
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    // Get all blog posts for a particular user
    it("GET /blogs/me", async() => {
        const response = await supertest(app).get('/blogs/me').send({});
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthenticated");
    });

    // Get all blog posts by id
    it("GET /blogs/:id", async() => {
        const response = await supertest(app).get('/blogs/636709b8cdb2b559b6597408').send({});
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Not Found");
    });

    // Update blog post details
    it("PATCH /blogs/:id", async() => {
        const response = await supertest(app).patch('/blogs/6330c6dc3097356392465aca').send({
            "description":"..."
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthenticated");
    });

    // Delete blog post
    it("DELETE /blogs/:id", async() => {
        const response = await supertest(app).delete('/blogs/6330c6dc3097356392465aca').send({});
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthenticated");
    });
    
})