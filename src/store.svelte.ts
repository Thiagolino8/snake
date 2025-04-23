export const GameStatus = {
	playing: 'playing',
	lost: 'lost',
	won: 'won',
	choosing: 'choosing',
} as const
export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus]

export const GameDificulty = {
	easy: 10,
	medium: 15,
	hard: 20,
} as const
export type GameDificulty = (typeof GameDificulty)[keyof typeof GameDificulty]

export const game = $state<{ dificulty: GameDificulty; status: GameStatus }>({
	dificulty: GameDificulty.medium,
	status: GameStatus.choosing,
})
