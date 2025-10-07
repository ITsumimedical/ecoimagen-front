<template>
  <div>
    <v-card>
      <v-alert border="left" dense text type="info" icon="mdi-frequently-asked-questions">
        <b>Gestión de solicitudes</b>
      </v-alert>
      <v-tabs v-model="tab" grow>
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab key="solicitudesPendientes">
          PENDIENTES
        </v-tab>
        <v-tab key="solicitudesSolucionadas">
          SOLUCIONADAS
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item key="solicitudesPendientes">
          <solicitudesPendientes />
        </v-tab-item>
        <v-tab-item key="solicitudesSolucionadas">
          <solicitudesSolucionadas />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
  import solicitudesPendientes from '~/components/solicitudes/solicitudesPendientes.vue';
  import solicitudesSolucionadas from '~/components/solicitudes/solicitudesSolucionadas.vue';

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('solicitudes.menu')) {
        return redirect('/');
      }
    },
    components: {
      solicitudesPendientes,
      solicitudesSolucionadas
    },
    data() {
      return {
        tab: "solicitudesPendientes"
      }
    }
  }

</script>