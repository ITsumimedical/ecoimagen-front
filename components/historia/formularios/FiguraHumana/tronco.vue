<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-human-male"><b>Tronco</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1. Presente (Lineal o bidimensional)</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="tronco.presente" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2. Más largo que ancho.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="tronco.largo" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>3. Presencia clara de hombros</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="tronco.presencia" row @change="actualizarDatos">
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
      tronco: {
        presente: '0',
        largo: '0',
        presencia: '0',
      },
      row: null,
    }
  },

  computed: {
    suma() {
      return Number(this.tronco.presente) + Number(this.tronco.largo) + Number(this.tronco.presencia);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.suma);
    },
  }
}
</script>
