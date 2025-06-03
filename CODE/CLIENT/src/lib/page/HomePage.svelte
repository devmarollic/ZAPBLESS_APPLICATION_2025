<script>
    // -- IMPORTS

    import axios from 'axios';
    import { getLocalizedText } from 'senselogic-gist';
    import { onMount } from 'svelte';
    import { Link } from 'svelte-routing';

    // -- VARIABLES

    let favoritePropertyArray = [];
    let isLoading = true;
    let whatsapp = null;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let response = await axios.post( '/api/page/home' );
                favoritePropertyArray = response.data.favoritePropertyArray;
                whatsapp = response.data.whatsapp;
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

    .whatsapp-status
    {
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
    }

    .status-connected
    {
        background-color: #4CAF50;
        color: white;
    }

    .status-disconnected
    {
        background-color: #f44336;
        color: white;
    }

    .status-qrcode
    {
        background-color: #2196F3;
        color: white;
    }

    .status-opening
    {
        background-color: #FFC107;
        color: black;
    }
</style>

{#if isLoading }
    <div class="hourglass">Loading...</div>
{:else}
    <div>
        {#if whatsapp}
            <div class="whatsapp-status status-{whatsapp.status.toLowerCase()}">
                WhatsApp Status: {whatsapp.status}
                {#if whatsapp.status === 'qrcode'}
                    <img src={whatsapp.qrcode} alt="QR Code" />
                {/if}
            </div>
        {/if}
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
