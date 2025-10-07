<template>
  <div>
    <v-card elevation="0">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
              <span>Gestión Externa - PQRF</span>
            </div>
          </v-toolbar-title>
          <!-- Separador visual entre el título y las pestañas -->
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-row class="mx-2">
            <v-col md="2" lg="2" xl="2" sm="2" cols>
              <v-tooltip bottom dense v-if="$can('pqrsf.importar')">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="success"
                    small
                    dark
                    @click="abrirModalCargueSuperSalud()"
                  >
                    Cargar SuperSalud
                    <v-icon right>mdi-cloud-upload</v-icon>
                  </v-btn>
                </template>
                <span>Cargar</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab" grow @change="onTabChange">
          <v-tabs-slider :color="sliderColor"></v-tabs-slider>

          <!-- Tab Pendientes (Rojo) -->
          <v-tab key="gestionExternaPendientes" class="pendientes-tab">
            <v-icon left class="text-red">mdi-account-alert</v-icon>
            <span class="text-red">Pendientes</span>
            <v-badge
              :content="totalPendientes"
              :color="'#FF5252'"
              class="ml-2 mt-3"
            ></v-badge>
          </v-tab>

          <!-- Tab Asignadas (Azul) -->
          <v-tab key="gestionExternaAsignadas" class="asignados-tab">
            <v-icon left class="text-blue">mdi-account-convert</v-icon>
            <span class="text-blue">Asignadas</span>
            <v-badge
              :content="totalAsignados"
              :color="'#2196F3'"
              class="ml-2 mt-3"
            ></v-badge>
          </v-tab>

          <!-- Tab Pre-Solucionadas (Amarillo) -->
          <v-tab
            key="gestionExternaPreSolucionadas"
            class="presolucionadas-tab"
          >
            <v-icon left class="text-yellow"
              >mdi-checkbox-marked-circle-plus-outline</v-icon
            >
            <span class="text-yellow">Pre-Solucionadas</span>
            <v-badge
              :content="totalPreSolucionadas"
              color="#FF9800"
              class="ml-2 mt-3"
            ></v-badge>
          </v-tab>

          <!-- Tab Solucionadas (Verde) -->
          <v-tab key="gestionExternaSolucionadas" class="solucionadas-tab">
            <v-icon left class="text-green">mdi-message-check-outline</v-icon>
            <span class="text-green">Solucionadas / Anuladas</span>
            <v-badge
              :content="totalSolucionadas"
              color="#4CAF50"
              class="ml-2 mt-3"
            ></v-badge>
          </v-tab>

          <v-tabs-items v-model="tab">
            <v-tab-item key="gestionExternaPendientes">
              <pendientesgestionExterna
                ref="gestionExternaPendientes"
                @actualizarConteo="actualizarContadorPendientes"
              />
            </v-tab-item>
            <v-tab-item key="gestionExternaAsignadas">
              <asignadosGestionExterna
                ref="gestionExternaAsignadas"
                @actualizarConteo="actualizarContadorAsignados"
              />
            </v-tab-item>
            <v-tab-item key="gestionExternaPreSolucionadas">
              <presolucionadosGestionExterna
                ref="gestionExternaPreSolucionadas"
                @actualizarConteo="actualizarContadorPreSolucionados"
              />
            </v-tab-item>
            <v-tab-item key="gestionExternaSolucionadas">
              <solucionadosGestionExterna
                ref="gestionExternaSolucionadas"
                @actualizarConteo="actualizarContadorSolucionados"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>

    <!-- Modal Cargue SuperSalud -->
    <modalCargueSuperSalud
      :mostrarModalCargueSuperSalud.sync="mostrarModalCargueSuperSalud"
      @recargarPQRFsPendientes="recargarPQRFsPendientes"
    />
  </div>
</template>
<script>
import pendientesgestionExterna from "~/pages/gestionPqrsf/gestionExterna/pendientesgestionExterna.vue";
import asignadosGestionExterna from "~/pages/gestionPqrsf/gestionExterna/asignadosGestionExterna.vue";
import presolucionadosGestionExterna from "~/pages/gestionPqrsf/gestionExterna/presolucionadosGestionExterna.vue";
import solucionadosGestionExterna from "~/pages/gestionPqrsf/gestionExterna/solucionadosGestionExterna.vue";
import modalCargueSuperSalud from "~/components/pqrsf/modalCargueSuperSalud.vue";

export default {
  components: {
    pendientesgestionExterna,
    asignadosGestionExterna,
    presolucionadosGestionExterna,
    solucionadosGestionExterna,
    modalCargueSuperSalud,
  },
  data() {
    return {
      tab: "gestionExternaPendientes",
      totalPendientes: "!",
      totalAsignados: "!",
      totalPreSolucionadas: "!",
      totalSolucionadas: "!",
      mostrarModalCargueSuperSalud: false,
    };
  },
  computed: {
    // Cambiar el color del slider basado en el tab activo
    sliderColor() {
      switch (this.tab) {
        case 0:
          return "#FF5252"; // Rojo para pendientes
        case 1:
          return "#2196F3"; // Azul para asignadas
        case 2:
          return "#FF9800"; // Amarillo para pre-solucionadas
        case 3:
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
        case 0: // Primer tab (Pendientes)
          if (this.$refs.gestionExternaPendientes) {
            this.$refs.gestionExternaPendientes.listarPQRSFPendientes();
          }
          break;
        case 1: // Segundo tab (Asignadas)
          if (this.$refs.gestionExternaAsignadas) {
            this.$refs.gestionExternaAsignadas.listarPQRSFAsignados();
          }
          break;
        case 2: // Tercer tab (Pre-Solucionadas)
          if (this.$refs.gestionExternaPreSolucionadas) {
            this.$refs.gestionExternaPreSolucionadas.listarPQRFPreSolucionados();
          }
          break;
        case 3: // Cuarto tab (Solucionadas)
          if (this.$refs.gestionExternaSolucionadas) {
            this.$refs.gestionExternaSolucionadas.listarPQRFSolucionadas();
          }
          break;
        default:
          console.log("Tab no encontrado");
          break;
      }
    },
    actualizarContadorPendientes(total) {
      this.totalPendientes = total.toString();
    },

    actualizarContadorAsignados(total) {
      this.totalAsignados = total.toString();
    },

    actualizarContadorPreSolucionados(total) {
      this.totalPreSolucionadas = total.toString();
    },

    actualizarContadorSolucionados(total) {
      this.totalSolucionadas = total.toString();
    },

    abrirModalCargueSuperSalud() {
      this.mostrarModalCargueSuperSalud = true;
    },

    recargarPQRFsPendientes() {
      this.$refs.gestionExternaPendientes.listarPQRSFPendientes();
    },
  },
};
</script>
<style scoped>
.pendientes-tab .v-icon,
.pendientes-tab span {
  color: #ff5252 !important;
}
.asignados-tab .v-icon,
.asignados-tab span {
  color: #2196f3 !important;
}
.presolucionadas-tab .v-icon,
.presolucionadas-tab span {
  color: #ff9800 !important;
}
.solucionadas-tab .v-icon,
.solucionadas-tab span {
  color: #4caf50 !important;
}
</style>
