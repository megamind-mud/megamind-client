const net = require('net');
const TelnetSocket = require('telnet-stream').TelnetSocket;
const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { WebLinksAddon } = require('xterm-addon-web-links');
const MUDAutomator = require('./automator');

// Create a new xterm.js terminal
const term = new Terminal({
  cols: 80,
  rows: 24,
  convertEol: true,
  cursorBlink: true,
  fontSize: 14,
  fontFamily: 'monospace',
  theme: {
    background: '#0A0A0F',
    foreground: '#ffffff',
  },
  scrollback: 1000,  // Add scrollback buffer
});

// Create and load addons
const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();
term.loadAddon(fitAddon);
term.loadAddon(webLinksAddon);

// Initialize the terminal in the 'terminal' div
const terminalElement = document.getElementById('terminal');
term.open(terminalElement);
term.write('\r\n*** Megamind Initialized ***\r\n');
fitAddon.fit();

// Telnet connection parameters
const telnetParams = {
  host: 'bbs.uorealms.com',
  port: 23,
};

const socket = net.createConnection(telnetParams.port, telnetParams.host, () => {
  term.write('\r\n*** Connected to Telnet server ***\r\n');
});

// Wrap the socket with TelnetSocket to handle Telnet negotiations
const telnetSocket = new TelnetSocket(socket);

// Define Telnet option codes
const TELNET_BINARY = 0;

telnetSocket.on('do', (option) => {
  if (option === TELNET_BINARY) {
    telnetSocket.write(Buffer.from([255, 251, TELNET_BINARY])); // IAC WILL BINARY
  }
});

telnetSocket.on('will', (option) => {
  if (option === TELNET_BINARY) {
    telnetSocket.write(Buffer.from([255, 253, TELNET_BINARY])); // IAC DO BINARY
  }
});

// Create MUDAutomator instance
const mudAutomator = new MUDAutomator(telnetSocket);

// Modify the existing data handler
telnetSocket.on('data', (data) => {
  term.write(data);
  term.scrollToBottom();
  mudAutomator.parse(data);  // Add this line to parse incoming data
});

// Handle user input
term.onData((data) => {
  telnetSocket.write(Buffer.from(data, 'utf8'));
});

// Handle connection close
telnetSocket.on('close', () => {
  term.write('\r\n*** Connection closed ***\r\n');
});

// Handle errors
telnetSocket.on('error', (err) => {
  term.write(`\r\n*** Error: ${err.message} ***\r\n`);
});

// Adjust terminal size on window resize
window.addEventListener('resize', () => {
  fitAddon.fit();
});
