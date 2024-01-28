const upload = require('../../config/multerPostConfig'); // Импортируем настройки multer
const Post = require('./models/Post');
const User = require('../auth/models/User');
const PostLike = require('./models/PostLike');
const PostSaved = require('./models/PostSaved');
const fs = require('fs-extra');

const createPost = async(req, res) => {
    if(req){
        try {
            const {caption, location} = req.body;
            const newPost = await Post.create({
            userId: req.user.id,
            photoURL: `posts/${req.file.filename}`,  
            caption: caption,
            location: location,
            });
        res.status(200).send({ message: 'Пост успешно добавлен' });
        } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Произошла ошибка при добавлении поста' });
        }
    } else{
        res.status(404).send({ error: 'Ошибка при создании поста'})
    }
}
const getAllPosts = async(req, res) => {
    const posts = await Post.findAll();
    res.status(200).send(posts)
}
const getMyPosts = async(req, res) => {
    const posts = await Post.findAll()
    res.status(200).send(posts)
}
const getPostById = async(req, res) => {
    const post = await Post.findByPk(req.params.id)
    if(post){
        res.status(200).send(post);
    } else{
        res.status(400).send({message: 'Такого поста не существует'})
    }
}
const getPostsByUser = async(req, res) => {
    const user = await User.findOne({ where: {login: req.params.username}});
    if(user){
        const posts = await Post.findAll()
        res.status(200).send(posts)
    } else{
        res.status(400).send({message: 'Пользователя с таким username не существует'})
    }
}
const editPost = async(req, res) => {
    if(req.body.id){
        await Post.update({
            caption: req.body.caption,
            location: req.body.location,
        },
        {
            where: {
                id: req.body.id
            }
        })
    }
    res.status(200).end()
}
const deletePost = async(req, res) => {
    const post = await Post.findOne({
        where: {
            id: req.params.id,
        }
    })
    if(post && post.userId === req.user.id) {
        fs.unlinkSync('media/' + post.photoURL);
        const data = await Post.destroy({
            where: {
                id: req.params.id,
            }
        })
        res.status(200).end()
    } else {
        res.status(400).send({message: "Access forbidden"})
    }

    res.status(200).end()
}

const likePost = async(req, res) => {
    if(req.body.postId){
        const post = await Post.findByPk(req.body.postId)
        if(post){
            const postLike = await PostLike.findOne({
                where: {
                    userId: req.user.id,
                    postId: req.body.postId,
                }
            })
            if(postLike){
                res.status(401).send({message: 'Пост уже был лайкнут'})
            } else {
                await PostLike.create({
                    userId: req.user.id,
                    postId: post.id,
                })
                res.status(200).send({message: 'Вы лайкнули пост'})
            }
        } else {
            res.status(402).send({message: 'Пост не найден'})
        }
    } else {
        res.status(403).send({message: 'Пост не найден'})
    }
}
const disLikePost = async(req, res) => {
    if(req.body.postId){
        const post = await Post.findByPk(req.body.postId)
        if(post){
            const postLike = await PostLike.findOne({
                where: {
                    userId: req.user.id,
                    postId: req.body.postId,
                }
            })
            if(postLike){
                await PostLike.destroy({
                    where: {
                        userId: req.user.id,
                        postId: post.id,
                    }
                })
                res.status(200).send({message: 'Вы убрали лайк'})
            } else {
                res.status(401).send({message: 'Пост и так не был лайкнут'})
            }
        } else {
            res.status(402).send({message: 'Пост не найден'})
        }
    } else {
        res.status(403).send({message: 'Пост не найден'})
    }
}
const savePost = async(req, res) => {
    if(req.body.postId){
        const post = await Post.findByPk(req.body.postId)
        if(post){
            const postSaved = await PostSaved.findOne({
                where: {
                    userId: req.user.id,
                    postId: req.body.postId,
                }
            })
            if(postSaved){
                res.status(401).send({message: 'Пост уже был сохранен в избранное'})
            } else {
                await PostSaved.create({
                    userId: req.user.id,
                    postId: post.id,
                })
                res.status(200).send({message: 'Вы сохранили пост в избранное'})
            }
        } else {
            res.status(402).send({message: 'Пост не найден'})
        }
    } else {
        res.status(403).send({message: 'Пост не найден'})
    }
}
const unSavePost = async(req, res) => {
    if(req.body.postId){
        const post = await Post.findByPk(req.body.postId)
        if(post){
            const postSaved = await PostSaved.findOne({
                where: {
                    userId: req.user.id,
                    postId: req.body.postId,
                }
            })
            if(postSaved){
                await PostSaved.destroy({
                    where: {
                        userId: req.user.id,
                        postId: post.id,
                    }
                })
                res.status(200).send({message: 'Вы отменили сохранение поста'})
            } else {
                res.status(401).send({message: 'Пост и так не был сохранен'})
            }
        } else {
            res.status(402).send({message: 'Пост не найден'})
        }
    } else {
        res.status(403).send({message: 'Пост не найден'})
    }
}
module.exports = {
    createPost,
    getAllPosts,
    getMyPosts,
    getPostById,
    getPostsByUser,
    editPost,
    deletePost,
    likePost,
    disLikePost,
    savePost,
    unSavePost,
}