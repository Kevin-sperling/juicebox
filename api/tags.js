const express = require('express');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next();
});

const { getPostsByTagName } = require('../db');

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;

    try {
        const posts = await getPostsByTagName(tagName);
        res.send({ posts });
    } catch ({ name, message }) {
        next({ name, message });
    }
});

const { getAllTags } = require('../db');

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
})

module.exports = tagsRouter;