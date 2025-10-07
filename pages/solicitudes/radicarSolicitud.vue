<template>
  <div>
    <v-row>
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Procesando Información
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-col cols="12" sm="12" md="12">
        <Radicacion  :panelBusqueda="true"/>
      </v-col>

    </v-row>

  </div>
</template>

<script>
import Radicacion from '@/components/solicitudes/radicar.vue'
  export default {
    name: 'WorkspaceJsonRadicarAutogestion',
    components: {
      Radicacion,
    },
    data() {
      return {
        preload: false,
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
