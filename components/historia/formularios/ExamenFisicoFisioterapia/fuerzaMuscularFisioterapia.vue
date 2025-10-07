<template>
  <div>
    <v-alert text dense color="warning" border="left" class="text-center">
      <b>FUERZA MUSCULAR Y PRUEBAS
        SEMIOLOGICAS
      </b>
    </v-alert>
    <v-col cols="12" sm="6" md="6" class="d-flex justify-center">
      <strong>Seleccione la fuerza muscular en una calificación de 0 a 5</strong>
    </v-col>
    <v-row>
    <v-col cols="12" sm="6" md="6">
      <v-slider v-model="fuerza.rango" thumb-label="always"  min="0" max="5"  tick-size="1" :color="color" @change="emitirDatos"></v-slider>
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <v-textarea label="Pruebas semiologicas" dense outlined auto-grow v-model="fuerza.pruebas_semiologicas" @change="emitirDatos"></v-textarea>
    </v-col>
  </v-row>


  </div>
</template>

<script>
export default {
  data() {
    return {
      fuerza: {
        rango: 0,
        pruebas_semiologicas: ''
      },
      color: 'blue-grey'
    }
  },

  methods: {
      emitirDatos() {
        this.$emit('datos', this.fuerza);
      }
    }
}
</script>
