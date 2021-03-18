import { Controller, Get } from '@nestjs/common';
import { Game } from 'src/entities/game.entity';
import * as Papa from 'papaparse';
import { Round } from 'src/entities/round.entity';

@Controller('export')
export class ExportController {
  @Get()
  async getStudyData(): Promise<void> {
    const fakeData = [
      {
        'Column 1': '1-1',
        'Column 2': '1-2',
        'Column 3': '1-3',
        'Column 4': '1-4',
      },
      {
        'Column 1': '2-1',
        'Column 2': '2-2',
        'Column 3': '2-3',
        'Column 4': '2-4',
      },
      {
        'Column 1': '3-1',
        'Column 2': '3-2',
        'Column 3': '3-3',
        'Column 4': '3-4',
      },
      {
        'Column 1': 4,
        'Column 2': 5,
        'Column 3': 6,
        'Column 4': 7,
      },
    ];

    const data = [];

    const allFinishedGames = await Game.find({
      ongoing: false,
    });

    const gamesWithRelations = await Promise.all(
      allFinishedGames.map(
        async (game) =>
          await Game.findOne(game.id, {
            relations: [
              'players',
              'rounds',
              'players.grabs',
              'players.grabs.round',
            ],
          }),
      ),
    );

    gamesWithRelations.forEach((game) => {
      data.push({
        game: `Game: ${game.id}`,
        emotion: `Emotion: ${game.players[0].emotionId}`,
      });
      const p1 = game.players[0];
      const p2 = game.players[1];
      const p3 = game.players[2];
      const p4 = game.players[3];

      game.rounds.forEach((round) => {
        const p1Move = p1.grabs.find((grab) => grab.round.id === round.id);
        const p2Move = p2.grabs.find((grab) => grab.round.id === round.id);
        const p3Move = p3.grabs.find((grab) => grab.round.id === round.id);
        const p4Move = p4.grabs.find((grab) => grab.round.id === round.id);
        data.push({
          round: round.roundNumber,
          playerOne: p1.userId,
          playerOneTake: p1Move.howMany,
          playerOneTime: p1Move.timeTaken,
          playerTwo: p2.userId,
          playerTwoTake: p2Move.howMany,
          playerTwoTime: p2Move.timeTaken,
          playerThree: p3.userId,
          playerThreeTake: p3Move.howMany,
          playerThreeTime: p3Move.timeTaken,
          playerFour: p4.userId,
          playerFourTake: p4Move.howMany,
          playerFourTime: p4Move.timeTaken,
        });
      });
    });

    const csv = Papa.unparse(data, {
      columns: [
        'game',
        'emotion',
        'round',
        'playerOne',
        'playerOneTake',
        'playerOneTime',
        'playerTwo',
        'playerTwoTake',
        'playerTwoTime',
        'playerThree',
        'playerThreeTake',
        'playerThreeTime',
        'playerFour',
        'playerFourTake',
        'playerFourTime',
      ],
    });

    return csv;
  }
}
