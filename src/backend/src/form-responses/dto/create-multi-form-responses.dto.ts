type questionAnswerPair = [number, string];

export class CreateMultiFormResponsesDto {
  readonly questionAnswerPairs: questionAnswerPair[];
}
