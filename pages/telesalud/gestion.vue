<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
            <span>Gestión - Telesalud</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-tabs v-model="tab" grow @change="onTabChanged">
        <v-tabs-slider :color="sliderColor"></v-tabs-slider>

        <!-- Tab Pendientes (Rojo) -->
        <v-tab key="telesaludPendientes" class="pendientes-tab">
          <v-icon left class="text-red">mdi-account-alert</v-icon>
          <span class="text-red">Pendientes</span>
          <v-badge
            :content="totalTelesaludPendientes"
            :color="'#FF5252'"
            class="ml-2 mt-3"
          ></v-badge>
        </v-tab>

        <!-- Tab Solucionadas (Verde) -->
        <v-tab key="telesaludSolucionadas" class="solucionadas-tab">
          <v-icon left class="text-green">mdi-message-check-outline</v-icon>
          <span class="text-green">Solucionadas</span>
          <v-badge
            :content="totalTelesaludSolucionadas"
            :color="'#4CAF50'"
            class="ml-2 mt-3"
          ></v-badge>
        </v-tab>

        <v-tabs-items v-model="tab">
          <!-- Tab Pendientes -->
          <v-tab-item key="telesaludPendientes">
            <telesaludPendientes
              ref="telesaludPendientes"
              @actualizarConteo="actualizarContadorPendientes"
            />
          </v-tab-item>

          <!-- Tab Solucionadas -->
          <v-tab-item key="telesaludSolucionadas">
            <telesaludSolucionadas
              ref="telesaludSolucionadas"
              @actualizarConteo="actualizarContadorSolucionadas"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>
<script>
import telesaludPendientes from "~/components/telesalud/telesaludPendientes.vue";
import telesaludSolucionadas from "~/components/telesalud/telesaludSolucionadas.vue";

export default {
  middleware({ $can, redirect }) {
    if (!$can("telesalud.gestion")) {
      return redirect("/");
    }
  },
  components: {
    telesaludPendientes,
    telesaludSolucionadas,
  },
  data() {
    return {
      tab: "telesaludPendientes",
      totalTelesaludPendientes: "!",
      totalTelesaludSolucionadas: "!",
    };
  },
  computed: {
    sliderColor() {
      switch (this.tab) {
        case 0:
          return "#FF5252"; // Rojo para pendientes
        case 1:
          return "#4CAF50"; // Verde para solucionadas
        default:
          return "primary"; // Color por defecto
      }
    },
  },
  methods: {
    onTabChanged(tab) {
      switch (tab) {
        // Pendientes
        case 0:
          if (this.$refs.telesaludPendientes) {
            this.$refs.telesaludPendientes.listarTelesaludPendientes();
          }
          break;
        // Solucionadas
        case 1:
          if (this.$refs.telesaludSolucionadas) {
            this.$refs.telesaludSolucionadas.listarTelesaludSolucionadas();
          }
          break;

        default:
          break;
      }
    },
    actualizarContadorPendientes(total) {
      this.totalTelesaludPendientes = total.toString();
    },
    actualizarContadorSolucionadas(total) {
      this.totalTelesaludSolucionadas = total.toString();
    },
  },
};
</script>

<style scoped>
.pendientes-tab .v-icon,
.pendientes-tab span {
  color: #ff5252 !important;
}

.solucionadas-tab .v-icon,
.solucionadas-tab span {
  color: #4caf50 !important;
}
</style>
