const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      host: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      type: {
        // ENUM 'free', 'premium'만 사용 할 수있다.
        type: Sequelize.ENUM('free', 'premium'),
        allowNull: false,
      },
      // REST API KEY
      clientSecret: {
        // type을 STRING해도되지만 UUID로 하면 버전까지 확인가능
        type: Sequelize.UUID,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Domain',
      tableName: 'domains',
    });
  }

  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
};