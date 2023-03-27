const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const request = require("supertest")
const app = require('../api/app')
const { commentCount } = require('../api/utility-functions/utilities')

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    if (db.end) db.end();
});

describe('Returns 404 if submitting an invalid URL', () => {
    it('should return a en error status code of 404 for an invalid endpoint', () => {
        return request(app)
            .get('/api/tpoics')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid URL')
            })
    });
});

describe('GET: /api/topics', () => {
    it('should return all the topics table information when using a get request', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(3)
                body.forEach((topic) => {
                    expect(topic).toHaveProperty("description", expect.any(String));
                    expect(topic).toHaveProperty("slug", expect.any(String));
                })
            })
    });

})

describe('GET: /api/articles/:article_id', () => {
    it('should return all the topics table information when using a get request', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(1)
                expect(body[0].title).toBe('Seven inspirational thought leaders from Manchester UK')
                expect(body[0].author).toBe('rogersop');
            })
    });
    it('404 - GET invalid ID', () => {
        return request(app)
            .get('/api/articles/1234567')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("No article found for article 1234567")
            })
    });
    it('400 - GET invalid format for get request', () => {
        return request(app)
            .get('/api/articles/notAnArticle')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Wrong data type, please use number")
            })
    });


    describe('GET /api/articles', () => {
        it.only('should return all the articles table information when using a get request', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body).toHaveLength(12)
                    body.forEach((article) => {
                        expect(article).toHaveProperty("title", expect.any(String));
                        expect(article).toHaveProperty("topic", expect.any(String));
                        expect(article).toHaveProperty("author", expect.any(String));
                        expect(article).toHaveProperty("body", expect.any(String));
                        expect(article).toHaveProperty("created_at", expect.any(String));
                        expect(article).toHaveProperty("votes", expect.any(Number));
                        expect(article).toHaveProperty("article_img_url", expect.any(String));
                    })
                })
        });
        it.only('should ', () => {
            return commentCount(1).then((data) => { console.log(data); })
        });
    });
})