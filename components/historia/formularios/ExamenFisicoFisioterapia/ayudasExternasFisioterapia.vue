<template>
  <div>
    <v-alert text dense color="warning" border="left" class="text-center">
      <b>AYUDAS EXTERNAS</b>
    </v-alert>

    <v-col cols="12" sm="12" md="12">
      <v-textarea label="Descripción" dense outlined v-model="ayudaExterna" @change="emitirDatos"></v-textarea>
    </v-col>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ayudaExterna: ''
      }
    },

    methods: {
      emitirDatos() {
        this.$emit('datos', this.ayudaExterna);
      }
    }
  }

</script>
