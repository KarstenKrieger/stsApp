<template>
  <div class="home">
    <MainView/>
  </div>
</template>

<script>
// @ is an alias to /src
import MainView from "../components/MainContent.vue";

export default {
  name: "HomeView",
  components: {
    MainView,
  },
};
</script>
