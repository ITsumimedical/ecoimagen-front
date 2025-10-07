<template>
  <div>
    <v-alert text dense color="blue" border="left" icon="mdi-account-group" class="text-center"><b>TRABAJO SOCIAL</b>
    </v-alert>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-pillar"><b>ESTRUCTURA Y
              DINÁMICA
              FAMILIAR</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-currency-usd"><b>SITUACIÓN
              SOCIO-ECONOMICA Y CONDICIONES DE LA VIVIENDA</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea label="Descripción" dense outlined auto-grow v-model="estructura.estructura_dinamica" :rules="CampoRequerido"></v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea label="Descripción" dense outlined auto-grow v-model="estructura.situacion_socioeconomica" :rules="CampoRequerido">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-social-distance-6-feet">
            <b>ENTORNO SOCIAL</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-close"><b>RIESGO
              PSICOSOCIAL</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea label="Descripción" dense outlined auto-grow v-model="estructura.entorno_social" :rules="CampoRequerido"></v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea label="Descripción" dense outlined auto-grow v-model="estructura.riesgo_psicosocial" :rules="CampoRequerido"></v-textarea>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
  export default {
    props: ['datos'],
    data() {
      return {
        valid: true,
        estructura: {
          estructura_dinamica: '',
          situacion_socioeconomica: '',
          entorno_social: '',
          riesgo_psicosocial: '',
          consulta_id: this.datos.id,
        },
        loading: false,
        CampoRequerido: [
        v => !!v || 'Este campo es requerido',
      ],
      }
    },

    mounted() {
    const estructura = this.obtenerDatosPorConsulta(this.datos.id, 'estructuraDinamica/Model/EstructuraDinamicaFamiliar', 'historia/formularios/estructuraDinamicaFamiliar');
        if (estructura) {
            this.estructura = { ...estructura }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    methods: {
        obtenerDatos() {
                return {
                    datos: this.estructura
                };
            },

    //   guardarDatos() {
    //     if(!this.$refs.form.validate()){
    //       return this.$toast.error('campos requeridos sin diligenciar')
    //     }
    //     this.loading = true,
    //     this.$axios.post('estructuraDinamica/crear', this.estructura).then(() => {
    //       this.$toast.success('Creado con exito')
    //     }).catch(() => {
    //       console.log(error)
    //     }).finally(() => {
    //       this.loading = false
    //     })
    //   }
    }
  }

</script>
