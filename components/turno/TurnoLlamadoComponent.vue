<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="3">
          <v-select color="blue" @change="getTurnos()" v-model="area_clinica_id" :items="areas" item-text="nombre"
            item-value="id" label="Area" solo></v-select>
        </v-col>
        <v-col cols="6">
          <h1 class="text-center">SALA DE ESPERA</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <h1 class="text-center">PACIENTE</h1>
        </v-col>
        <v-col cols="6">
          <h1 class="text-center">CONSULTORIO</h1>
        </v-col>
      </v-row>
      <v-row v-for="turno in turnos" :key="turno.id">
        <v-col cols="6">
          <v-card outlined elevation="8" color="boton" class="white--text">
            <v-card-title>{{ turno.tipo_turno.prefijo }} - {{ turno.codigo }} /
              {{ turno.nombre_completo ?? turno.tipo_turno.prefijo + '-' +turno.codigo }}</v-card-title>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card outlined elevation="8" color="boton" class="white--text">
            <v-card-title>{{ turno.taquilla.nombre }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-row>
    </v-row>
  </div>
</template>
<script>
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },

    data() {
      return {
        turnos: [],
        areas: [],
        area_clinica_id: 1,
        colors: 'blue',
      }
    },

    mounted() {
      this.getTurnos()
      this.getAreas()
    },

    methods: {

      async getTurnos() {
        try {
          const response = await this.$axios.get(`/turno?estado_id=28&area_clinica_id=${this.area_clinica_id}`);
          this.turnos = response.data.data
          console.log(response.data)
        } catch (error) {
          console.log(error.response)
          console.log(error)
        }
      },

      async getAreas() {
        try {
          const response = await this.$axios.get('/area-clinica')
          this.areas = response.data
        } catch (error) {
          console.log(error)
        }
      },

    }

  }

</script>
<style>

</style>
