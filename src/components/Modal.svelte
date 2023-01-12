<script lang="ts">
	import { fade } from 'svelte/transition'
	import { GameDificulty, gameDificulty, GameStatus, gameStatus } from '../routes/+page.svelte'

	let message: string
	$: switch ($gameStatus) {
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
</script>

<div transition:fade class="overlay">
	{#key $gameStatus}
		<div transition:fade class="modal">
			<h2 class="primary">{message}</h2>
			{#if $gameStatus === GameStatus.choosing}
				<div class="selector">
					<button
						class:secondary={$gameDificulty !== GameDificulty.easy}
						on:click={() => ($gameDificulty = GameDificulty.easy)}>Easy</button
					>
					<button
						class:secondary={$gameDificulty !== GameDificulty.medium}
						on:click={() => ($gameDificulty = GameDificulty.medium)}>Medium</button
					>
					<button
						class:secondary={$gameDificulty !== GameDificulty.hard}
						on:click={() => ($gameDificulty = GameDificulty.hard)}>Hard</button
					>
				</div>
				<button on:click={() => ($gameStatus = GameStatus.playing)}>Play</button>
			{:else}
				<button on:click={() => ($gameStatus = GameStatus.choosing)}>Change Dificulty</button>
				<button on:click={() => ($gameStatus = GameStatus.playing)}>Play again</button>
			{/if}
		</div>
	{/key}
</div>

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
