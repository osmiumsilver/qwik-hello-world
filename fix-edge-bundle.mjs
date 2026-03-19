import fs from 'fs';
import path from 'path';

const dir = '.netlify/edge-functions/entry.netlify-edge';
const files = fs.readdirSync(dir);

// 重命名所有 @ 开头的文件
for (const file of files) {
  if (file.startsWith('@')) {
    const newName = file.slice(1); // 去掉 @
    fs.renameSync(path.join(dir, file), path.join(dir, newName));
    console.log(`Renamed: ${file} → ${newName}`);
  }
}

// 修正所有 .js 文件里的 import 路径
for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.js')) continue;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replaceAll('"./@', '"./');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed imports in: ${file}`);
  }
}

console.log('Done.');