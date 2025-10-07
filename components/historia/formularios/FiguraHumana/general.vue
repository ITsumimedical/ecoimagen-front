<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-human"><b>General</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>

    <!-- Cabeza -->
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1. Cabeza presente (toda forma que la represente)</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="general.cabeza" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <!-- Piernas -->
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2. Piernas presentes (número correcto)</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="general.piernas" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <!-- Brazos -->
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>3. Brazos presentes (Número correcto, no bastan los dedos)</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="general.brazos" row @change="actualizarDatos">
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
      general: {
        cabeza: '',
        piernas: '',
        brazos: '',
      },
      row: null,
    };
  },
  computed: {
    total() {
      return Number(this.general.cabeza) + Number(this.general.piernas) + Number(this.general.brazos);
    },
  },
  methods: {
    actualizarDatos() {
      // Emitir el estado actual de las respuestas
      this.$emit("update-data", this.total);
    },
  },
};
</script>
