var plugin = {
    insert : 'insert into tblplugin values($1,$2)',
    update : 'update tblplugin set plugdesc=$1 where plugname=$2',
    delete : 'delete from tblplugin where plugname=$1',
    queryByName : 'select * from tblplugin where plugname=$1',
    queryAll : 'select * from tblplugin'
};

module.exports = plugin;
