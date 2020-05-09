const path = require('path');
const {app, Menu, Tray, dialog} = require('electron');
const Store = require('electron-store');
const assetsDic = path.join(__dirname, 'assets');

const schema = {
  teste: {
    type: 'array',
  },
}
const store = new Store({schema});

app.on('ready', () => {
  const tray = new Tray(path.join(assetsDic, 'icon-tray.png'));

  const contextMenu = Menu.buildFromTemplate([
    {label: '🎲 Exibe store', click() {
      console.log(store.get('teste'));
    }},
    {label: '🧹 Limpar store', click() {
      store.clear();
      dialog.showMessageBox({
        type: 'info',
        message: 'Store foi apagado com sucesso!',
        title: '❗'
      })
    }},
    {type: 'separator'},
    {label: '🔁 Reload', click() {
      app.quit();
      app.relaunch();
    }},
    {label: '❌ Quit', click() {
      app.quit();
    }},
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    const caminho = dialog.showOpenDialog({ properties: ['openDirectory']}).then((result) => {
      store.set('teste', result.filePaths);
    });
  })
});