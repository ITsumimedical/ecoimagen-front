<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-tshirt-crew"><b>Ropas</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Presentes (de forma clara).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ropas.presente" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2. Dos prendas, no transparentes (ocultan las partes del cuerpo que deben cubrir)</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ropas.transparentes" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>3.Dibujo con mangas y pantalones
          no transparentes</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ropas.mangas" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>4.Cuatro prendas (por ejemplo,sombrero, zapatos, saco, camisa, cuello, corbata, cinturón, tirantas o
          pantalones).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ropas.cuatro" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>5.Vestimenta completa (sin
          incongruencias).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="ropas.vestimenta" row @change="actualizarDatos">
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
        ropas: {
          presente: '',
          transparentes: '',
          mangas: '',
          cuatro: '',
          vestimenta: ''
        },
        row: null,
      }
    },

    computed: {
      total() {
        return Number(this.ropas.presente) + Number(this.ropas.transparentes) + Number(this.ropas.mangas) + Number(this.ropas.cuatro) + Number(this.ropas.vestimenta);
      },
    },
    methods: {
      actualizarDatos() {
        this.$emit("update-data", this.total);
      },
    }
  }

</script>
