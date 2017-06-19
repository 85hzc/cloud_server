DROP TABLE IF EXISTS `iot_device`;
CREATE TABLE `iot_device`
(
    `deviceId` bigint AUTO_INCREMENT   PRIMARY KEY,
    `manufacture` varchar(64),
    `manufactureSN` VARCHAR(256),
	`online` boolean ,
    `firstOnlineTime` DATETIME,
    `latestOnlineTime` DATETIME,
    `ipAddr` int,
    `uplinkBw` int,
    `downlinkBw` int,
    `beMaster` boolean
);


DROP TABLE IF EXISTS `topo_group`;
create table `topo_group`(
	`topoGroupId` bigint AUTO_INCREMENT  PRIMARY KEY,
    `avgdelay` int,
    `ISP` VARCHAR(20)
);


DROP TABLE IF EXISTS `live_info`;
create table `live_info`(
	`resourceId` bigint AUTO_INCREMENT  PRIMARY KEY,
    `provider` VARCHAR(256),
    `path` VARCHAR(1024),
     `host` VARCHAR(256),
      `time` timestamp
);

DROP TABLE IF EXISTS `dev_live_resource`;
create table `dev_live_resource`(
	`resourceId` bigint,
    `deviceId` bigint,
    `url` varchar(512),
    `bitrate` int,
    `maxSlaveCnt` int,
    `currentSlaveCnt` int,
    `online` int,
    FOREIGN KEY (`resourceId`) REFERENCES `live_info` (`resourceId`)
);


DROP TABLE IF EXISTS `dev_ntw_topo`;
create table `dev_ntw_topo`(
    `deviceId` bigint,
    `topoGroupId` bigint,
    `metricList` VARCHAR(150),
    `publicIpAddr` int,
    FOREIGN KEY (`deviceId`) REFERENCES `iot_device` (`deviceId`),
    FOREIGN KEY (`topoGroupId`) REFERENCES `topo_group` (`topoGroupId`)
    
);


DROP TABLE IF EXISTS `transfer_resource`;
create table `transfer_resource`(
	`deviceId` bigint , 
	`src` bigint ,
	`resourceId` bigint ,
    `online` int,
    `totalBytes` varchar(1024) 


);
