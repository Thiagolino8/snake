<script lang="ts" context="module">
	export const enum CellType {
		empty,
		food,
		body,
		head,
	}
</script>

<script lang="ts">
	let { type } = $props<{ type: CellType }>()

	const cellColors = {
		[CellType.empty]: '#64748b',
		[CellType.food]: '#f97316',
		[CellType.body]: '#1e293b',
		[CellType.head]: '#ef4444',
	}

	let cellColor = $derived(cellColors[type])
</script>

<span style:background-color={cellColor} />

<style>
	span {
		grid-area: span 1 / span 1;
	}
</style>
