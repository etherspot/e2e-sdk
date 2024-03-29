import fs from 'fs';
import addContext from 'mochawesome/addContext.js';

before('Validate the version of the Etherspot SDK', function () {
  var test = this;

  // Specify the path to the package.json file of etherspot-sdk
  const packageJsonPath = './etherspot-sdk/package.json';

  // Read and parse the package.json file
  fs.readFile(packageJsonPath, 'utf8', function (err, data) {
    if (err) {
      console.error('Error reading package.json:', err);
    } else {
      const packageInfo = JSON.parse(data);
      console.log('etherspot-sdk version:', packageInfo.version);
      addContext(test, 'etherspot-sdk version: ' + packageInfo.version);
    }
  });
});
