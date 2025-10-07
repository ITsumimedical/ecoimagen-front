<template>
  <div>
    <v-alert text dense color="warning" border="left" class="text-center">
      <b>MARCHA
      </b>
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-autocomplete label="Conservada" dense  :items="opciones" outlined v-model="marcha.conservada" @change="emitirDatos"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-autocomplete label="Alterada" dense  :items="opciones" outlined v-model="marcha.alterada" @change="emitirDatos"></v-autocomplete>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      opciones: ['Si', 'No'],
      marcha: {
        conservada: '',
        alterada: ''
      }
    }
  },

  methods: {
      emitirDatos() {
        this.$emit('datos', this.marcha);
      }
    }
}
</script>
