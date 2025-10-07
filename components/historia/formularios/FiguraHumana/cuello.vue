<template>
  <div>
    <v-alert text dense color="blue-grey" border="left"><b>Cuello</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Presente.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cuello.presente" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2.Contorno del cuello continuo con
          la cabeza, el tronco o ambos.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cuello.contorno" row @change="actualizarDatos">
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
    cuello: {
      presente: '',
      contorno: ''
    },
    row: null,
    }
  },

  computed: {
    total() {
      return Number(this.cuello.presente) + Number(this.cuello.contorno);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.total);
    },
  }
}
</script>
