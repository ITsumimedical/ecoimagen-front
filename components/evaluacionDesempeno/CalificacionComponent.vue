<template>
  <div>
    <v-radio-group v-model="radio" row @change="guardarEvaluacion()">
      <v-radio label="1" :value="1"></v-radio>
      <v-radio label="2" :value="2"></v-radio>
      <v-radio label="3" :value="3"></v-radio>
      <v-radio label="4" :value="4"></v-radio>
      <v-radio label="5" :value="5"></v-radio>
    </v-radio-group>
  </div>

</template>

<script>
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonCalificacionComponent',

    data() {
      return {
        radio: null,
      };
    },
    props: [
      'th_competencia_id',
      'evaluaciones_desempeno_id',
    ],

    methods: {
      guardarEvaluacion() {
        const requets = {
          th_competencia_id: this.th_competencia_id,
          evaluaciones_desempeno_id: this.evaluaciones_desempeno_id,
          calificacion: this.radio
        }
        this.$axios.post('/calificacion-competencia/crear', requets).then(res => {
          this.$toast.success('competencia guardada con exito!.')
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },
    },
  };

</script>

<style lang="scss" scoped>

</style>
