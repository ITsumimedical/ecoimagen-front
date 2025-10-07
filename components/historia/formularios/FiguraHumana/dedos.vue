<template>
  <div>
    <v-alert text dense color="blue-grey" border="left" icon="mdi-hand-back-right-outline"><b>Dedos</b></v-alert>
    <strong>Puntúa entre 0 y 1 si el segmento corporal está presente</strong>
    <v-divider></v-divider>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>1.Presentes</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="dedos.presentes" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>2.Número correcto</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="dedos.numero" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>3.En dos dimensiones (más largos que anchos)</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="row" dedos.dimensiones @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>4.Pulgar en oposición</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="dedos.pulgar" row @change="actualizarDatos">
          <v-radio label="0" :value="0"></v-radio>
          <v-radio label="1" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row no-gutters align="center">
      <v-col cols="auto">
        <strong>5. Mano es distinta de los dedos y
          del brazo.</strong>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-radio-group v-model="dedos.mano" row @change="actualizarDatos">
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
      dedos: {
       presentes: '',
       numero: '',
       dimensiones: '',
       pulgar: '',
       mano: ''
      },
      row: null,
    };
  },
  computed: {
    total() {
      return Number(this.dedos.presentes) + Number(this.dedos.numero) + Number(this.dedos.dimensiones) + Number(this.dedos.pulgar) + Number(this.dedos.mano);
    },
  },
  methods: {
    actualizarDatos() {
      this.$emit("update-data", this.total);
    },
  },
};
</script>
