DROP TABLE IF EXISTS user_table;
CREATE TABLE user_table
(
    "userId" bigserial PRIMARY KEY,
    "username" varchar(64),
    "password" varchar(64),
    "nickname" varchar(64),
    "email" varchar(128)
);

DROP TABLE IF EXISTS iot_dev_datamodel;
CREATE TABLE iot_dev_datamodel
(
    "dataModelId" bigserial PRIMARY KEY,
    "devDataModel" json,
    "manufacture" varchar(64),
    "manufactureDataModelId" bigint,
    "pluginId" bigint,
    "firmwareId" bigint,
    "createTime" timestamptz
);

DROP TABLE IF EXISTS iot_device;
CREATE TABLE iot_device
(
    "deviceId" bigserial PRIMARY KEY,
    "deviceDataModelId" bigint REFERENCES iot_dev_datamodel ("dataModelId"),
    "deviceType" varchar(32),
    "manufacture" varchar(64),
    "manufactureSN" varchar(256),
    "gatewayId" varchar(256),
    "online" boolean DEFAULT false,
    "devData" json,
    "firstOnlineTime" timestamptz,
    "lastOnlineTime" timestamptz,
    "userId" bigint
);

DROP TABLE IF EXISTS dev_user_mapping;
CREATE TABLE dev_user_mapping
(
    "deviceId" bigint REFERENCES iot_device ("deviceId"),
    "userId" bigint REFERENCES user ("userId"),
    "userDevData" json
);

DROP TABLE IF EXISTS plugin_table;
CREATE TABLE plugin_table
(
    "pluginId" bigserial PRIMARY KEY,
    "pluginName" varchar(64) default ''
    "pluginDesc" varchar(256) default ''
    "pluginDir" varchar(256) default ''
    "newestVersion" varchar(32) default ''
);

DROP TABLE IF EXISTS plugin_version;
CREATE TABLE plugin_version
(
    "pluginId" bigint REFERENCES plugin_table ("pluginId"),
    "version" varchar(32) default '',
    "changeLog" varchar(512) default '',
    "fileName" varchar(64) default ''
);

DROP TABLE IF EXISTS gateway_plugin;
CREATE TABLE gateway_plugin
(
    "deviceId" bigint REFERENCES iot_device ("deviceId"),
    "pluginId" bigint REFERENCES plugin_table ("pluginId"),
    "version" varchar(32) default '',
);

DROP TABLE IF EXISTS firmware_table;
CREATE TABLE firmware_table
(
    "firmwareId" bigserial PRIMARY KEY,
    "firmwareDir" varchar(256) default '',
    "newestVersion" varchar(32) default ''
);

DROP TABLE IF EXISTS firmware_version;
CREATE TABLE firmware_version
(
    "firmwareId" bigint REFERENCES firmware_table ("firmwareId"),
    "version" varchar(32) default '',
    "changeLog" varchar(512) default '',
    "fileName" varchar(64) default ''
);
