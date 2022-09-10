<script lang="ts">
type TagName = $$Generic<'button' | 'a'>;

export let as: TagName;
export let prefetch = true;

interface $$Props extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap[TagName]> {
	as: TagName;
	prefetch?: boolean;
}
</script>

{#if as === 'a' && prefetch}
	<!-- svelte-ignore a11y-missing-attribute -->
	<a {...$$restProps} data-sveltekit-pretch class="button"><slot /></a>
{:else}
	<button {...$$restProps} class="button"><slot /></button>
{/if}

<style>
.button {
	appearance: none;
	background-color: var(--primary);
	text-decoration: none;
	padding: 7.5px 15px;
	border-radius: var(--pill-radius);
	color: var(--text-color-dark);
	border: none;
	cursor: pointer;
}
</style>
