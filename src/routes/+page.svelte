<script lang="ts" context="module">
	import { writable } from 'svelte/store'
	export enum GameStatus {
		playing,
		lost,
		won,
		choosing,
	}

	export enum GameDificulty {
		easy = 10,
		medium = 15,
		hard = 20,
	}

	export const gameDificulty = writable(GameDificulty.medium)
	export const gameStatus = writable(GameStatus.choosing)
</script>

<script lang="ts">
	import '@picocss/pico'
	import Grid from '../components/Grid.svelte'
	import Modal from '../components/Modal.svelte'
</script>

<Grid />

{#if $gameStatus !== GameStatus.playing}
	<Modal />
{/if}

<style>
	:global(body) {
		overscroll-behavior-y: contain;
	}
</style>
