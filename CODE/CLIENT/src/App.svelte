<script>
    // -- IMPORTS

    import { Router, Link, Route } from 'svelte-routing';
    import HomePage from './lib/page/HomePage.svelte';
    import PropertiesPage from './lib/page/PropertiesPage.svelte';
    import PropertyPage from './lib/page/PropertyPage.svelte';

    export let url = "";
</script>

<Router { url }>
    <img class="logo" src="logo.png" alt="logo">
    <nav>
        <Link to="/">Home</Link>
        <Link to="/properties">Properties</Link>
    </nav>
    <div>
        <Route path="/">
            <HomePage/>
        </Route>
        <Route path="/properties">
            <PropertiesPage/>
        </Route>
        <Route path="/property/:id" let:params>
            <PropertyPage id="{ params.id }"/>
        </Route>
    </div>
</Router>
