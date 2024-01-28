const Subscription = require('./Subscription')
const User = require('../auth/models/User')

const subscribeTo = async(req, res) => {
    if(req.body.profileId && req.body.profileId.length > 0){
        const profile = await User.findByPk(req.body.profileId);
        const subscription = await Subscription.findOne({
            where: {
                profileId: req.body.profileId,
                followerId: req.user.id
            }
        })
        if(!profile){
            res.status(401).send({message: 'Такого профиля не существует'})
        } else if(subscription){
            res.status(402).send({message: 'Пользователь уже подписан'})
        } else if(profile){
            const subscription = await Subscription.create({
                profileId: req.body.profileId,
                followerId: req.user.id,
            });
            res.status(200).send({message: 'Вы подписались!'})
        }
    } else {
        res.status(403).end()
    }
}
const unSubscribeFrom = async(req, res) => {
    if(req.body.profileId && req.body.profileId.length > 0){
        const subscription = await Subscription.findOne({
            where: {
                profileId: req.body.profileId,
                followerId: req.user.id
            }
        })
        if(subscription){
            await Subscription.destroy({
                where: {
                    profileId: req.body.profileId,
                    followerId: req.user.id
                }
            })
            res.status(200).end()
        } else {
            res.status(401).send({message: 'Подписки нет'})
        }
    } else {
        res.status(402).end()
    }
}

const getFollowers = async(req, res) => {
    const profile = await User.findOne({where: {login: req.params.username}});
    if(profile){
        let followers = await Subscription.findAll({
            where: {
                profileId: profile.id,
            }, 
            include: [
                    {
                        model: User,
                        as: 'follower'
                    }
                ]
        })
        for(let follower of followers){
            follower.follower.password = "";
        }
        res.status(200).send(followers);
    } else {
        res.status(400).send({message: 'Такого профиля не существует'})
    }
}

const getProfiles = async(req, res) => {
    const follower = await User.findOne({where: {login: req.params.username}});
    if(follower){
        const followers = await Subscription.findAll({
            where: {
                followerId: follower.id,
            }, 
            include: [
                    {
                        model: User,
                        as: 'profile'
                    }
                ]
        })
        for(let follower of followers){
            follower.profile.password = "";
        }
        res.status(200).send(followers);
    } else {
        res.status(400).send({message: 'Такого профиля не существует'})
    }
}
module.exports = {
    subscribeTo, 
    unSubscribeFrom, 
    getFollowers,
    getProfiles,
}