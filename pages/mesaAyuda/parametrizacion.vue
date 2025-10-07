<template>
  <div>
    <v-card>
	<v-alert text dense border="left" type="info" :icon="false" class="text-center"><b>MÓDULO DE PARAMETRIZACIÓN MESA DE AYUDA</b></v-alert>
      <v-tabs next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows grow>
        <v-tab>
          Áreas
          <!-- areas -->
        </v-tab>
        <v-tab>
          Categorías
          <!-- categorias -->
        </v-tab>
        <!-- <v-tab>
          Prioridades
        </v-tab> -->
        <!-- Tab de prioridades -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <AreaMesaAyudaComponent></AreaMesaAyudaComponent>
              <!-- <CategoriaComponent></CategoriaComponent> -->
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- Tab de prioridades -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <CategoriaComponent></CategoriaComponent>
              <!-- <PrioridadComponent></PrioridadComponent> -->
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- Tab de control de solicitudes -->
        <!-- <v-tab-item>
          <v-card flat>
            <v-card-text>
              <PrioridadComponent></PrioridadComponent>
            </v-card-text>
          </v-card>
        </v-tab-item> -->
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
  import PrioridadComponent from "../../components/mesaAyuda/parametrizacion/PrioridadesComponent.vue";
  import CategoriaComponent from "../../components/mesaAyuda/parametrizacion/CategoriasComponent.vue";
  import ControlSolicitudesComponent from "../../components/mesaAyuda/parametrizacion/ControlSolicitudesComponent.vue";
  import AreaMesaAyudaComponent from "../../components/mesaAyuda/parametrizacion/AreaMesaAyuda.vue";

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'FrontHorusParametrizacion',
    components: {
      PrioridadComponent,
      CategoriaComponent,
      ControlSolicitudesComponent,
      AreaMesaAyudaComponent
    },
    data() {
      return {

      };
    },

    mounted() {

    },

    methods: {

    },
  };

</script>

<style lang="scss" scoped>

</style>
