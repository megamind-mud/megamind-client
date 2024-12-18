/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import '@xterm/xterm/css/xterm.css';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
// import { WebLinksAddon } from '@xterm/addon-web-links'
// import { WebglAddon } from "@xterm/addon-webgl";
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import './assets/css/index.css';
import './assets/css/fonts.css';

const app = createApp(App);
app.use(store);
app.mount('#app');

// todo: find a better place to put these
window.electronAPI.onNewRoom((event, info) => {
  store.dispatch('game/updateGameState', {
    type: 'NEW_ROOM',
    payload: info,
  });
});

window.electronAPI.onConversation((event, conversation) => {
  store.dispatch('conversations/addConversation', conversation);
});

window.electronAPI.onPlayerStats((event, stats) => {
  // console.log("Player stats updated:", stats);
  store.dispatch('game/updateGameState', {
    type: 'UPDATE_PLAYER_STATS',
    payload: stats,
  });
});

window.electronAPI.onUpdateOnlineUsers((event, users) => {
  store.dispatch('game/updateGameState', {
    type: 'UPDATE_ONLINE_USERS',
    payload: users,
  });
});

window.electronAPI.onGameStateUpdated((event, gameState) => {
  console.log('gameStateUpdated', gameState);
  store.dispatch('game/updateGameState', {
    type: 'UPDATE_GAME_STATE',
    payload: gameState,
  });
});

function initTerminal() {
  // Create a new xterm.js terminal
  const term = new Terminal({
    cols: 80,
    rows: 40,
    convertEol: true,
    cursorBlink: true,
    fontFamily: 'perfect_dos_vga_437regular',
    fontSize: 16,
    letterSpacing: -1,
    theme: {
      background: '#000000',
      foreground: '#ffffff',
      black: '#000000',
      blue: '#0026c3',
      brightBlue: '#007bff',
      red: '#b10a0a',
      brightRed: '#ff0000',
      brightGreen: '#00ff00',
      brightYellow: '#ffff00',
      magenta: '#800080',
      brightMagenta: '#ff00ff',
    },
    scrollback: 1000,
  });

  // Create and load addons
  // *disabled for now, re-visit later*
  const fitAddon = new FitAddon();
  // const webLinksAddon = new WebLinksAddon();
  // const webGlAddon = new WebglAddon();
  term.loadAddon(fitAddon);
  // term.loadAddon(webLinksAddon);
  // term.loadAddon(webGlAddon);

  // Initialize the terminal in the 'terminal' div
  const terminalElement = document.getElementById('terminal');

  term.attachCustomKeyEventHandler((event) => {
    if ((event.type === 'keydown' || event.type === 'keypress') && event.code.startsWith('Numpad')) {
      const numpadKey = event.code.replace('Numpad', '');
      let command = '';

      switch (numpadKey) {
        case '8':
          command = 'n';
          break;
        case '2':
          command = 's';
          break;
        case '4':
          command = 'w';
          break;
        case '6':
          command = 'e';
          break;
        case '7':
          command = 'nw';
          break;
        case '9':
          command = 'ne';
          break;
        case '1':
          command = 'sw';
          break;
        case '3':
          command = 'se';
          break;
        case '5':
          command = 'look';
          break;
        default:
          return true;
      }

      if (event.type === 'keydown') {
        window.electronAPI.sendData(command + '\r');
      }
      return false;
    }
    return true;
  });

  term.onData((data) => {
    window.electronAPI.sendData(data);
  });

  term.open(terminalElement);
  term.write('\x1b[44m\x1b[37m\r\n*** Megamind Initialized ***\x1b[0m\x1b[K\r\n');
  // fitAddon.fit();

  window.electronAPI.onServerConnected(() => {
    term.write('\x1b[44m\x1b[37m*** Connected to Server ***\x1b[0m\x1b[K\r\n');
  });

  window.electronAPI.onServerData((event) => {
    term.write(event.dataTransformed);
  });

  window.electronAPI.onServerClosed(() => {
    term.write('\x1b[44m\x1b[37m\r\n*** Connection Closed ***\x1b[0m\x1b[K\r\n');
  });

  window.electronAPI.onServerError((err) => {
    term.write(`\x1b[44m\x1b[37m\r\n*** Error: ${err} ***\r\n\x1b[0m`);
  });

  window.electronAPI.onTerminalWrite((event, data) => {
    term.write(`\x1B[1;37;44m[${data}]\x1B[0m\n`);
  });

  return term;
}

function startLoginRoutine() {
  initTerminal();
  window.electronAPI.clientLoaded();
  // window.electronAPI.connectToServer();
}

setTimeout(() => {
  startLoginRoutine();
}, 100);
