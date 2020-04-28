module.exports = (sequelize, Sequelize) => {
  const Dish = sequelize.define('dish', {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.STRING
    }
  });

  return Dish;
};