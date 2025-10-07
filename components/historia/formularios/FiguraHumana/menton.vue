<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-eye-check-outline"><b>Mentón</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Presente, al igual que representación
          de la frente.
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="menton.presente" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2. Proyección (separación de la barbilla y el mentón).
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="menton.proyeccion" row @change="actualizarDatos">
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
      menton: {
        presente: '',
        proyeccion: '',
      },
      row: null,
    };
  },
  computed: {
    total() {
      return Number(this.menton.presente) + Number(this.menton.proyeccion);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.total);
    },
  },
};
</script>
