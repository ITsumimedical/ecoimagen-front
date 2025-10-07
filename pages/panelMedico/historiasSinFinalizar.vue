<template>
  <div>
    <v-card elevation="0">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
              <span>Historias Clínicas No Finalizadas</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12" sm="12">
            <v-tabs v-model="tab" grow @change="onTabChange">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab key="consultasSinFinalizar"> Consultas Programadas </v-tab>
              <v-tab key="noProgramadasSinFinalizar">
                Consultas No Programadas
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item key="consultasSinFinalizar">
                <consultasSinFinalizar ref="consultasSinFinalizar" />
              </v-tab-item>
              <v-tab-item key="noProgramadasSinFinalizar">
                <noProgramadasSinFinalizar ref="noProgramadasSinFinalizar" />
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import noProgramadasSinFinalizar from "@/components/panelMedico/noProgramadasSinFinalizar.vue";
import consultasSinFinalizar from "@/components/panelMedico/consultasSinFinalizar.vue";

export default {
  name: "historiasSinFinalizar",
  components: {
    noProgramadasSinFinalizar,
    consultasSinFinalizar,
  },
  data() {
    return {
      tab: "consultasSinFinalizar",
    };
  },
  methods: {
    onTabChange(tab) {
      // `tab` es el índice del tab seleccionado (0, 1, 2...)
      switch (tab) {
        case 0: // Primer tab (Consultas Programadas)
          if (this.$refs.consultasSinFinalizar) {
            this.$refs.consultasSinFinalizar.listarConsultasSinFinalizar();
          }
          break;
        case 1: // Segundo tab (No Programadas Sin Finalizar)
          if (this.$refs.noProgramadasSinFinalizar) {
            this.$refs.noProgramadasSinFinalizar.listarNoProgramadasSinFinalizar();
          }
          break;
        default:
          console.log("Tab no encontrado");
          break;
      }
    },
  },
};
</script>
