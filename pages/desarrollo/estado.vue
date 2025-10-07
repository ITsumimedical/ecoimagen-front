<template>
  <div>
      <EstadosComponente />
  </div>
</template>

<script>
import EstadosComponente from "~/components/desarrollo/estados/EstadosComponente.vue"
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('estados.vista')) {
        return redirect('/');
      }
    },
     components: {
     EstadosComponente
    },
    name: "WorkspaceJsonEstado",


    data() {
      return {

      };
    },

  };

</script>

