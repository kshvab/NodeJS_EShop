const fs = require('fs');
const CronJob = require('cron').CronJob;
const xmlParsing = require('./shopxmlparsing');

function runCronAutoImport() {
  new CronJob(
    //'*/15 * * * * *',
    '* 8,18 * * * *',
    function() {
      let importSettingsStr = fs.readFileSync(
        './settings/importsettings.json',
        {
          encoding: 'UTF-8'
        }
      );
      console.log('test');
      let importSettings = JSON.parse(importSettingsStr);
      if (importSettings.autoImport == 'false') {
        this.stop();
      }

      //Task
      console.log('STARTING IMPORT........');
      xmlParsing.runXmlParsing();
    },
    null,
    true,
    'America/Los_Angeles'
  );
}
module.exports = {
  runCronAutoImport
};
