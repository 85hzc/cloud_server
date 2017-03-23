DROP TABLE IF EXISTS `user_table`;
CREATE TABLE `user_table`(
    `userId` bigint AUTO_INCREMENT PRIMARY KEY ,
    `username` VARCHAR(64),
    `password` VARCHAR(64),
    `nickname` VARCHAR(64),
    `email` VARCHAR(128)
);

DROP TABLE IF EXISTS `vendor`;
CREATE TABLE `vendor`
(
    `vendorId` bigint AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(64),
    `password` VARCHAR(64),
    `email` VARCHAR(128)
);

DROP TABLE IF EXISTS `plugin_table`;
CREATE TABLE `plugin_table` 
(
    `pluginId` bigint AUTO_INCREMENT PRIMARY KEY,
    `pluginName` VARCHAR(64),
    `pluginDesc` VARCHAR(256),
    `pluginDir` VARCHAR(256),
    `publishVersion` VARCHAR(32),
    `vendorId` bigint,
    FOREIGN KEY (`vendorId`) REFERENCES `vendor`(`vendorId`)
);

DROP TABLE IF EXISTS `plugin_version`;
CREATE TABLE `plugin_version`
(
    `pluginId` bigint,
    `version` VARCHAR(32),
    `changeLog` VARCHAR(512),
    `fileName` VARCHAR(64),
    `md5` VARCHAR(64),
    `createTime`  DATETIME,
    FOREIGN KEY(`pluginId`) REFERENCES `plugin_table`(`pluginId`)
);


DROP TABLE IF EXISTS `firmware_table`;
CREATE TABLE `firmware_table`
(
    `firmwareId` bigint AUTO_INCREMENT PRIMARY KEY,
    `firmwareName` VARCHAR(64),
    `firmwareDesc` VARCHAR(256),
    `firmwareDir` VARCHAR(256),
    `publishVersion` VARCHAR(32),
    `vendorId` bigint, 
    FOREIGN KEY(`vendorId`) REFERENCES `vendor`(`vendorId`)
);

DROP TABLE IF EXISTS `firmware_version`;
CREATE TABLE `firmware_version`
(
    `firmwareId` bigint,
    `version`VARCHAR(32),
    `changeLog` VARCHAR(512),
    `fileName` VARCHAR(64),
    `md5` VARCHAR(256),
    `createTime`  DATETIME,
    FOREIGN KEY (`firmwareId`) REFERENCES `firmware_table` (`firmwareId`)
);

DROP TABLE IF EXISTS `iot_dev_datamodel`;
CREATE TABLE `iot_dev_datamodel`
(
    `dataModelId` bigint AUTO_INCREMENT PRIMARY KEY,
    `devDataModel` json,
    `name` VARCHAR(64),
    `devDesc` VARCHAR(256),
    `manufacture` VARCHAR(64),
    `manufactureDataModelId` INT(11),
    `pluginId` bigint,
    `firmwareId` bigint,
    `vendorId` bigint,
    `createTime` DATETIME,
    FOREIGN KEY (`pluginId`) REFERENCES `plugin_table` (`pluginId`),
    FOREIGN KEY (`firmwareId`)  REFERENCES `firmware_table` (`firmwareId`),
    FOREIGN KEY (`vendorId`) REFERENCES `vendor`(`vendorId`)
);

DROP TABLE IF EXISTS `iot_device`;
CREATE TABLE `iot_device`
(
    `deviceId` bigint AUTO_INCREMENT PRIMARY KEY,
    `deviceDataModelId` bigint,
    `deviceType` VARCHAR(32),
    `manufacture` VARCHAR(64),
    `manufactureSN` VARCHAR(256),
    `gatewayId` VARCHAR(256),
    `online` BOOLEAN DEFAULT FALSE,
    `devData` json,
    `lircData` json,
    `firstOnlineTime` DATETIME,
    `lastOnlineTime` DATETIME,
    `userId` bigint,
    `connec_tion` VARCHAR(32),
    `place` VARCHAR(32),
    FOREIGN KEY (`deviceDataModelId`) REFERENCES `iot_dev_datamodel` (`dataModelId`)
);

DROP TABLE IF EXISTS `dev_user_mapping`;
CREATE TABLE `dev_user_mapping`
(
    `deviceId` bigint,
    `userId` bigint,
    `userDevData` json,
    FOREIGN KEY (`deviceId`) REFERENCES `iot_device` (`deviceId`),
    FOREIGN KEY (`userId`) REFERENCES `user_table` (`userId`)
);

DROP TABLE IF EXISTS `gateway_plugin`;
CREATE TABLE `gateway_plugin`
(
    `deviceId` bigint,
    `pluginId` bigint,
    `version` VARCHAR(32),
    FOREIGN KEY (`deviceId`) REFERENCES `iot_device` (`deviceId`),
    FOREIGN KEY (`pluginId`) REFERENCES `plugin_table` (`pluginId`)
);

DROP TABLE IF EXISTS `lirc_device`;
CREATE TABLE `lirc_device`
(
    `lircId` bigint AUTO_INCREMENT PRIMARY KEY,
    `devType` VARCHAR(32),
    `manufacture` VARCHAR(64),
    `modelName` VARCHAR(64),
    `name` VARCHAR(32),
    `keys` VARCHAR(64) 
);

DROP TABLE IF EXISTS `lirc_code`;
CREATE TABLE `lirc_code`
(
   `id` bigint AUTO_INCREMENT PRIMARY KEY,
   `version` VARCHAR(32),
   `downloadUrl` VARCHAR(256),
   `vendorId` bigint,
   FOREIGN KEY (`vendorId`) REFERENCES `vendor`(`vendorId`)
);

