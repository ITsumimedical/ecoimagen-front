<template>
  <v-card>
    <v-card-title>
      <v-toolbar flat class="d-flex flex-wrap align-center">
        <v-toolbar-title class="d-flex align-center">
          <img src="/images/ojo.svg" alt="Gestión Sucesos Clínicos" height="50px" width="50px" />
          <span class="ml-2 font-weight-bold">Parametrización Gestión Sucesos</span>
        </v-toolbar-title>
      </v-toolbar>
    </v-card-title>
    <v-tabs grow next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows>
      <v-tab>
        Sucesos
      </v-tab>
      <v-tab>
        Clasificación áreas
      </v-tab>
      <v-tab>
        Tipos eventos
      </v-tab>
      <v-tab>
        Usuarios por defecto
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <SucesoComponente />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <ClasificacionAreaComponente />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <TipoEventoComponente />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <UsuariosPorSucesoComponente />
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
  import ClasificacionAreaComponente from '~/components/evento/ClasificacionAreaComponente.vue';
  import SucesoComponente from '~/components/evento/SucesoComponente.vue';
  import TipoEventoComponente from '~/components/evento/TipoEventoComponente.vue';
  import UsuariosPorSucesoComponente from '@/components/evento/UsuariosPorSucesoComponente.vue';
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
      ClasificacionAreaComponente,
      SucesoComponente,
      TipoEventoComponente,
      UsuariosPorSucesoComponente,
    },

    data() {
      return {

      };
    },
  };

</script>
