const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const request = require("supertest")

const app = require('../api/app')
const sorted = require('jest-sorted');


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

                expect(body.articles).toHaveLength(12)
                body.articles.forEach((article) => {
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(Number))
                })
            })
    });
    it('should check to make sure the articles are in descending order', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles
                expect(articles).toBeSortedBy('created_at', {
                    descending: true,
                });
            }
            )
    })
});

describe('GET /api/articles/:article_id/comments', () => {
    it('should return an array with 6 properties, containing the correct comments for the requested article', () => {
        return request(app)
            .get('/api/articles/5/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments[0].body).toBe("I am 100% sure that we're not completely sure.")
                expect(body.comments[1].body).toBe("What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.")
            })
    });
    it('404 - GET invalid ID', () => {
        return request(app)
            .get('/api/articles/1234567/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("No article found for article 1234567")
            })
    })
    it('400 - GET invalid format for get request', () => {
        return request(app)
            .get('/api/articles/notAnArticle/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Wrong data type, please use number")
            })
    })
    it('200 - GET article ID for an article that exists and has comments', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments[0]).toHaveProperty("author", expect.any(String));
                expect(body.comments[0]).toHaveProperty("body", expect.any(String));
                expect(body.comments[0]).toHaveProperty("created_at", expect.any(String));
                expect(body.comments[0]).toHaveProperty("votes", expect.any(Number));
                expect(body.comments[0]).toHaveProperty("article_id", expect.any(Number));
                expect(body.comments[0]).toHaveProperty("comment_id", expect.any(Number))
            })
    })
    it('200 - GET article ID for an article that exists but doesnt have any comments ', () => {
        return request(app)
            .get('/api/articles/7/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.msg).toEqual([])
            })
    })
    it('should check to make sure the comments are in descending order', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                const comments = body.comments
                expect(comments).toBeSortedBy('created_at', {
                    descending: true,
                });
            }
            )
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    it('201 - should add a comment to requested article', () => {
        const inputComment = {
            body: "Hey geezer",
            username: "rogersop",
        }
        return request(app)
            .post("/api/articles/7/comments")
            .send(inputComment)
            .expect(201)
            .then(({ body }) => {

                expect(body.comment.body).toBe("Hey geezer");
                expect(body.comment.votes).toBe(0);
                expect(body.comment.author).toBe("rogersop");
                expect(body.comment.article_id).toBe(7);
                expect(body.comment).toHaveProperty("created_at", expect.any(String));
                expect(body.comment.comment_id).toBe(19)
            }
            )
    })
    it('201 - POST should add a comment to requested article which also ignores any extra inputted, unnecessary properties', () => {
        const inputComment = {
            body: "Hey geezer",
            username: "rogersop",
            test: 'test'
        }
        return request(app)
            .post("/api/articles/7/comments")
            .send(inputComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment.body).toBe("Hey geezer");
                expect(body.comment.votes).toBe(0);
                expect(body.comment.author).toBe("rogersop");
                expect(body.comment.article_id).toBe(7);
                expect(body.comment).toHaveProperty("created_at", expect.any(String));
                expect(body.comment.comment_id).toBe(19)
            }
            )
    })
    it('404 - POST request for an article that doesnt exist', () => {
        const inputComment = {
            body: "Hey geezer",
            username: "rogersop",
        }
        return request(app)
            .post("/api/articles/100000/comments")
            .send(inputComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No article found for article 100000')
            })
    })
    it('404 - POST request for an article for a username that doesnt exist', () => {
        const inputComment = {
            body: "Hey geezer",
            username: "tom",
        }
        return request(app)
            .post("/api/articles/7/comments")
            .send(inputComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Username not found')
            })
    })
    it('400 - POST invalid format for get request', () => {
        const inputComment = {
            body: "Hey geezer",
            username: "rogersop",
        }
        return request(app)
            .post("/api/articles/NotAnArticle/comments")
            .send(inputComment)
            .expect(400)
            .then(({ body }) => {

                expect(body.msg).toBe('Wrong data type, please use number')
            })
    })
    it('400 - POST missing required fields of username or body', () => {
        const inputComment = {
            username: "rogersop",
        }
        return request(app)
            .post("/api/articles/7/comments")
            .send(inputComment)
            .expect(400)
            .then(({ body }) => {

                expect(body.msg).toBe('Please make sure you include a comment and a username')
            })
    })

})

describe('PATCH - /api/articles/:article_id', () => {
    it('200 - Should add an extra vote when passed 1 or multiple votes', () => {
        const input = {
            inc_votes: 1
        }
        return request(app)
            .patch("/api/articles/1")
            .send(input)
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 101,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
    });
    it('200 - Should remove votes when passed a negative vote', () => {
        const input = {
            inc_votes: -5
        }
        return request(app)
            .patch("/api/articles/1")
            .send(input)
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 95,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
    });
    it('404 - Returns error when trying to vote on an article that doesnt exist', () => {
        const input = {
            inc_votes: 1
        }
        return request(app)
            .patch("/api/articles/100000")
            .send(input)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("No article found for article 100000")
            })
    })
    it('400 - Returns error when trying to vote on an article that doesnt exist', () => {
        const input = {
            inc_votes: 1
        }
        return request(app)
            .patch("/api/articles/NotAnId")
            .send(input)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Wrong data type, please use number")
            })
    })
    it('404 - Returns error when trying to vote on an article that doesnt exist', () => {
        const input = {
            inc_votes: 'five'
        }
        return request(app)
            .patch("/api/articles/1")
            .send(input)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Wrong data type, please use number")
            })
    })
})

describe('DELETE - /api/comments/:comment_id', () => {
    it('204 - Receive status code 204 and an empty body', () => {
        return request(app)
            .delete("/api/comments/10")
            .expect(204)
    });
    it('400 - Returns error when trying delete a comment that doesnt exist', () => {
        return request(app)
            .delete("/api/comments/500000")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("This comment does not exist")
            })
    })
    it('400 - Returns error when trying delete a comment that doesnt exist', () => {
        return request(app)
            .delete("/api/comments/NotANumber")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Wrong data type, please use number")
            })
    })
});

describe('GET - /api/users', () => {

    it('200 - Return the information for the requested user', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(body.users).toHaveLength(4)
                body.users.forEach((user) => {
                    expect(user).toHaveProperty("username", expect.any(String));
                    expect(user).toHaveProperty("name", expect.any(String));
                    expect(user).toHaveProperty("avatar_url", expect.any(String));
                })
            })
    });
});

describe('GET - /api/articles queries', () => {
    it('200 - Returns all articles by mitch, sorted by article_id in ascending order', () => {
        return request(app)
            .get('/api/articles?topic=mitch&sort_by=article_id&order=ASC')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(11)
                expect(body.articles).toBeSortedBy('article_id', {
                    descending: false,
                });
                body.articles.forEach((article) => {
                    expect(article.topic).toBe('mitch')
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(Number))
                })
            })
    })
    it('200 - Returns all articles by mitch, sorted by article_id and defaults to descending order', () => {
        return request(app)
            .get('/api/articles?topic=mitch&sort_by=article_id')
            .expect(200)
            .then(({ body }) => {

                expect(body.articles).toHaveLength(11)
                expect(body.articles).toBeSortedBy('article_id', {
                    descending: true,
                });
                body.articles.forEach((article) => {
                    expect(article.topic).toBe('mitch')
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(Number))
                })
            })
    })
    it('200 - Returns all articles by mitch defaults sorted_by to created_at and the order to descending order', () => {
        return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(11)
                expect(body.articles).toBeSortedBy('created_at', {
                    descending: true,
                });
                body.articles.forEach((article) => {
                    expect(article.topic).toBe('mitch')
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(Number))
                })
            })
    })
    it('200 - Topic exists but has no articles', () => {
        return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBe('No articles for requested topic')
            })
    });
    it('404 - Topic doesnt exist', () => {
        return request(app)
            .get('/api/articles?topic=paperr')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No such topic exists')
            })
    });
    it('400 - returns invalid sort query when given invalid sort query', () => {
        return request(app)
            .get('/api/articles?topic=mitch&sort_by=test')
            .expect(400)
            .then(({ body }) => {

                expect(body.msg).toBe("Invalid sort query")
            }
            )
    })
    it('should return invalid order query when passed an invalid order query', () => {
        return request(app)
            .get('/api/articles?topic=mitch&order=ascending')
            .expect(400)
            .then(({ body }) => {

                expect(body.msg).toBe("Invalid order query")
            }
            )
    })
    it('should return no such topic exists when passed a topic that doesnt exist', () => {
        return request(app)
            .get('/api/articles?topic=yo')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("No such topic exists")
            }
            )
    })
});