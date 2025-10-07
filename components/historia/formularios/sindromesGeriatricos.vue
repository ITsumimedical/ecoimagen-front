<template>
  <div>
    <v-col cols="12" sm="12" md="12">
      <v-alert text dense icon="mdi-human-cane" color="info" class="text-center">
        <b>SINDROME GERIATRICO</b>
      </v-alert>
    </v-col>

    <v-row dense>
      <v-col>
        <v-switch dense :items="opciones" label="Deterioro cognoscitivo" v-model="sindrome.deterioro_cognoscitivo"></v-switch>
      </v-col>

      <v-col>
        <v-switch dense :items="opciones" label="Inmovilidad" v-model="sindrome.inmovilidad"></v-switch>
      </v-col>

      <v-col>
        <v-switch dense :items="opciones" label="Inestabilidad y caídas" v-model="sindrome.inestabilidad_caidas"></v-switch>
      </v-col>

      <v-col>
        <v-switch dense :items="opciones" label="Fragilidad" v-model="sindrome.fragilidad"></v-switch>
      </v-col>

      <v-col>
        <v-switch dense :items="opciones" label="Incontinencia de esfínteres" v-model="sindrome.incontinencia_esfinteres"></v-switch>
      </v-col>

      <v-col>
        <v-switch dense :items="opciones" label="Depresión" v-model="sindrome.depresion"></v-switch>
      </v-col>

      <v-col>
        <v-switch dense :items="opciones" label="Iatrogenia medicamentosa" v-model="sindrome.iatrogenia_medicamentosa"></v-switch>
      </v-col>

      <v-col>
        <v-card-actions class="justify-center">
          <v-btn color="success" small @click="crearSindrome()" :loading="loading" :disabled="loading">Guardar</v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    props: ['datos'],
    data() {
      return {
        opciones: ['Si', 'No'],
        loading: false,
        sindrome: {
          deterioro_cognoscitivo: false,
          inmovilidad: false,
          inestabilidad_caidas: false,
          fragilidad: false,
          incontinencia_esfinteres: false,
          depresion: false,
          iatrogenia_medicamentosa: false,
        }
      };
    },
    methods: {
      convertirValor(valor) {
        return valor ? 'Si' : 'No';
      },

      crearSindrome() {
        this.loading = true;
        const data = {
          deterioro_cognoscitivo: this.convertirValor(this.sindrome.deterioro_cognoscitivo),
          inmovilidad: this.convertirValor(this.sindrome.inmovilidad),
          inestabilidad_caidas: this.convertirValor(this.sindrome.inestabilidad_caidas),
          fragilidad: this.convertirValor(this.sindrome.fragilidad),
          incontinencia_esfinteres: this.convertirValor(this.sindrome.incontinencia_esfinteres),
          depresion: this.convertirValor(this.sindrome.depresion),
          iatrogenia_medicamentosa: this.convertirValor(this.sindrome.iatrogenia_medicamentosa),
          consulta_id: this.datos.id
        };

        this.$axios.post('sindromesGeriatricos/crearSindrome', data).then(res => {
          this.loading = false;
          this.$toast.success('Se ha registrado el sindrome con éxito');
        }).catch(error => {
          this.loading = false;
          this.$toast.error('Error al registrar el sindrome');
          console.log(error);
        });
      }
    }
  }
</script>
