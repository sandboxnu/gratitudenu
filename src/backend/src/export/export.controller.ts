import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { Game } from 'src/entities/game.entity';
import * as Papa from 'papaparse';

const COLUMNS = [
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
];
@Controller('export')
export class ExportController {
  @Post()
  async getStudyData(
    @Body('password') password: string,
    @Req() ahhh,
  ): Promise<void> {
    this.verifyPassword(password);
    const data = [];
    // find games
    const allFinishedGames = await Game.find({
      ongoing: false,
    });

    // fill out each game with relations
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

    gamesWithRelations.forEach((game) => this.formatGameIntoData(data, game));

    const csv = Papa.unparse(data, {
      columns: COLUMNS,
    });

    return csv;
  }

  private verifyPassword(password: string) {
    const realPassword = process.env.EXPORT_PASSWORD;

    if (realPassword !== password) {
      throw new BadRequestException('Incorrect Password');
    }
  }

  private formatGameIntoData(data, game: Game) {
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
    data.push({}); // new line in between
  }
}
