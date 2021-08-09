const { Op } = require('Sequelize');
const schedule = require('node-schedule');
const { Good, Auction, User, sequelize } = require('./models');

// 서버 시작 되지마자 checkAuction이 실행
module.exports = async () => {
    console.log('checkAuction');
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // 어제 시간
        // 어제 경매가 생성되었는데 낙찰 되지 않은 애들 검색
        const targets = await Good.findAll({
            where: {
                SoldId: null,
                createdAt: { [Op.lte]: yesterday },
            },
        });
        // 똑같이 낙찰 시켜줌
        targets.forEach(async (target) => {
            const success = await Auction.findOne({
                where: { GoodId: target.id },
                order: [['bid', 'DESC']],
            });
            await Good.update({ SoldId: success.UserId }, { where: { id: target.id } });
            await User.update({
                money: sequelize.literal(`money - ${success.bid}`),
            }, {
                where: { id: success.UserId },
            });
        });
        const unsold = await Good.findAll({
            where: {
                SoldId: null,
                createdAt: { [Op.gt]: yesterday },
            },
        });
        unsold.forEach((target) => {
            const end = new Date(unsold.createdAt);
            // 24시간 뒤
            end.setDate(end.getDate() + 1);
            schedule.scheduleJob(end, async () => {
                const success = await Auction.findOne({
                    where: { GoodId: target.id },
                    order: [['bid', 'DESC']],
                });
                await Good.update({ SoldId: success.UserId }, { where: { id: target.id } });
                await User.update({
                    money: sequelize.literal(`money - ${success.bid}`),
                }, {
                    where: { id: success.UserId },
                });
            });
        });
    } catch (error) {
        console.error(error);
    }
};