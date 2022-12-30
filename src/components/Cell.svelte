<script lang="ts" context="module">
	export enum CellType {
		empty,
		food,
		body,
		head,
	}
</script>

<script lang="ts">
	export let type: CellType
	let cellColor: string
	$: switch (type) {
		case CellType.empty:
			cellColor = '#64748b'
			break
		case CellType.food:
			cellColor = '#f97316'
			break
		case CellType.body:
			cellColor = '#1e293b'
			break
		case CellType.head:
			cellColor = '#ef4444'
			break
	}
</script>

<div style:--cellColor={cellColor} />

<style>
	div {
		grid-area: span 1 / span 1;
		background-color: var(--cellColor);
	}
</style>
