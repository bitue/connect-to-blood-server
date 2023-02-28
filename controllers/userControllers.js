const bcrypt = require('bcrypt');
const { User } = require('../model/userModel');

const JWT = require('jsonwebtoken');
const { Blog } = require('../model/blogModel');
const { Comment } = require('../model/comentModel');
const { DonorHealth } = require('../model/donorHealthModel');

require('dotenv').config();

const signUp = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        console.log(role);
        console.log(req.body, '---------------');

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
        res.set('Access-Control-Expose-Headers', 'Authorization');
        // authorization  headers  client response  has token
        res.set('Authorization', token);

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
                res.set('Access-Control-Expose-Headers', 'Authorization');

                // token add to res header
                res.set('Authorization', token);
                //res.set('authToken', token);
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
            res.sendStatus(403);
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

// const getBlogByBlogId = async (req, res, next) => {
//     try {
//         const id = req.query.id;
//         console.log(id);
//         const blogDB = await Blog.findById(id).populate(['user', 'comments']);

//         // if(!blogDB){
//         //     res.send({
//         //         message : "No blog found"
//         //     }).status(200)

//         // }
//         // console.log(blogDB);
//         res.json({
//             data: blogDB
//         });
//     } catch (err) {
//         next(err);
//     }
// };

const getBlogsByUserId = async (req, res, next) => {
    try {
        let blogDB;
        const id = req.query.id;
        console.log(id);

        if (id === req.tokenPayload._id.toString()) {
            blogDB = await Blog.find({ user: id }).populate(['user', 'comments']);
            console.log('===');
            res.json(blogDB);
        } else {
            if (req.tokenPayload.role === 'admin') {
                blogDB = await Blog.find({ user: id }).populate(['user', 'comments']);
                console.log('admin');
                res.json(blogDB);
            } else {
                res.sendStatus(403);
            }
        }

        // if (id !== req.tokenPayload._id.toString()) {
        //     // user != admin user == user admin ==admin user user
        //     if (req.tokenPayload.role == 'admin') {
        //         // get the blogs by admin power
        //         blogDB = await Blog.find({ user: id }).populate(['user', 'comments']);
        //         console.log(blogDB);
        //         res.json(blogDB);
        //     } else {
        //         res.sendStatus(403);
        //     }
        // } else {
        //     // user == user  admin == admin
        //     blogDB = await Blog.find({ user: id }).populate(['user', 'comments']);
        //     console.log(blogDB);
        //     res.json(blogDB);
        // }
    } catch (err) {
        next(err);
    }
};

// user can req for being donor
const DonorHealthStatus = async (req, res, next) => {
    // get the status from req.body ;
    try {
        const donorStatus = req.body;
        console.log(donorStatus);
        const { password, ...rest } = donorStatus;
        console.log(password, 'get from user', req.tokenPayload.password);
        // check the password ;
        const isValidPassword = await bcrypt.compare(password, req.tokenPayload.password);
        if (!isValidPassword) {
            res.sendStatus(403);
            return;
        }
        // if (true) {
        //     res.sendStatus(403);
        // }
        console.log(1);
        const donorHealth = new DonorHealth({ ...rest });
        console.log(2);
        const saveDonorHealth = await donorHealth.save();
        res.send(saveDonorHealth).status(200);
    } catch (err) {
        next(err);
    }
};

// user can search for blood by geolocation api
const getDonorByMap = async (req, res, next) => {
    console.log(req.body);
    const { userLocation, maxDistance, bloodType } = req.body;
    try {
        // Parse the latitude and longitude from the 'near' parameter
        const { lat, lng } = userLocation;

        // Find donors within the specified distance from the user's location
        // const donors = await User.find({
        //     location: {
        //         $nearSphere: {
        //             $geometry: {
        //                 type: 'Point',
        //                 coordinates: [lng, lat],
        //                 $minDistance: 0,
        //                 $maxDistance: maxDistance * 1000
        //             }
        //             // Convert from km to meters
        //         }
        //     }
        // });

        const users = await User.find({
            location: {
                $near: {
                    $maxDistance: maxDistance * 1000, // distance in meters
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    }
                }
            },
            role: 'donor',
            bloodType: bloodType
        });

        console.log(users);
        // console.log(donors);
        res.json(users);
    } catch (err) {
        console.log(err.message);
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
    deleteBlog,
    getBlogsByUserId,
    DonorHealthStatus,
    getDonorByMap
};
// $2b$10$2hdI8KXmo670S3oHlspQOetzshfHnX7n.vjcxhxL6LWk42T2MzQUq
