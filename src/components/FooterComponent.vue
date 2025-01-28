<template>
  <div class="fluid-container footer">
    STSApp STS-Finanzen • Version {{$version}}
  </div>
</template>
<style>
  .fluid-container.footer {
    position: fixed;
    width:100%;
    height: 1em;
    padding: 4px;
    font-size: 12px;
    color: white;
    bottom: 0;
    font-weight: lighter;
    font-size:xx-small;
  }
    .fluid-container.footer > *:last-child {
      margin-bottom: 0px;
      color: #fff;
    }
</style>
