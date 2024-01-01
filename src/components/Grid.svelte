<script lang="ts">
	import { swipe } from 'svelte-gestures'
	import { game, GameStatus } from '../store.svelte'
	import Cell, { CellType } from './Cell.svelte'
	import { untrack } from 'svelte'

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
	] satisfies [number, number][]

	let snakeBody = $state(structuredClone(snakeInitialBody))
	let snakeSpeed = $state<number>(0)
	let snakeDirection = $state<[Direction, boolean][]>([[Direction.right, false]])
	let interval: number
	let foodPosition = $state<[number, number]>()

	$effect(() => {
		if (game.status !== GameStatus.playing) {
			snakeSpeed = 0
		} else {
			untrack(() => reset())
			snakeSpeed = 200
		}
	})

	$effect(() => {
		if (game.dificulty) untrack(() => reset())
	})

	const createBoard = (size: number) =>
		Array.from({ length: size }).map(() => Array.from({ length: size }).map(() => CellType.empty))

	let board = $state(createBoard(game.dificulty))

	const reset = () => {
		snakeDirection = [[Direction.right, false]]
		clearInterval(interval)
		board = createBoard(game.dificulty)
		snakeBody = structuredClone(snakeInitialBody)
		getFoodPosition()
	}

	const lost = () => {
		game.status = GameStatus.lost
		render()
	}

	const won = () => {
		game.status = GameStatus.won
		render()
	}

	const insertSnake = () => {
		snakeBody.forEach(([x, y], i) => {
			const isHead = i === snakeBody.length - 1
			const boardRow = board[y]
			if (boardRow) boardRow[x] = isHead ? CellType.head : CellType.body
		})
	}

	const getFoodPosition = () => {
		const [x, y] = [~~(Math.random() * game.dificulty), ~~(Math.random() * game.dificulty)]

		const boardRow = board[y]
		if (boardRow) boardRow[x] === CellType.empty ? (foodPosition = [x, y]) : getFoodPosition()
	}

	getFoodPosition()

	const insertFood = () => {
		const [x, y] = foodPosition || [0, 0]
		const boardRow = board[y]
		if (boardRow) boardRow[x] = CellType.food
	}

	const moveInput = <T extends boolean>({ e, key }: HandleDirectionProps<T>) => {
		const direction = {
			up: key ? 'ArrowUp' : 'top',
			down: key ? 'ArrowDown' : 'bottom',
			left: key ? 'ArrowLeft' : 'left',
			right: key ? 'ArrowRight' : 'right',
		} as const

		const snakeDirectionRow = snakeDirection[0]
		if (!snakeDirectionRow) return

		switch (key ? e.key : e.detail.direction) {
			case direction.up:
				if (snakeDirectionRow[0] !== Direction.down && snakeDirectionRow[0] !== Direction.up)
					snakeDirection.push([Direction.up, false])
				break
			case direction.down:
				if (snakeDirectionRow[0] !== Direction.up && snakeDirectionRow[0] !== Direction.down)
					snakeDirection.push([Direction.down, false])
				break
			case direction.left:
				if (snakeDirectionRow[0] !== Direction.right && snakeDirectionRow[0] !== Direction.left)
					snakeDirection.push([Direction.left, false])
				break
			case direction.right:
				if (snakeDirectionRow[0] !== Direction.left && snakeDirectionRow[0] !== Direction.right)
					snakeDirection.push([Direction.right, false])
				break
		}
	}

	const move = () => {
		const [headX, headY] = snakeBody[snakeBody.length - 1] || [0, 0]
		let newHead: [number, number]
		if (snakeDirection.length > 1 && snakeDirection[0] && snakeDirection[0][1]) {
			snakeDirection.shift()
		}
		let snakeDirectionRow = snakeDirection[0]
		if (!snakeDirectionRow) return
		switch (snakeDirectionRow[0]) {
			case Direction.up:
				if (headY === 0) {
					lost()
					return
				}
				newHead = [headX, headY - 1]
				break
			case Direction.down:
				if (headY === game.dificulty - 1) {
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
				if (headX === game.dificulty - 1) {
					lost()
					return
				}
				newHead = [headX + 1, headY]
				break
		}
		snakeDirectionRow[1] = true
		snakeDirection = snakeDirection
		const boardRow = board[newHead[1]]
		if (!boardRow) return
		if (boardRow[newHead[0]] === CellType.body) {
			lost()
			return
		}
		snakeBody.push(newHead)
		if (boardRow[newHead[0]] === CellType.food) {
			if (snakeBody.length === game.dificulty ** 2) {
				won()
				return
			}
			getFoodPosition()
			snakeSpeed *= 0.99
			return
		}
		snakeBody.shift()
	}

	const render = () => {
		board = createBoard(game.dificulty)
		insertFood()
		insertSnake()
	}

	$effect(() => {
		untrack(() => {
			clearInterval(interval)
		})
		interval = setInterval(() => {
			if (game.status !== GameStatus.playing) return
			render()
			move()
		}, snakeSpeed)
	})
</script>

<svelte:body use:swipe onswipe={(e) => moveInput({ e, key: false })} onkeydown={(e) => moveInput({ e, key: true })} />

<section style:--size={game.dificulty}>
	{#each board as row}
		{#each row as cell}
			<Cell type={cell} />
		{/each}
	{/each}
</section>

<style>
	section {
		display: grid;
		place-content: center;
		gap: 0.5rem;
		grid: repeat(var(--size), calc(40vmin / var(--size))) / repeat(var(--size), calc(40vmin / var(--size)));
	}
</style>
