<script lang="ts">
	import { fade } from 'svelte/transition'
	import { GameDificulty, game, GameStatus } from '../store.svelte.ts'

	let message = $state<string>()

	$effect(() => {
		switch (game.status) {
			case GameStatus.playing:
				message = 'Lets Go!'
				break
			case GameStatus.lost:
				message = 'You lost'
				break
			case GameStatus.won:
				message = 'You won'
				break
			case GameStatus.choosing:
				message = 'Snake Game'
				break
		}
	})

	const show = (dialog: HTMLDialogElement) => {
		dialog?.showModal()
	}
</script>

{#if game.status !== GameStatus.playing}
	<dialog use:show transition:fade class="overlay">
		<section>
			<h2 class="primary">{message}</h2>
			<h4>Use the arrow keys on desktop or touch on the four quadrants of the screen on mobile</h4>
			{#if game.status === GameStatus.choosing}
				<div class="selector">
					<button
						class:secondary={game.dificulty !== GameDificulty.easy}
						onclick={() => (game.dificulty = GameDificulty.easy)}
					>
						Easy
					</button>
					<button
						class:secondary={game.dificulty !== GameDificulty.medium}
						onclick={() => (game.dificulty = GameDificulty.medium)}
					>
						Medium
					</button>
					<button
						class:secondary={game.dificulty !== GameDificulty.hard}
						onclick={() => (game.dificulty = GameDificulty.hard)}
					>
						Hard
					</button>
				</div>
				<button onclick={() => (game.status = GameStatus.playing)}>Play</button>
			{:else}
				<button onclick={() => (game.status = GameStatus.choosing)}>Change Dificulty</button>
				<button onclick={() => (game.status = GameStatus.playing)}>Play again</button>
			{/if}
		</section>
	</dialog>
{/if}

<style>
	h4,
	h2 {
		color: white;
		text-align: center;
	}
	.selector {
		display: flex;
		gap: 1rem;
	}

	dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		min-width: 0;
		min-height: 0;
		width: fit-content;
		height: fit-content;
		background-color: transparent;
		backdrop-filter: none;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(0.25rem);
	}

	section {
		grid-area: 1 / -1 / 1 / -1;
		display: grid;
		place-items: center;
		padding: 1rem;
		border-radius: 0.5rem;
		gap: 1rem;
	}
</style>
