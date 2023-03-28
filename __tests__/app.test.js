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






describe('GET: /api/articles/:article_id', () => {
    it("200 responds with correct article", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {

                expect(body[0]).toEqual({

                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'

                }
                )
                expect(body).toBeInstanceOf(Object)

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
})

describe('GET /api/articles', () => {
    it('should return all the articles table information including the new comment count property and value when using a get request', () => {
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
                    expect(article).toHaveProperty("comment_count", expect.any(String))
                })
            })
    });
    it('should check to make sure the articles are in descending order', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body[0].created_at > body[1].created_at).toBe(true);
                expect(body[9].created_at > body[10].created_at).toBe(true);
                expect(body[5].created_at > body[4].created_at).toBe(false);
                expect(body[10].created_at > body[11].created_at).toBe(true);
                expect(body[6].created_at > body[2].created_at).toBe(false);
            }
            )
    })
});
