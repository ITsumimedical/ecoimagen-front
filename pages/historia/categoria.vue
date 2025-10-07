<template>
  <div>
    <CategoriaHistoriaComponent/>
  </div>
</template>

<script>
import CategoriaHistoriaComponent from '~/components/historia/CategoriasHistoriaComponent.vue';
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
    CategoriaHistoriaComponent
  },



  }

</script>

<style>

</style>
