const User = require('../models/user');


exports.addFollowing = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await user.addFollowings([parseInt(req.params.id, 10)]); // model assoicate as 설정이름으로 //setFollowings 수정시  //removeFollwings
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};