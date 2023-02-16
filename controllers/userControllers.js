const bcrypt = require('bcrypt');
const { User } = require('../model/userModel');
const JWT = require('jsonwebtoken');
const { Blog } = require('../model/blogModel');
const { Comment } = require('../model/comentModel');
require('dotenv').config();

const signUp = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        console.log(role);

        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);

        const user = new User({ ...req.body, email, password: hashPassword, role });
        console.log(user);
        await user.save();
        // token make start by email and mongo table id
        const tokenPayload = { email, role: user.role, id: user._id };
        const token = JWT.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '10d'
        });
        // authorization  headers  client response  has token
        res.set('authorization-token', token);

        res.json({
            message: 'user created success',
            user
        }).status(200);
    } catch (err) {
        res.status(401).send(err.message);
    }
};

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const dbUser = await User.findOne({ email });
        console.log(dbUser);

        if (dbUser) {
            const isValidPassword = await bcrypt.compare(password, dbUser.password);
            if (isValidPassword) {
                // all is ok
                // token generation
                const token = JWT.sign(
                    { email, role: dbUser.role, id: dbUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '10d' }
                );

                //console.log(token);

                // token add to res header
                res.set('authorization-token', token);
                res.json({
                    user: dbUser,
                    status: 'ok'
                });
            } else {
                res.send('Auth error1').status(401);
            }
        } else {
            res.send('Auth error2').status(401);
        }
    } catch (err) {
        console.log(err.message);
        res.send('Auth error3').status(401);
    }
};

const userProtected = (req, res, next) => {
    if (req.tokenPayload) {
        res.json({
            email: req.tokenPayload,
            status: 'ok'
        });
    } else {
        res.json({
            message: 'Unprotected route for him !'
        });
    }
};

const createBlog = async (req, res, next) => {
    try {
        // check the token payload and req body userID
        if (req.body.user !== req.tokenPayload._id.toString()) {
            res.sendStatus(401);
        }
        console.log(req.body.user == req.tokenPayload._id.toString());
        const blog = new Blog({ ...req.body });

        const blogDB = await blog.save();
        console.log(blogDB);
        res.status(200).json({
            message: 'blog created success',
            blog: blogDB
        });
    } catch (err) {
        res.status(403).json(err.message);
    }
};

const createComment = async (req, res, next) => {
    try {
        const comment = new Comment({ ...req.body });
        const commentDB = await comment.save();
        // need to push it the blog
        const blog_id = commentDB.blog;
        console.log(req.tokenPayload);
        const addComment = await Blog.updateOne(
            { _id: blog_id },
            { $push: { comments: commentDB._id } }
        );

        res.json(addComment);
    } catch (err) {
        next(err);
    }
};

const giveVote = async (req, res, next) => {
    try {
        // get id by params
        const { blog_id, like } = req.body;
        console.log(blog_id);

        // search the blog then update it
        const blogDB = await Blog.findOne({ _id: blog_id });
        // wrong id
        console.log(blogDB, 'blog connection');
        if (!blogDB) {
            res.sendStatus(403);
        }
        console.log(blogDB);

        const addLikes = await Blog.updateOne(
            { _id: blog_id },
            { $set: { likes: blogDB.likes + Number(like) } }
        );

        res.json(addLikes);
    } catch (err) {
        next(err);
    }
};

const deleteBlog = async (req, res, next) => {
    try {
        // get the blog id from req body
        const { blog_id } = req.body;
        console.log(blog_id);
        const blog = await Blog.findById(blog_id);

        // blog->role
        // blog is null
        let blogDB;
        if (!blog) {
            res.sendStatus(404);
        }
        console.log(blog.user, req.tokenPayload._id);

        if (blog.user.toString() === req.tokenPayload._id.toString()) {
            blogDB = await Blog.deleteOne({ _id: blog_id });
        } else if (req.tokenPayload.role === 'admin') {
            blogDB = await Blog.deleteOne({ _id: blog_id });
        } else {
            // blogDB = await Blog.deleteOne({ _id: blog_id });
            // res.json(blogDB);
            res.sendStatus(401);
        }
        res.json(blogDB);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signUp,
    signIn,
    userProtected,
    createBlog,
    createComment,
    giveVote,
    deleteBlog
};
