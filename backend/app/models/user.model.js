module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
      name: {
        type: DataTypes.STRING
      },
      phone: {
          type: DataTypes.STRING
      }
    });
    return User;
  };