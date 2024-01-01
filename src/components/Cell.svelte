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

	let cellColor = $state<string>()

	$effect(() => {
		switch (type) {
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
	})
</script>

<span style:background-color={cellColor} />

<style>
	span {
		grid-area: span 1 / span 1;
	}
</style>
