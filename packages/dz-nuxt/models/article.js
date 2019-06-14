/*
* @Author: derekeeeeely
* @Date:   2017-04-19 15:41:02
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-26 23:56:49
*/

'use strict'
module.exports = function(sequelize, DataTypes) {
    let article = sequelize.define("article", {
        id: {type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
        cover: {type: DataTypes.STRING(100), field: 'cover', allowNull: true, comment: '封面图'},
        title: {type: DataTypes.STRING(100), field: 'title', allowNull: true, comment: '标题'},
        abstract: {type: DataTypes.TEXT, field: 'abstract', allowNull: true, comment: '摘要'},
        type: {type: DataTypes.INTEGER(1), field: 'type', allowNull: false, comment: '分类（1=学习, 2=生活）'},
        tags: {type: DataTypes.STRING(100), field: 'tags', allowNull: true, comment: '标签'},
        content: {type: DataTypes.TEXT, field: 'content', allowNull: true, comment: '内容'},
        stars: {type: DataTypes.INTEGER(10), field: 'stars', allowNull: true, default: 0, comment: '点赞数'},
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'article',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    })
    return article
}
