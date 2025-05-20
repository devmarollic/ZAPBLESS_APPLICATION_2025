<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText } from 'senselogic-gist';
    import axios from 'axios';

    // -- EXPORTS

    export let id;

    // -- STATEMENTS

    let property;
    let isLoading = true;

    onMount(
        async () =>
        {
            try
            {
                let response = await axios.post( '/api/page/property/' + id );
                property = response.data.property;
            }
            catch ( error )
            {
                console.error( 'Error :', error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );
</script>

<style>
    .hourglass
    {
    }
</style>

{#if isLoading }
    <div class="hourglass">Loading...</div>
{:else}
    <div>
        <h1>{ getLocalizedText( property.title ) }</h1>
        <p>{ getLocalizedText( property.description ) }</p>
    </div>
{/if}
