<template>
  <div>
    <v-alert text dense color="warning" border="left" class="text-center"><b>EDEMA O INFLAMACIÓN</b></v-alert>
    <v-col cols="12" sm="12" md="12">
      <v-autocomplete label="¿Presenta edema o inflamación?" dense outlined :items="opciones" v-model="edema.presente" @change="emitirDatos">
      </v-autocomplete>
    </v-col>
    <v-col cols="12" sm="12" md="12" v-if="edema.presente === 'Si'">
      <v-textarea label="Ubicación" hint="Describa la ubicación de la inflamación" dense outlined auto-grow v-model="edema.ubicacion" @change="emitirDatos"></v-textarea>
    </v-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      opciones: ['Si', 'No'],
      edema:{
        presente: '',
        ubicacion: ''
      }
    }
  },

  methods: {
      emitirDatos() {
        this.$emit('datos', this.edema);
      }
    }
}
</script>
