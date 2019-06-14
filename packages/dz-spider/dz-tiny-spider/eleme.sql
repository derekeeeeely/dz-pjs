CREATE TABLE `blocks2` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `status` int(11) DEFAULT NULL,
  `blockId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
CREATE TABLE `eleme1101` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `shopId` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `province` varchar(50) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `monthly` int(11) DEFAULT NULL,
  `deliverType` varchar(50) DEFAULT NULL,
  `deliverFee` varchar(50) DEFAULT NULL,
  `deliverTime` int(11) DEFAULT NULL,
  `period` varchar(50) DEFAULT NULL,
  `grid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;