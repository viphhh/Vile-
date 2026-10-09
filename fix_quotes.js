const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPageFormModal.tsx', 'utf8');

// The file has content: \`<div ...
// Let's replace content: \` with content: `

code = code.replace(/content: \\`/g, 'content: `');
code = code.replace(/\\`/g, '`');

fs.writeFileSync('src/components/AdminPageFormModal.tsx', code);
