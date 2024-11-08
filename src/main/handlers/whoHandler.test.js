/* eslint-disable prettier/prettier */
import { describe, it, expect, beforeEach } from 'vitest';
import WhoHandler from './whoHandler.js';

describe('WhoHandler', () => {
  let handler;
  let mockCommandManager;
  let mockGameState;
  let mockPlayerStats;

  beforeEach(async () => {
    mockCommandManager = {};
    mockGameState = {};
    mockPlayerStats = {};

    handler = new WhoHandler(
      undefined, // Empty event bus since we'll call updatePlayers directly
      mockCommandManager,
      mockGameState,
      mockPlayerStats
    );
  });

  describe('updatePlayers', () => {
    it('correctly parses who list data', async () => {
      const whoList = [
        '        Current Adventurers',
        '         ===================',
        '',
        '  Outlaw Albion Ston           -  Nature\'s Servant of Rescue Rangers V',
        '         Anthrax NOTbossMAN    -  Lama of You\'re Mom V',
        '    Good Arax Spindreft        -  Maharishi of harsh.beast V',
        '    Good Barnabus Oliphant     -  Myrmidon of harsh.beast V',
        ' Villain Barry Boomstick       -  Nightblade of Domination V',
        '         Beanis Weanis         -  Warrior Priest of La Muerte V',
        ' Villain Beastie Boy           -  Chancellor of You\'re Mom V',
        '    Good Beavis                -  Eradicator of Spaceballs the Gang V'
      ];

      await handler.updatePlayers(whoList);

      const players = await handler.fromFantasyStyleWhoList(whoList);

      expect(players.length).toBe(8);

      // Test first player
      expect(players[0]).toMatchObject({
        name: 'Albion',
        last: 'Ston',
        alignment: 'Outlaw',
        flags: '-',
        title: "Nature's Servant",
        gang: 'Rescue Rangers',
        status: 'V',
      });

      // Test player without alignment
      expect(players[1]).toMatchObject({
        name: 'Anthrax',
        last: 'NOTbossMAN',
        alignment: '        ',
        flags: '-',
        title: 'Lama',
        gang: "You're Mom",
        status: 'V',
      });

      // Test player with Villain alignment
      expect(players[4]).toMatchObject({
        name: 'Barry',
        last: 'Boomstick',
        alignment: 'Villain',
        flags: '-',
        title: 'Nightblade',
        gang: 'Domination',
        status: 'V',
      });
    });

    it('correctly parses technical style who list', async () => {
      const whoList = [
        'Title           Name                   Reputation Gang/Guild',
        '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=',
        'Supreme Archmag Ajax Cleaner           Good       Divine Nation',
        "Nature's Spirit Axel Grease         ga Good       Stratton Oakmont",
        'Dragonslayer    BabaTank OfTheDark     Neutral    Divine Nation',
        'High Inquisitor Bleam Bleam            Villain    {EightyHD}',
        'Stalker         Buzz Lightyear         Lawful     None',
        'Lord Magus      Dog Exp                Criminal   The Horny Goat',
        'Exalted Shield  Infinity Timez         Neutral    Stratton Oakmont',
        'Supreme Kai     KungFu Panda           Villain    spud',
        'Lord of Nature  Laef TreeFell          Lawful     spud',
        'Dragoon         Margolin Lamonde       Good       None',
        'Master Assassin Meth Mouth             FIEND      {EightyHD}'
      ];

      await handler.updatePlayers(whoList);
      const players = await handler.fromTechnicalStyleWhoList(whoList);

      expect(players.length).toBe(11);
    });
  });
});