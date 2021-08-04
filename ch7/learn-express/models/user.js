const Sequelize = require('sequelize');

//                   모델 이름
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({   // Sequelize id 기본 생성
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      married: {
        type: Sequelize.BOOLEAN,    //true false
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE, // DATETIME
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {  
      sequelize,        // 두 번째 인수는 모델에 대한 설정
      timestamps: false,  // true 설정시 crateAt, updateAt 자동
      underscored: false, // crated_at, updated_at // 밑줄생김
      modelName: 'User',
      tableName: 'users', // 보통 적으로 모델이름을 소문자해서 s를 붙임
      paranoid: false,  // deleteAt 까지 생성   // soft delete
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  // 1 : N 관계
  // userhasmany comment
  // 유저 한명이 여러개의 댓글을 갖을 수 있다.
  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
  }
};