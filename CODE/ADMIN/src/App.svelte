<script>
    // -- IMPORTS

    import { Router, Link, Route } from 'svelte-routing';
    import HomePage from './lib/page/HomePage.svelte';
    import PropertiesPage from './lib/page/PropertiesPage.svelte';
    import PropertyPage from './lib/page/PropertyPage.svelte';

    export let url = "";
</script>

<Router { url }>
    <img class="logo" src="/admin/logo.png" alt="logo">
    <nav>
        <Link to="/admin">Home</Link>
        <Link to="/admin/properties">Properties</Link>
    </nav>
    <div>
        <Route path="/admin">
            <HomePage/>
        </Route>
        <Route path="/admin/properties">
            <PropertiesPage/>
        </Route>
        <Route path="/admin/property/:id" let:params>
            <PropertyPage id="{ params.id }"/>
        </Route>
    </div>
</Router>
