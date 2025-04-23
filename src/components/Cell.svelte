<script lang="ts" module>
	export const CellType = {
		empty: 'empty',
		food: 'food',
		body: 'body',
		head: 'head',
	} as const
	export type CellType = (typeof CellType)[keyof typeof CellType]
</script>

<script lang="ts">
	let { type }: { type: CellType } = $props()

	const cellColors = {
		[CellType.empty]: '#64748b',
		[CellType.food]: '#f97316',
		[CellType.body]: '#1e293b',
		[CellType.head]: '#ef4444',
	}

	let cellColor = $derived(cellColors[type])
</script>

<span style:background-color={cellColor}></span>

<style>
	span {
		grid-area: span 1 / span 1;
	}
</style>
