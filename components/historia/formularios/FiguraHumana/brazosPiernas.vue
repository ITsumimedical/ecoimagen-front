<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-hand-back-left"><b>Brazos y piernas</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Unidos al tronco (no pueden estar unidos entre sí o unidos de forma incompleta).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="extremidades.tronco" row @change="actualizarDatos">
          <v-radio label="0" :value="1"></v-radio>
          <v-radio label="1" :value="0"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2. Unidos en el punto correcto.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="extremidades.punto" row @change="actualizarDatos">
          <v-radio label="0" :value="1"></v-radio>
          <v-radio label="1" :value="0"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
     extremidades: {
      tronco: '',
      punto: ''
     },
     row: null,
    }
  },

  computed: {
    total() {
      return Number(this.extremidades.tronco) + Number(this.extremidades.punto);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.total);
    },
  }
}
</script>
