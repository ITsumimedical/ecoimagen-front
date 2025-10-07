<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-social-distance-6-feet"><b>Articulaciones</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Presencia de codo, hombro o ambos.
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="articulaciones.codo" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2.Presencia de rodilla, cadera o ambas
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="articulaciones.rodilla" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      articulaciones: {
        codo: '',
        rodilla: '',
      },
      row: null,
    };
  },
  computed: {
    total() {
      return Number(this.articulaciones.codo) + Number(this.articulaciones.rodilla);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.total);
    },
  },
};
</script>
