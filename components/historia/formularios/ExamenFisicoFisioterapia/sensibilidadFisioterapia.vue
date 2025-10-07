<template>
  <div>
    <v-alert text dense color="warning" border="left" class="text-center">
      <b>SENSIBILIDAD</b>
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-autocomplete label="¿Conservada?" dense outlined :items="opciones" v-model="sensibilidad.conservada" @change="emitirDatos"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-autocomplete label="Alterada?" dense outlined :items="opciones" @change="emitirDatos" v-model="sensibilidad.alterada"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-textarea label="Localización:" dense outlined auto-grow sensibilidad.localizacion @change="emitirDatos" v-model="sensibilidad.localizacion"></v-textarea>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        opciones: ['Si', 'No'],
        sensibilidad: {
          conservada: '',
          alterada: '',
          localizacion: ''
        }
      }
    },

    methods: {
      emitirDatos() {
        this.$emit('datos', this.sensibilidad);
      }
    }
  }

</script>
