<template>
  <div>
    <v-alert text dense color="warning" border="left" class="text-center">
      <b>MOVILIDAD
        ARTICULAR</b>
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-autocomplete label="Conservada" dense outlined :items="opciones" v-model="movilidad.conservada" @change="emitirDatos"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-autocomplete label="Alterada" dense outlined :items="opciones" v-model="movilidad.alterada" @change="emitirDatos"></v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        opciones: ['Si', 'No'],
        movilidad:{
          conservada:'',
          alterada:''
        }
      }
    },
    methods: {
      emitirDatos() {
        this.$emit('datos', this.movilidad);
      }
    }
  }

</script>
