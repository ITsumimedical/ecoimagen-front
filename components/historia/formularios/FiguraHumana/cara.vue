<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-face-man"><b>Cara</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Presencia de ojos</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cara.ojos" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2.Presencia de nariz.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cara.nariz" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>3.Presencia de boca</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cara.boca" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>4.Presencia de nariz y boca en dos
          dimensiones (labios indicados).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cara.labios" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>


    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>5.Presencia de fosas nasales.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cara.fosas" row @change="actualizarDatos">
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
      cara: {
       ojos: '',
       nariz: '',
       boca: '',
       labios: '',
       fosas: ''
      },
      row: null,
    }
  },

  computed: {
    suma() {
      return Number(this.cara.ojos) + Number(this.cara.nariz) + Number(this.cara.boca) + Number(this.cara.labios) + Number(this.cara.fosas);;
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.suma);
    },
  }
}
</script>
