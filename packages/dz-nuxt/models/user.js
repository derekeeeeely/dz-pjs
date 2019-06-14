/*
* @Author: derekeeeeely
* @Date:   2017-04-19 21:31:01
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-19 21:32:48
*/

'use strict'
module.exports = function(sequelize, DataTypes) {
    let user = sequelize.define("user", {
        id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
        username: {type: DataTypes.STRING(100), field: 'username', allowNull: false, unique: true, comment: '账号'},
        password: {type: DataTypes.STRING(100), field: 'password', allowNull: false, comment: '密码'},
        nickname: {type: DataTypes.STRING(100), field: 'nickname', allowNull: true, unique: true, comment: '昵称'}
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'user',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    })
    return user
}
