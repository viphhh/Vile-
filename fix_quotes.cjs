const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPageFormModal.tsx', 'utf8');

code = code.replace(/content: \\`/g, 'content: `');
code = code.replace(/\\\`/g, '`');

fs.writeFileSync('src/components/AdminPageFormModal.tsx', code);
