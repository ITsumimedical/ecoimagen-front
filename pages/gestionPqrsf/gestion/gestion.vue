<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
            <span>Gestión - PQRF</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-tabs v-model="tab" grow @change="onTabChange">
        <v-tabs-slider :color="sliderColor"></v-tabs-slider>

        <!-- Tab Asignadas (Azul) -->
        <v-tab key="gestionAsignadas" class="asignados-tab">
          <v-icon left class="text-blue">mdi-account-convert</v-icon>
          <span class="text-blue">Asignadas</span>
          <v-badge
            :content="totalAsignados"
            :color="'#2196F3'"
            class="ml-2 mt-3"
          ></v-badge>
        </v-tab>

        <!-- Tab Solucionadas (Verde) -->
        <v-tab key="gestionSolucionadas" class="solucionadas-tab">
          <v-icon left class="text-green">mdi-message-check-outline</v-icon>
          <span class="text-green">Solucionadas / Anuladas</span>
          <v-badge
            :content="totalSolucionadas"
            :color="'#4CAF50'"
            class="ml-2 mt-3"
          ></v-badge>
        </v-tab>

        <v-tabs-items v-model="tab">
          <v-tab-item key="gestionAsignadas">
            <asignadosGestion
              ref="gestionAsignadas"
              @actualizarConteo="actualizarContadorAsignados"
            />
          </v-tab-item>
          <v-tab-item key="gestionSolucionadas">
            <solucionadosGestion
              ref="gestionSolucionadas"
              @actualizarConteo="actualizarContadorSolucionados"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>
<script>
import asignadosGestion from "~/pages/gestionPqrsf/gestion/asignadosGestion.vue";
import solucionadosGestion from "~/pages/gestionPqrsf/gestion/solucionados.vue";

export default {
  components: {
    asignadosGestion,
    solucionadosGestion,
  },
  data() {
    return {
      tab: "gestionAsignadas",
      totalAsignados: "!",
      totalSolucionadas: "!",
    };
  },
  computed: {
    // Cambiar el color del slider basado en el tab activo
    sliderColor() {
      switch (this.tab) {
        case 0:
          return "#2196F3"; // Azul para asignadas
        case 1:
          return "#4CAF50"; // Verde para solucionadas
        default:
          return "primary"; // Color por defecto
      }
    },
  },
  methods: {
    onTabChange(tab) {
      // `tab` es el índice del tab seleccionado (0, 1, 2...)
      switch (tab) {
        case 0: // Primer tab (Asignadas)
          if (this.$refs.gestionAsignadas) {
            this.$refs.gestionAsignadas.listarPQRSFAsignados();
          }
          break;
        case 1: // Segundo tab (Solucionadas)
          if (this.$refs.gestionSolucionadas) {
            this.$refs.gestionSolucionadas.listarPQRFSolucionadas();
          }
          break;
        default:
          console.log("Tab no encontrado");
          break;
      }
    },
    actualizarContadorAsignados(total) {
      this.totalAsignados = total.toString();
    },

    actualizarContadorSolucionados(total) {
      this.totalSolucionadas = total.toString();
    },
  },
};
</script>
<style scoped>
.asignados-tab .v-icon,
.asignados-tab span {
  color: #2196f3 !important;
}

.solucionadas-tab .v-icon,
.solucionadas-tab span {
  color: #4caf50 !important;
}
</style>
