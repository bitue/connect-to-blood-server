const { Blog } = require('../model/blogModel');

// get top 10 latest blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}, {}, { sort: { createdAt: -1 } })
            .populate(['user', 'comments'])
            .limit(10);
        // console.log(blogs);
        res.json({
            data: blogs,
            status: 'ok'
        });
    } catch (err) {
        res.status(403).send(err.message);
    }
};

// get blogs by id :

const getBlogById = async (req, res, next) => {
    try {
        const id = req.query.id;
        const blogDB = await Blog.findById(id).populate(['user', 'comments']);

        // if(!blogDB){
        //     res.send({
        //         message : "No blog found"
        //     }).status(200)

        // }
        // console.log(blogDB);
        res.json({
            data: blogDB
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBlogs,
    getBlogById
};
