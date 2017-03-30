DROP TABLE IF EXISTS user_table;
CREATE TABLE user_table
(
    "userId" bigserial PRIMARY KEY,
    "username" varchar(64),
    "password" varchar(64),
    "nickname" varchar(64),
    "email" varchar(128)
);

DROP TABLE IF EXISTS vendor;
CREATE TABLE vendor
(
    "vendorId" bigserial PRIMARY KEY,
    "username" varchar(64),
    "password" varchar(64),
    "email" varchar(128)
);

DROP TABLE IF EXISTS plugin_table;
CREATE TABLE plugin_table
(
    "pluginId" bigserial PRIMARY KEY,
    "pluginName" varchar(64) default '',
    "pluginDesc" varchar(256) default '',
    "pluginDir" varchar(256) default '',
    "publishVersion" varchar(32) default '',
    "vendorId" bigint REFERENCES vendor("vendorId")
);

DROP TABLE IF EXISTS plugin_version;
CREATE TABLE plugin_version
(
    "pluginId" bigint REFERENCES plugin_table ("pluginId"),
    "version" varchar(32) default '',
    "changeLog" varchar(512) default '',
    "fileName" varchar(64) default '',
    "md5" varchar(64) default '',
    "createTime"  timestamptz
);


DROP TABLE IF EXISTS firmware_table;
CREATE TABLE firmware_table
(
    "firmwareId" bigserial PRIMARY KEY,
    "firmwareName" varchar(64),
    "firmwareDesc" varchar(256),
    "firmwareDir" varchar(256) default '',
    "publishVersion" varchar(32) default '',
    "vendorId" bigint REFERENCES vendor("vendorId")
);

DROP TABLE IF EXISTS firmware_version;
CREATE TABLE firmware_version
(
    "firmwareId" bigint REFERENCES firmware_table ("firmwareId"),
    "version" varchar(32) default '',
    "changeLog" varchar(512) default '',
    "fileName" varchar(64) default '',
    "md5" varchar(256) default '',
    "createTime"  timestamptz
);

DROP TABLE IF EXISTS iot_dev_datamodel;
CREATE TABLE iot_dev_datamodel
(
    "dataModelId" bigserial PRIMARY KEY,
    "devDataModel" json,
    "name" varchar(64),
    "devDesc" varchar(256),
    "manufacture" varchar(64),
    "manufactureDataModelId" bigint,
    "pluginId" bigint REFERENCES plugin_table ("pluginId"),
    "firmwareId" bigint REFERENCES firmware_table ("firmwareId"),
    "vendorId" bigint REFERENCES vendor("vendorId"),
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
    "lircData" json,
    "firstOnlineTime" timestamptz,
    "lastOnlineTime" timestamptz,
    "userId" bigint,
    "connection" varchar(32),
    "place" varchar(32)
);

DROP TABLE IF EXISTS dev_user_mapping;
CREATE TABLE dev_user_mapping
(
    "deviceId" bigint REFERENCES iot_device ("deviceId"),
    "userId" bigint REFERENCES user_table ("userId"),
    "userDevData" json
);

DROP TABLE IF EXISTS gateway_plugin;
CREATE TABLE gateway_plugin
(
    "deviceId" bigint REFERENCES iot_device ("deviceId"),
    "pluginId" bigint REFERENCES plugin_table ("pluginId"),
    "version" varchar(32) default ''
);

DROP TABLE IF EXISTS lirc_device;
CREATE TABLE lirc_device
(
    "lircId" bigserial PRIMARY KEY,
    "devType" varchar(32),
    "manufacture" varchar(64),
    "modelName" varchar(64),
    "name" varchar(32),
    "key" varchar(32) ARRAY
);

DROP TABLE IF EXISTS lirc_code;
CREATE TABLE lirc_code
(
   "id" bigserial PRIMARY KEY,
   "version" varchar(32),
   "downloadUrl" varchar(256),
   "vendorId" bigint REFERENCES vendor("vendorId")
);

DROP TABLE IF EXISTS upstream_flow_raw;
CREATE TABLE upstream_flow_raw
(
   "deviceId" bigserial,
   "sip" varchar(32),
   "dip" varchar(32),
   "bw"  int ARRAY
);
