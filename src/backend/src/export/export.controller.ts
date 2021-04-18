import { Body, Controller, Post } from '@nestjs/common';
import { Game } from 'src/entities/game.entity';
import * as Papa from 'papaparse';
import { AdminService } from 'src/admin/admin.service';

const BASE_COLUMNS = [
  'game',
  'emotion',
  'userId',
  'gameId',
  'emotionId',
  'totalRounds',
  'totalPointsTaken',
];
@Controller('export')
export class ExportController {
  constructor(private adminService: AdminService) {}

  @Post()
  async export(@Body('password') password: string): Promise<void> {
    let maxRounds = 0;
    this.adminService.verifyPassword(password);
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

    gamesWithRelations.forEach((game) => {
      if (game.rounds.length > maxRounds) {
        maxRounds = game.rounds.length;
      }
      this.formatGameToCsv(game, data);
    });

    const csv = Papa.unparse(data, {
      columns: this.generateColumns(maxRounds),
    });

    return csv;
  }

  private formatGameToCsv(game: Game, data: Record<string, any>[]) {
    data.push({
      game: `Game: ${game.id}`,
      emotion: `Emotion: ${game.players[0].emotionId}`,
    });
    game.players.forEach((player) => {
      const playerData = {
        userId: player.userId,
        gameId: game.id,
        emotionId: player.emotionId,
        totalRounds: player.grabs.length,
      };
      let totalPoints = 0;

      player.grabs.forEach((grab) => {
        playerData[`round${grab.round.roundNumber}Take`] = grab.howMany;
        playerData[`round${grab.round.roundNumber}Time`] = grab.timeTaken;
        totalPoints += grab.howMany;
      });
      playerData['totalPointsTaken'] = totalPoints;

      data.push(playerData);
    });
  }

  private generateColumns(maxRounds: number): string[] {
    const columns = BASE_COLUMNS.slice();

    for (let i = 1; i <= maxRounds; i++) {
      columns.push(`round${i}Take`, `round${i}Time`);
    }
    return columns;
  }
}
