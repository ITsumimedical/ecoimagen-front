<template>
  <div>
    <TipoCampoComponent/>
  </div>
</template>

<script>
import TipoCampoComponent from '~/components/historia/TipoCampoComponent.vue';
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: "WorkspaceJsonEspecialidades",
    components: {
    TipoCampoComponent
  },



  }

</script>

<style>

</style>
