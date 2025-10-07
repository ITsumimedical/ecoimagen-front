<template>
  <v-card>
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
            <span>Interoperabilidad - LOGS</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" sm="6" md="6">
          <v-card color="error">
            <v-card-text class="pa-0">
              <v-container class="pa-0">
                <div class="layout row ma-0">
                  <div class="sm4 xs4">
                    <div class="layout column ma-0 justify-center align-center">
                      <v-icon size="76px" color="white" style="opacity: 0.8">mdi-close-outline</v-icon>
                    </div>
                  </div>
                  <div class="layout column ma-0 justify-center" style="color: white">
                    <span class="caption">No Enviadas a Interoperabilidad</span>
                    <div class="headline">{{ contadorNoEnviados }}</div>
                    <span class="caption">Hasta la fecha</span>
                  </div>
                </div>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="6">
          <v-card color="warning">
            <v-card-text class="pa-0">
              <v-container class="pa-0">
                <div class="layout row ma-0">
                  <div class="sm4 xs4">
                    <div class="layout column ma-0 justify-center align-center">
                      <v-icon size="76px" color="white" style="opacity: 0.8">mdi-cloud-upload</v-icon>
                    </div>
                  </div>
                  <div class="layout column ma-0 justify-center" style="color: white">
                    <span class="caption">Canceladas Faltantes en Keiron</span>
                    <div class="headline">{{ contadorCanceladasNoEnviados }}</div>
                    <span class="caption">Hasta la fecha</span>
                  </div>
                </div>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="12" md="12">
          <v-tabs v-model="tab" grow show-arrows @change="cambiarTab">
            <v-tabs-slider color="primary" />
            <v-tab key="salientes">
              <span>Citas Interoperadas</span>
            </v-tab>
            <v-tab key="entrantes">
              <span>Citas No Interoperadas</span>
            </v-tab>
            <v-tab key="canceladas">
              <span>Citas Canceladas No Interoperadas</span>
            </v-tab>
            <v-tabs-items v-model="tab">
              <v-tab-item key="salientes">
                <v-col>
                  <InteroperabilidadSalienteComponent ref="salientes" />
                </v-col>
              </v-tab-item>
              <v-tab-item key="entrantes">
                <v-col>
                  <InteroperabilidadFaltanteComponent ref="entrantes" @total="actualizarContador" />
                </v-col>
              </v-tab-item>
              <v-tab-item key="canceladas">
                <v-col>
                  <InteroperabilidadCanceladaFaltante ref="canceladas" @canceladas="actualizarContadorCanceladas" />
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import InteroperabilidadSalienteComponent from "@/components/citas/interoperabilidad/InteroperabilidadSalienteComponent.vue";
import InteroperabilidadFaltanteComponent from "@/components/citas/interoperabilidad/InteroperabilidadFaltanteComponent.vue";
import InteroperabilidadCanceladaFaltante from "~/components/citas/interoperabilidad/InteroperabilidadCanceladaFaltante.vue";
import { mapActions } from "vuex";
export default {
  components: {
    InteroperabilidadSalienteComponent,
    InteroperabilidadFaltanteComponent,
    InteroperabilidadCanceladaFaltante
  },
  data() {
    return {
      tab: "salientes",
      contadorCanceladasNoEnviados: 0,
      contadorNoEnviados: 0,
    };
  },
  mounted() {
    this.contadores();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cambiarTab(tab) {
      switch (tab) {
        case 0:
          if (this.$refs.salientes) {
            this.$refs.salientes.listarLogs();
          }
          break;
        case 1:
          if (this.$refs.entrantes) {
            this.$refs.entrantes.listarLogs();
          }
          break;

        case 2:
          if (this.$refs.canceladas) {
            this.$refs.canceladas.listarLogs();
          }
          break;
      }
    },

    async contadores() {
      try {
        this.setPreload(true);
        const response = await this.$axios.get("citas/contador-faltantes-keiron");
        this.contadorNoEnviados = response.data.no_enviadas;
        this.contadorCanceladasNoEnviados = response.data.canceladas_no_enviadas;
      } catch (error) {
        this.$toast.error("error al contar los registros");
      } finally {
        this.setPreload(false);
      }
    },

    actualizarContador(total) {
      this.contadorNoEnviados = total;
    },

    actualizarContadorCanceladas(total) {
      this.contadorCanceladasNoEnviados = total;
    }
  },
};
</script>