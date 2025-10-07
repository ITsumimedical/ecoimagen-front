<template>
  <v-card>
    <v-alert dense text border="left" type="info" :icon="false">
      <b>MÓDULO DE PARAMETRIZACIÓN TIPOS DE CITAS</b>
    </v-alert>

        <v-card flat>
          <TipoCitaComponente />
        </v-card>
  </v-card>
</template>

<script>
  import TipoCitaComponente from '~/components/citas/tipoCitas/TipoCitaComponente.vue';

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('eventoAdverso.parametrizacion')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonParametrizacion',

    components: {
      TipoCitaComponente,
    },



    data() {
      return {

      };
    },
  };

</script>
