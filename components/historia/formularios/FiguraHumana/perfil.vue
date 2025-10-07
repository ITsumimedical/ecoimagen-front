<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-face-woman"><b>Perfil</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Cabeza, tronco y pies con no más de un error (no se debe observar contorno a través del brazo, muslo oculto por el perfil no debe verse, brazos deben estar unidos al borde de la espalda y extenderse hacia delante).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="perfil.error" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2. Correcto, sin transparencias ni errores.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="perfil.transparencia" row @change="actualizarDatos">
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
      perfil: {
        error: '',
        transparencia: '',
      },
      row: null,
    };
  },
  computed: {
    total() {
      return Number(this.perfil.error) + Number(this.perfil.transparencia);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.total);
    },
  },
};
</script>
