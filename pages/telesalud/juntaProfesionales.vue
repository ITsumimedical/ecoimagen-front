<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
            <span>Junta Profesionales - Telesalud</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-tabs v-model="tab" @change="onTabChange" grow>
        <v-tabs-slider :color="sliderColor"></v-tabs-slider>

          <!-- Tab Pendientes (Rojo) -->
          <v-tab key="telesaludJuntaPendientes" class="pendientes-tab">
          <v-icon left class="text-red">mdi-account-alert</v-icon>
          <span class="text-red">Pendientes</span>
          <v-badge
            :content="totalTelesaludJuntaPendientes"
            :color="'#FF5252'"
            class="ml-2 mt-3"
          ></v-badge>
        </v-tab>

        <!-- Tab Solucionadas (Verde) -->
        <v-tab key="telesaludJuntaSolucionadas" class="solucionadas-tab">
          <v-icon left class="text-green">mdi-message-check-outline</v-icon>
          <span class="text-green">Solucionadas</span>
          <v-badge
            :content="totalTelesaludJuntaSolucionadas"
            :color="'#4CAF50'"
            class="ml-2 mt-3"
          ></v-badge>
        </v-tab>

        <v-tabs-items v-model="tab">
          <!-- Tab Pendientes -->
          <v-tab-item key="telesaludJuntaPendientes">
            <telesaludJuntaPendientes
              ref="telesaludJuntaPendientes"
              @actualizarConteo="actualizarContadorPendientes"
            />
          </v-tab-item>

          <!-- Tab Solucionadas -->
          <v-tab-item key="telesaludJuntaSolucionadas">
            <telesaludJuntaSolucionadas
              ref="telesaludJuntaSolucionadas"
              @actualizarConteo="actualizarContadorSolucionadas"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>
<script>
import telesaludJuntaPendientes from '~/components/telesalud/telesaludJuntaPendientes.vue';
import telesaludJuntaSolucionadas from '~/components/telesalud/telesaludJuntaSolucionadas.vue';

export default {
  middleware({
        $can,
        redirect
    }) {
        if (!$can('telesalud.juntaProfesionales')) {
            return redirect('/');
        }
    },
  components: {
    telesaludJuntaPendientes,
    telesaludJuntaSolucionadas
  },
  data() {
    return {
      tab: "telesaludJuntaPendientes",
      totalTelesaludJuntaPendientes: "!",
      totalTelesaludJuntaSolucionadas: "!",
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
    onTabChange(tab) {
      switch (tab) {
        case 0:
          if (this.$refs.telesaludJuntaPendientes) {
            this.$refs.telesaludJuntaPendientes.listarTelesaludJuntaPendientes();
          }
          break;
        case 1:
          if (this.$refs.telesaludJuntaSolucionadas) {
            this.$refs.telesaludJuntaSolucionadas.listarTelesaludJuntaSolucionadas();
        }
        default:
          break;
      }
    },

    actualizarContadorPendientes(total) {
      this.totalTelesaludJuntaPendientes = total.toString();
    },
    actualizarContadorSolucionadas(total) {
      this.totalTelesaludJuntaSolucionadas = total.toString();
    },
  },
}
</script>
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
