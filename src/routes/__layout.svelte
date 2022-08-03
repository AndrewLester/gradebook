<script lang="ts">
import Header from '$lib/components/layout/Header.svelte';
import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<style>
main {
	min-height: calc(100vh - calc(var(--header-height) + var(--h1-padding)));
	max-width: 150ch;
	margin-inline: auto;
	padding-inline: clamp(5px, 1vw, 15px);
}
</style>
