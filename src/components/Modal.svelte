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
</script>
{#if game.status !== GameStatus.playing}
<div transition:fade class="overlay">
		{#key game.status}
			<div transition:fade class="modal">
				<h2 class="primary">{message}</h2>
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
			</div>
		{/key}
	</div>
{/if}

<style>
	.selector {
		display: flex;
		gap: 1rem;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		display: grid;
		place-items: center;
		grid: 1fr;
	}

	.modal {
		grid-area: 1 / -1 / 1 / -1;
		display: grid;
		place-items: center;
		padding: 1rem;
		border-radius: 0.5rem;
	}
</style>
