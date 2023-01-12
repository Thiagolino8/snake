<script lang="ts">
	import { swipe } from 'svelte-gestures'
	import { gameDificulty, GameStatus, gameStatus } from '../routes/+page.svelte'
	import Cell, { CellType } from './Cell.svelte'

	type HandleDirectionProps<T extends boolean> = T extends true
		? { e: KeyboardEvent; key: T }
		: {
				e: CustomEvent<{
					direction: 'top' | 'bottom' | 'left' | 'right'
					target: EventTarget
				}>
				key: T
		  }

	enum Direction {
		up,
		down,
		left,
		right,
	}

	const snakeInitialBody = [
		[0, 0],
		[1, 0],
		[2, 0],
	]

	let snakeBody: typeof snakeInitialBody = JSON.parse(JSON.stringify(snakeInitialBody))
	let snakeSpeed: number
	let snakeDirection: [Direction, boolean][] = [[Direction.right, false]]
	let interval: NodeJS.Timer
	let foodPosition: [number, number]

	$: if ($gameStatus !== GameStatus.playing) {
		snakeSpeed = 0
	} else {
		reset()
		snakeSpeed = 200
	}

	$: $gameDificulty && reset()

	const createBoard = (size: number) =>
		Array.from({ length: size }).map(() => Array.from({ length: size }).map(() => CellType.empty))

	let board: CellType[][] = createBoard($gameDificulty)

	const reset = () => {
		snakeDirection = [[Direction.right, false]]
		clearInterval(interval)
		board = createBoard($gameDificulty)
		snakeBody = JSON.parse(JSON.stringify(snakeInitialBody))
		getFoodPosition()
	}

	const lost = () => {
		$gameStatus = GameStatus.lost
		render()
	}

	const won = () => {
		$gameStatus = GameStatus.won
		render()
	}

	const insertSnake = () => {
		snakeBody.forEach(([x, y], i) => {
			const isHead = i === snakeBody.length - 1
			board[y][x] = isHead ? CellType.head : CellType.body
		})
		board = board
	}

	const getFoodPosition = () => {
		const [x, y] = [Math.floor(Math.random() * $gameDificulty), Math.floor(Math.random() * $gameDificulty)]

		board[y][x] === CellType.empty ? (foodPosition = [x, y]) : getFoodPosition()
	}

	getFoodPosition()

	const insertFood = () => {
		const [x, y] = foodPosition
		board[y][x] = CellType.food
	}

	const moveInput = <T extends boolean>({ e, key }: HandleDirectionProps<T>) => {
		const direction = {
			up: key ? 'ArrowUp' : 'top',
			down: key ? 'ArrowDown' : 'bottom',
			left: key ? 'ArrowLeft' : 'left',
			right: key ? 'ArrowRight' : 'right',
		} as const

		switch (key ? e.key : e.detail.direction) {
			case direction.up:
				if (snakeDirection[0][0] !== Direction.down && snakeDirection[0][0] !== Direction.up) {
					snakeDirection.push([Direction.up, false])
				}
				break
			case direction.down:
				if (snakeDirection[0][0] !== Direction.up && snakeDirection[0][0] !== Direction.down) {
					snakeDirection.push([Direction.down, false])
				}
				break
			case direction.left:
				if (snakeDirection[0][0] !== Direction.right && snakeDirection[0][0] !== Direction.left) {
					snakeDirection.push([Direction.left, false])
				}
				break
			case direction.right:
				if (snakeDirection[0][0] !== Direction.left && snakeDirection[0][0] !== Direction.right) {
					snakeDirection.push([Direction.right, false])
				}
				break
		}
		snakeDirection = snakeDirection
	}

	const move = () => {
		const [headX, headY] = snakeBody[snakeBody.length - 1]
		let newHead: [number, number]
		if (snakeDirection.length > 1 && snakeDirection[0][1]) snakeDirection.shift()
		switch (snakeDirection[0][0]) {
			case Direction.up:
				if (headY === 0) {
					lost()
					return
				}
				newHead = [headX, headY - 1]
				break
			case Direction.down:
				if (headY === $gameDificulty - 1) {
					lost()
					return
				}
				newHead = [headX, headY + 1]
				break
			case Direction.left:
				if (headX === 0) {
					lost()
					return
				}
				newHead = [headX - 1, headY]
				break
			case Direction.right:
				if (headX === $gameDificulty - 1) {
					lost()
					return
				}
				newHead = [headX + 1, headY]
				break
		}
		snakeDirection[0][1] = true
		snakeDirection = snakeDirection
		if (board[newHead[1]][newHead[0]] === CellType.body) {
			lost()
			return
		}
		snakeBody.push(newHead)
		if (board[newHead[1]][newHead[0]] === CellType.food) {
			if (snakeBody.length === $gameDificulty ** 2) {
				won()
				return
			}
			getFoodPosition()
			snakeSpeed *= 0.99
			return
		}
		snakeBody.shift()
		snakeBody = snakeBody
	}

	const render = () => {
		board = createBoard($gameDificulty)
		insertFood()
		insertSnake()
	}

	$: {
		clearInterval(interval)
		interval = setInterval(() => {
			if ($gameStatus !== GameStatus.playing) return
			render()
			move()
		}, snakeSpeed)
	}
</script>

<svelte:body use:swipe on:swipe={(e) => moveInput({ e, key: false })} on:keydown={(e) => moveInput({ e, key: true })} />

<div style:--size={$gameDificulty}>
	{#each board as row, i (i)}
		{#each row as cell, j (j)}
			<Cell type={cell} />
		{/each}
	{/each}
</div>

<style>
	div {
		display: grid;
		place-content: center;
		height: 100vh;
		background-color: #2c3e50;
		gap: 0.5rem;
		grid: repeat(var(--size), 1rem) / repeat(var(--size), 1rem);
	}
</style>
