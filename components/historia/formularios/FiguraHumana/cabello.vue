<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-face-woman"><b>Cabello</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Presente.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cabello.presente" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2.Presente y no excede la circunferencia del cráneo (mejor que un garabato), sin transparencia (el
          contorno del cráneo debe verse a través del cabello).</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="cabello.excede" row @change="actualizarDatos">
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
        cabello: {
          presente: '',
          excede: '',
        },
        row: null,
      }
    },

    computed: {
      total() {
        return Number(this.cabello.presente) + Number(this.cabello.excede);
      },
    },
    methods: {
      actualizarDatos() {
        this.$emit("update-data", this.total);
      },
    }
  }

</script>
