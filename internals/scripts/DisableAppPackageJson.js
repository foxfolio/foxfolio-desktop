const fs = require('fs');

fs.rename('app/package.json', 'app/package.app.json', () => {});
