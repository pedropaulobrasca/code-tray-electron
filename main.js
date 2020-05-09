const { resolve } = require('path');
const {
  app, Menu, Tray, dialog, MenuItem,
} = require('electron');
const Store = require('electron-store');
const spawn = require('cross-spawn');

// Define o caminho do icone tray
const assetsDic = resolve(__dirname, 'assets', 'icon-tray.png');

// Cria o schema para os dados a serem salvos
const schema = {
  projects: {
    type: 'string',
  },
};
// Inicia o schema
const store = new Store({ schema });

// Ao iniciar o App
app.on('ready', () => {
  // Cria o menu tray
  const tray = new Tray(assetsDic);
  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];

  const items = projects.map((item) => ({
    label: `🗂 ${item.nome}`,
    click() {
      return spawn.sync('code', [item.caminho]);
    },
  }));

  const contextMenu = Menu.buildFromTemplate([...items]);

  /**
   * INICIO MENU FIXO
   */
  contextMenu.insert(0, new MenuItem(
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
  ));

  contextMenu.insert(1, new MenuItem(
    {
      label: '🔁 Reload',
      click() {
        app.quit();
        app.relaunch();
      },
    },
  ));

  contextMenu.insert(2, new MenuItem(
    {
      label: '❌ Quit',
      click() {
        app.quit();
      },
    },
  ));

  contextMenu.insert(3, new MenuItem(
    {
      type: 'separator',
    },
  ));

  contextMenu.insert(0, new MenuItem(
    {
      label: '➕ Nova pasta',
      click: () => {
        dialog
          .showOpenDialog({ properties: ['openDirectory'] })
          .then((result) => {
            const caminho = `${result.filePaths}`;
            let nome = result.filePaths.toString().split('\\');
            nome = nome[nome.length - 1];
            store.set(
              'projects',
              JSON.stringify([
                ...projects,
                {
                  caminho,
                  nome,
                },
              ]),
            );

            const item = new MenuItem({
              label: `🗂 ${nome}`,
              click: () => {
                spawn.sync('code', [caminho]);
              },
            });

            contextMenu.append(item);
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
  ));
  /**
   * FIM MENU FIXO
   */

  tray.setContextMenu(contextMenu);
});
