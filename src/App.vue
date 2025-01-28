<template>
    <div id="app">
        <Navigation v-if="!$route.meta.hideNavigation" />
        <router-view />
        <Footer v-if="!$route.meta.hideNavigation" />
    </div>
</template>

<script>
    import Footer from './components/FooterComponent.vue'
    import Navigation from './components/NavigationComponent.vue'
    import router from './router'

    export default {
        name: 'App',
        components: {
            Footer,
            Navigation
        },
        mounted: function () {

            if (localStorage.getItem('token') == null && this.$route.meta.login) {
                router.push('login');
            }
        }
    }
</script>

<style>
    @import "../node_modules/@syncfusion/ej2-base/styles/material.css";
    @import "../node_modules/@syncfusion/ej2-layouts/styles/material.css";

    #app {
        font-family: 'Roboto', Univers, Arial, sans-serif;
        font-weight: bold;
    }

    body {
        background-color: #2A4B63;
        background-attachment: fixed;
        background-size: cover;
    }
</style>

