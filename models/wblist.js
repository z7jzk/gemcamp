module.exports = function (sequelize, DataTypes) {
    return sequelize.define('wblist', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        mtext: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
};