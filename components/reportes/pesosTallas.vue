<template>
  <v-row dense style="width: 100%">
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        v-model="params.fechaInicial"
        label="Fecha Inicial"
        outlined
        dense
        type="date"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <v-text-field
        v-model="params.fechaFinal"
        label="Fecha Final"
        outlined
        dense
        type="date"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
  
  <script>
export default {
  data() {
    return {
      params: {
        fechaInicial: null,
        fechaFinal: null,
        estado: 1,
      },
    };
  },
  watch: {
    params: {
      handler(newVal) {
        this.$emit("update-params", newVal);
      },
      deep: true,
    },
  },
};
</script>
  