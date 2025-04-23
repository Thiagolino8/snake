<script lang="ts">
	import { game, GameStatus } from '../store.svelte'
	import Cell, { CellType } from './Cell.svelte'
	import { untrack } from 'svelte'

	const Direction = {
		up: 'up',
		down: 'down',
		left: 'left',
		right: 'right',
	} as const
	type Direction = (typeof Direction)[keyof typeof Direction]

	const snakeInitialBody = [
		[0, 0],
		[1, 0],
		[2, 0],
	] satisfies [number, number][]

	let snakeBody = $state(snakeInitialBody)
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
		Array.from({ length: size }, () => Array.from({ length: size }, () => CellType.empty))

	let board = $state(createBoard(game.dificulty))

	const reset = () => {
		snakeDirection = [[Direction.right, false]]
		clearInterval(interval)
		board = createBoard(game.dificulty)
		snakeBody = snakeInitialBody
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

	const insertFood = () => {
		const [x, y] = foodPosition || [0, 0]
		const boardRow = board[y]
		if (boardRow) boardRow[x] = CellType.food
	}

	const translateTouch = (e: TouchEvent) => {
		const x = e.touches[0]?.clientX
		const y = e.touches[0]?.clientY
		const screenWidth = window.innerWidth
		const screenHeight = window.innerHeight

		if (!x || !y) return

		const column = Math.ceil((x / screenWidth) * 3)
		const row = Math.ceil((y / screenHeight) * 3)

		if (row === 1 && column === 2) return Direction.up

		if (row === 2 && column === 1) return Direction.left
		if (row === 2 && column === 3) return Direction.right

		if (row === 3 && column === 2) return Direction.down
		return
	}

	const translateKeydown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowUp':
				return Direction.up
			case 'ArrowDown':
				return Direction.down
			case 'ArrowLeft':
				return Direction.left
			case 'ArrowRight':
				return Direction.right
		}
		return
	}

	const moveInput = (direction?: Direction) => {
		const snakeDirectionRow = snakeDirection[0]
		if (!snakeDirectionRow) return

		switch (direction) {
			case Direction.up:
				if (snakeDirectionRow[0] !== Direction.down && snakeDirectionRow[0] !== Direction.up)
					snakeDirection.push([Direction.up, false])
				break
			case Direction.down:
				if (snakeDirectionRow[0] !== Direction.up && snakeDirectionRow[0] !== Direction.down)
					snakeDirection.push([Direction.down, false])
				break
			case Direction.left:
				if (snakeDirectionRow[0] !== Direction.right && snakeDirectionRow[0] !== Direction.left)
					snakeDirection.push([Direction.left, false])
				break
			case Direction.right:
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
					return lost()
				}
				newHead = [headX, headY - 1]
				break
			case Direction.down:
				if (headY === game.dificulty - 1) {
					return lost()
				}
				newHead = [headX, headY + 1]
				break
			case Direction.left:
				if (headX === 0) {
					return lost()
				}
				newHead = [headX - 1, headY]
				break
			case Direction.right:
				if (headX === game.dificulty - 1) {
					return lost()
				}
				newHead = [headX + 1, headY]
				break
		}
		snakeDirectionRow[1] = true
		snakeDirection = snakeDirection
		const boardRow = board[newHead[1]]
		if (!boardRow) return
		if (boardRow[newHead[0]] === CellType.body) {
			return lost()
		}
		snakeBody.push(newHead)
		if (boardRow[newHead[0]] === CellType.food) {
			if (snakeBody.length === game.dificulty ** 2) {
				return won()
			}
			getFoodPosition()
			return (snakeSpeed = ~~(snakeSpeed * 0.99))
		}
		snakeBody.shift()
	}

	const render = () => {
		board = createBoard(game.dificulty)
		insertFood()
		insertSnake()
	}

	$effect.pre(() => {
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

<svelte:body ontouchstart={(e) => moveInput(translateTouch(e))} onkeydown={(e) => moveInput(translateKeydown(e))} />

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
