const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPageFormModal.tsx', 'utf8');

code = code.replace(
  "id: pageToEdit ? pageToEdit.id : \\`page-\\${Date.now()}\\`,",
  "id: pageToEdit ? pageToEdit.id : \`page-\${Date.now()}\`,"
);

fs.writeFileSync('src/components/AdminPageFormModal.tsx', code);
