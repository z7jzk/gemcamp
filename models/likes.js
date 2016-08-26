module.exports = function (sequelize, DataTypes) {
    return sequelize.define('likes', {
        wbid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        }
    });
};