export const enum GameStatus {
	playing,
	lost,
	won,
	choosing,
}

export const enum GameDificulty {
	easy = 10,
	medium = 15,
	hard = 20,
}

export const game = $state({ dificulty: GameDificulty.medium, status: GameStatus.choosing });
