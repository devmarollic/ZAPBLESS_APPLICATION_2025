<script>
    // -- IMPORTS

    import axios from 'axios';
    import { getLocalizedText } from 'senselogic-gist';
    import { onMount } from 'svelte';
    import { Link } from 'svelte-routing';

    // -- VARIABLES

    let favoritePropertyArray = [];
    let isLoading = true;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let response = await axios.post( '/api/page/home' );
                favoritePropertyArray = response.data.favoritePropertyArray;
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

    .property
    {
    }
</style>

{#if isLoading }
    <div class="hourglass">Loading...</div>
{:else}
    <div>
        <h1>Favorite Properties</h1>
        {#each favoritePropertyArray as property }
            <Link to={ '/property/' + property.id }>
                <div class="property">
                    <p>{ getLocalizedText( property.title ) }</p>
                </div>
            </Link>
        {/each}
        <Link to="/properties">See more</Link>
    </div>
{/if}
