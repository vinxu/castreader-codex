// Isolated Electron test host; never attaches to or modifies Codex.
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const runDir = path.resolve(process.argv[2]);
const auto = process.argv.includes('--test');
app.setName('CastReader DOM Sync Lab');
app.setPath('userData', path.join(runDir, 'electron-profile'));
app.whenReady().then(async () => {
  const win = new BrowserWindow({width:1060,height:940,show:true,title:'CastReader DOM Sync Lab',
    webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,autoplayPolicy:'no-user-gesture-required'}});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',event=>event.preventDefault());
  await win.loadFile(path.join(runDir,'app','index.html'));
  if(auto){
    try {
      const result = await win.webContents.executeJavaScript('window.runSyncTests()');
      fs.writeFileSync(path.join(runDir,'browser-results.json'),JSON.stringify(result,null,2));
      await win.webContents.executeJavaScript('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
      const shot = await win.webContents.capturePage();
      fs.writeFileSync(path.join(runDir,'screenshot.png'),shot.toPNG());
      console.log(JSON.stringify(result));
      if(!process.argv.includes('--keep-open')) app.exit(result.passed ? 0 : 1);
    } catch(error){console.error(error.message);app.exit(1);}
  }
});
app.on('window-all-closed',()=>app.quit());
