module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('restaurant', {
      name: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING
      },
      pickupStart: {
        type: DataTypes.TIME
      },
      pickupEnd: {
        type: DataTypes.TIME
      }
    });
  
    return Restaurant;
  };