class GameState {
  constructor() {
    this.isLoggedIn = false;
    this.hasEnteredGame = false;
    this.hasSentCustomCommand = false;
    this.inCombat = false;
    this.currentRoom = {
      name: "",
      exits: [],
      mapNumber: 0,
      roomNumber: 0,
      items: [],
      entities: [],
    };
    this.onlineUsers = [];
  }

  reset() {
    this.isLoggedIn = false;
    this.hasEnteredGame = false;
    this.hasSentCustomCommand = false;
    this.inCombat = false;
    this.currentRoom = {
      name: "",
      exits: [],
      mapNumber: 0,
      roomNumber: 0,
      items: [],
      entities: [],
    };
    this.onlineUsers = [];
  }

  updateRoom(name, exits, mapNumber, roomNumber) {
    this.currentRoom.name = name;
    this.currentRoom.exits = exits;
    this.currentRoom.mapNumber = mapNumber;
    this.currentRoom.roomNumber = roomNumber;
  }

  updateOnlineUsers(users) {
    this.onlineUsers = users;
  }
}

module.exports = new GameState();
