<script lang="ts">
import Button from '../Button.svelte';
</script>

<header>
	<img src="" alt="logo" />
	<nav>
		<Button as="a" href="/">Home</Button>
		<Button as="a" href="/admin">Admin</Button>
	</nav>
</header>

<style>
header {
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: space-between;
	height: var(--header-height);
	/* background-color: var(--surface-lighter); */
	padding-inline: var(--section-padding);
}

nav {
	display: flex;
	flex-flow: row nowrap;
	gap: 10px;
}
</style>
