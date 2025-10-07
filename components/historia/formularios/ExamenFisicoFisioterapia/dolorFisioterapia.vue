<template>
  <div>
    <v-alert color="warning" text dense border="left"><b>DOLOR</b></v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-autocomplete label="¿Presenta dolor?" dense outlined :items="opciones" v-model="dolor.presente"
          @change="emitirDatos"     :rules="rules"
          ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="6" v-if="dolor.presente === 'Si'">
        <v-autocomplete label="Frecuencia del dolor" dense outlined v-model="dolor.frecuencia" :items="frecuencias"
          @change="emitirDatos"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="12" md="12" v-if="dolor.presente === 'Si'">
        <strong>Seleccione la escala del dolor del 1 al 10 según lo que indique el paciente</strong>
        <v-slider v-model="dolor.intensidad" thumb-label="always" min="1" max="10" tick-size="1" :color="color"
          @change="emitirDatos"></v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    props: {
      rules: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        opciones: ['Si', 'No'],
        dolor: {
          presente: '',
          frecuencia: '',
          intensidad: 1,
        },
        color: '#546E7A',
        frecuencias: [
          'Cada hora',
          'Cada 3 horas',
          'Diariamente',
          'Cada dos dias',
          'Dos veces por semana',
          'Semanalmente',
          'Mensualmente',
          'Trisemestralmente',
          'Semestralmente',
          'Anualmente'
        ]
      };
    },
    methods: {
      emitirDatos() {
        this.$emit('datos', this.dolor);
      }
    }
  };

</script>
