<script>
import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
{#if $page.status === 404}
	<h2>Page not found</h2>
{:else}
	<h2>An error occured</h2>
{/if}
<p><a href="/">Return home</a></p>
