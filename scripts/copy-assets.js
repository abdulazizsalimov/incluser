import fs from 'fs';
import path from 'path';

// Функция для копирования файлов
function copyFile(src, dest) {
  try {
    // Создаем директорию если не существует
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Копируем файл
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src}:`, error.message);
  }
}

// Копируем PDF файлы из attached_assets в dist/public/assets
const assetsDir = path.resolve(process.cwd(), 'attached_assets');
const distAssetsDir = path.resolve(process.cwd(), 'dist/public/assets');

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  
  files.forEach(file => {
    if (file.endsWith('.pdf')) {
      const srcPath = path.join(assetsDir, file);
      const destPath = path.join(distAssetsDir, file);
      copyFile(srcPath, destPath);
    }
  });
  
  console.log('Assets copying completed!');
} else {
  console.log('attached_assets directory not found, skipping...');
}