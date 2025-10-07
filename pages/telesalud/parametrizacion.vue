<template>
  <v-card>
    <v-tabs v-model="tab" centered icons-and-text>
      <v-tabs-slider></v-tabs-slider>
      <v-tab href="#tab-1">
        Tipo solicitud
        <v-icon>mdi-store-marker</v-icon>
      </v-tab>
      <v-tab href="#tab-2">
       Especialidades Telesalud
        <v-icon>mdi-store-marker</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <v-card flat>
          <TipoSolicitudComponent />
        </v-card>
      </v-tab-item>

      <v-tab-item value="tab-2">
        <v-card flat>
          <EspecialiadesTelesaludComponent />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import TipoSolicitudComponent from '@/components/telesalud/TipoSolicitudComponent.vue'
import EspecialiadesTelesaludComponent from '@/components/telesalud/EspecialiadesTelesaludComponent.vue'
export default {
  name: 'programasFarmacia',
  components: {
    TipoSolicitudComponent,
    EspecialiadesTelesaludComponent
  },
  data() {
    return {
      tab: null,
    };
  },
};
</script>
