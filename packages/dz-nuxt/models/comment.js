/*
* @Author: derekeeeeely
* @Date:   2017-04-27 14:43:13
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-27 14:45:24
*/

'use strict'
module.exports = function(sequelize, DataTypes) {
    let comment = sequelize.define("comment", {
        id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
        content: {type: DataTypes.STRING(100), field: 'content', allowNull: false, unique: true, comment: '内容'},
        username: {type: DataTypes.STRING(100), field: 'username', allowNull: false, comment: '用户名'},
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'comment',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    })
    return comment
}
