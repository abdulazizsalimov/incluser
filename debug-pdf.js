import fs from 'fs';
import path from 'path';

console.log('=== DEBUG PDF ACCESSIBILITY ===');

// Проверим текущую рабочую директорию
console.log('Current working directory:', process.cwd());

// Проверим NODE_ENV
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');

// Проверим существование файла в attached_assets
const attachedAssetsPath = path.resolve(process.cwd(), 'attached_assets', 'wcag-2.1-guide.pdf');
console.log('attached_assets PDF path:', attachedAssetsPath);
console.log('attached_assets PDF exists:', fs.existsSync(attachedAssetsPath));

// Проверим существование файла в dist/public/assets
const distAssetsPath = path.resolve(process.cwd(), 'dist', 'public', 'assets', 'wcag-2.1-guide.pdf');
console.log('dist/public/assets PDF path:', distAssetsPath);
console.log('dist/public/assets PDF exists:', fs.existsSync(distAssetsPath));

// Проверим директорию dist/public/assets
const distAssetsDirPath = path.resolve(process.cwd(), 'dist', 'public', 'assets');
console.log('dist/public/assets directory path:', distAssetsDirPath);
console.log('dist/public/assets directory exists:', fs.existsSync(distAssetsDirPath));

if (fs.existsSync(distAssetsDirPath)) {
  const files = fs.readdirSync(distAssetsDirPath);
  console.log('Files in dist/public/assets:', files.filter(f => f.includes('wcag') || f.includes('.pdf')));
}

// Проверим права доступа
if (fs.existsSync(attachedAssetsPath)) {
  const stats = fs.statSync(attachedAssetsPath);
  console.log('attached_assets PDF stats:', {
    size: stats.size,
    mode: stats.mode.toString(8),
    isFile: stats.isFile()
  });
}

if (fs.existsSync(distAssetsPath)) {
  const stats = fs.statSync(distAssetsPath);
  console.log('dist/public/assets PDF stats:', {
    size: stats.size,
    mode: stats.mode.toString(8),
    isFile: stats.isFile()
  });
}