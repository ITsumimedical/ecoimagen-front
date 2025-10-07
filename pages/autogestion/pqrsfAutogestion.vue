<template>
  <div>
    <v-card elevation="0">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
              <span>PQRSF</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab" grow @change="onTabChanged">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab key="pqrsfAfiliado">MIS PQRF</v-tab>
          <v-tab key="formularioPqrsfAutogestion">NUEVA PQRF</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item key="pqrsfAfiliado" class="my-2 mx-2">
            <pqrsfAfiliado ref="pqrsfAfiliado" />
          </v-tab-item>
          <v-tab-item key="formularioPqrsfAutogestion" class="my-2 mx-2">
            <formularioPqrsfAutogestion ref="formularioPqrsfAutogestion" />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import pqrsfAfiliado from "@/components/pqrsf/pqrsfAfiliado.vue";
import formularioPqrsfAutogestion from "@/components/pqrsf/formularioPqrsfAutogestion.vue";

export default {
  components: {
    pqrsfAfiliado,
    formularioPqrsfAutogestion,
  },
  data() {
    return {
      tab: "pqrsfAfiliado",
    };
  },
  methods: {
    onTabChanged(tab) {
      switch (tab) {
        case 0:
          if (this.$refs.pqrsfAfiliado) {
            this.$refs.pqrsfAfiliado.listarPqrsfAfiliado();
          }
          break;
        case 1:
          if (this.$refs.formularioPqrsfAutogestion) {
            this.$refs.formularioPqrsfAutogestion.limpiarFormulario();
          }
          break;
      }
    },
  },
};
</script>
