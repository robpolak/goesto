//TO Execute this script
// osx: mongo ds047792.mongolab.com:47792/goes-to -u goes-to-adm -p ofjdFOEFJCM21 createDatabase.js
// win: "C:\Program Files\MongoDB\Server\3.0\bin\Mongo.exe" ds061208.mongolab.com:61208/emv_dev -u emv_dev_admin -p klasJIOdfskjh38 createDatabase.js
// mongo c377.lighthouse.2.mongolayer.com:10377/emv_dev -u emv_dev_admin -p klasJIOdfskjh38 createDatabase.js

var prefix = 'goesto';

function getTable(name) {
  return prefix +'_'+ name;
}
db[getTable("config")].drop();

db.createCollection(getTable("config"));

db[getTable("config")].insert(
{
  system_name: 'Goes - To',
  type: 'settings',
});




