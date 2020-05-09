const {
  resolve,
} = require('path');
const {
  app,
  Menu,
  Tray,
  dialog,
} = require('electron');
const Store = require('electron-store');

const assetsDic = resolve(__dirname, 'assets', 'icon-tray.png');

const schema = {
  projects: {
    type: 'string',
  },
};
const store = new Store({ schema });

app.on('ready', () => {
  const tray = new Tray(assetsDic);
  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🎲 Exibe store',
      click() {
        console.log(store.get('projects[]'));
      },
    },
    {
      label: '🧹 Limpar store',
      click() {
        store.clear();
        dialog.showMessageBox({
          type: 'info',
          message: 'Store foi apagado com sucesso!',
          title: '❗',
        });
      },
    },
    { type: 'separator' },
    {
      label: '🔁 Reload',
      click() {
        app.quit();
        app.relaunch();
      },
    },
    {
      label: '❌ Quit',
      click() {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    dialog.showOpenDialog({ properties: ['openDirectory'] })
      .then((result) => {
        const nome = result.filePaths.toString().split('\\');
        store.set('projects[]', [...projects, {
          caminho: `${result.filePaths}`,
          nome: nome[nome.length - 1],
        }]);
        // console.log(store.get('projects[]'));
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
