<template>
  <div>
    <v-card>
      <v-alert border="left" dense text type="info" icon="mdi-frequently-asked-questions">
        <b>Solicitudes Asignadas</b>
      </v-alert>
      <v-tabs v-model="tab" grow>
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab key="asignadasPendientes">
          PENDIENTES
        </v-tab>
        <v-tab key="asignadasSolucionadas">
          SOLUCIONADAS
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item key="asignadasPendientes">
          <solicitudesAsignadasPendientes />
        </v-tab-item>
        <v-tab-item key="asignadasSolucionadas">
          <solicitudesAsignadasSolucionadas />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
  import solicitudesAsignadasPendientes from '~/components/solicitudes/solicitudesAsignadasPendientes.vue';
  import solicitudesAsignadasSolucionadas from '~/components/solicitudes/solicitudesAsignadasSolucionadas.vue';

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
      solicitudesAsignadasPendientes,
      solicitudesAsignadasSolucionadas
    },
    data() {
      return {
        tab: "asignadasPendientes"
      }
    }
  }

</script>