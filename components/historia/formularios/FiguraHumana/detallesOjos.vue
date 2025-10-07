<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-eye-check-outline"><b>Detalles de los ojos</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Presencia de cejas, pestañas o ambas.
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ojos.cejas" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2.Presencia de pupilas.
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ojos.pupilas" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>3.Ojos proporcionados (más horizontales
          que verticales).
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ojos.proporcionados" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>4.Mirada dirigida al frente en los dibujos
          de perfil.
        </strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ojos.mirada" row @change="actualizarDatos">
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
      ojos: {
        cejas: '',
        pupilas: '',
        proporcionados: '',
        mirada: '',
      },
      row: null,
    };
  },
  computed: {
    total() {
      return Number(this.ojos.cejas) + Number(this.ojos.pupilas) + Number(this.ojos.proporcionados) + Number(this.ojos.mirada);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.total);
    },
  },
};
</script>
