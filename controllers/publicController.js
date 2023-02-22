const { Blog } = require('../model/blogModel');

// get top 10 latest blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}, {}, { sort: { createdAt: -1 } }).populate([
            'user',
            'comments'
        ]);

        // console.log(blogs);
        res.json({
            data: blogs,
            status: 'ok'
        });
    } catch (err) {
        res.status(403).send(err.message);
    }
};

// get blog by id :

const getBlogByBlogId = async (req, res, next) => {
    try {
        const id = req.query.id;
        console.log(id);
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
    getBlogByBlogId
};
