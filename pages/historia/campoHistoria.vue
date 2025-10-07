<template>
  <div>
    <CamposHistoriaComponent/>
  </div>
</template>

<script>
import CamposHistoriaComponent from '~/components/historia/CamposHistoriaComponent.vue';
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
    CamposHistoriaComponent
  },



  }

</script>

<style>

</style>
