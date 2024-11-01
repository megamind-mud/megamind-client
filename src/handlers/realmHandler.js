class RealmHandler {
  constructor(eventBus, commandManager) {
    this.eventBus = eventBus;
    this.commandManager = commandManager;

    this.eventBus.on("new-message-batch", async (batch) => {
      this.handleWhoCommand(batch.lines, batch.messages);
    });

    this.eventBus.on("new-message-line", (line) => {
      if (line.line.includes("The gods have punished you appropriately.")) {
        this.commandManager.sendCommand("");
      }
    });
  }

  handleWhoCommand = (lines, messages) => {
    // "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    // if the lines contain the previous, then we can assume that the next lines are the users in the realm
    // in technical style
    if (
      lines.includes(
        "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
      )
    ) {
      const userLines = lines.slice(
        lines.indexOf(
          "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
        ) + 1
      );
      const onlineUsers = userLines
        .map((line) => {
          // given a line like this:
          // test = "Cutthroat       Throne Mithril         Neutral    None                      "
          // we want to get:
          // title = "Cutthroat"
          // name = "Throne Mithril"
          // align = "Neutral"
          // gang = "None"

          const playerParts = line.split("  ");
          const actualParts = playerParts.filter((part) => part.trim() !== "");
          const title = actualParts[0].trim();
          const nameParts = actualParts[1].trim().split(" ");
          const firstName = nameParts[0].trim();
          const lastName = nameParts[1].trim();
          const align = actualParts[2].trim();
          const gang = actualParts[3].trim();

          return {
            title: title,
            firstName: firstName,
            lastName: lastName,
            align: align,
            gang: gang,
          };
        })
        .filter(Boolean); // Remove any null values
      this.eventBus.emit("update-online-users", onlineUsers);
    }
  };
}

export default RealmHandler;
