const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const request = require("supertest")
const app = require('../db/app')

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
                console.log(body.msg);
            })
    });
});

describe('GET: /api/topics', () => {
    it('should return the topics table with the correct length of items when ran a db query', () => {
        return db.query("SELECT * FROM topics").then((result) => {
            expect(result.rows).toHaveLength(3);
        })
    });
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


});