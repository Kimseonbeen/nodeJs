const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,  // kakao 로그인시 비밀번호 없음
      },
      provider: {         // 디폴트 local, 예외로 kakao, naver 
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'local',  
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      // User : User = N : N
      // foreignKey 작성은 안 하면 기본적으로
      // UserId 가 되는데 이럴 경우 누가 팔로우아이디인지
      // 팔로워 아이디인지 분간을 하지 못 한다
      
      // as 와 foreignKey는 서로 반대가 되야 한다.
      foreignKey: 'followingId',  
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
};