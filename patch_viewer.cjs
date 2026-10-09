const fs = require('fs');
let code = fs.readFileSync('src/components/PageViewer.tsx', 'utf8');
code = code.replace(
  "dangerouslySetInnerHTML={{ __html: page.content.replace(/\\\\n/g, '<br/>') }}",
  "dangerouslySetInnerHTML={{ __html: page.content }}"
);
fs.writeFileSync('src/components/PageViewer.tsx', code);
