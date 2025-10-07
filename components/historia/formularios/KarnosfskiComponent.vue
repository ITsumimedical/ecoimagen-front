<template>
  <div>
    <v-form>
      <v-col cols="12" sm="12" md="12">
        <v-alert class="text-center" dense text type="info" icon="mdi-book-open-page-variant">
          <b>ESCALA DE VALORACIÓN FUNCIONAL: ÍNDICE DE KARNOFSKI:
          </b></v-alert>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-radio-group v-model="valor_scala_karnofski" color="primary">
              <v-radio color="primary" v-for="opcion in opciones" :key="opcion.nombre" :label="opcion.nombre"
                :value="opcion.nombre"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
  export default {
    name: 'HorusHealthKarnosfskiComponent',
    props: ['datos', 'resumen'],
    data() {
      return {
        opciones: [{
            nombre: "Normal",
            valor: '100'
          },
          {
            nombre: "Actividades normales con síntomas leves de la enfermedad",
            valor: '90'
          },
          {
            nombre: "Actividad normal con esfuerzo, con algunos signos y síntomas de la enfermedad",
            valor: '80'
          },
          {
            nombre: "Capaz de cuidarse, pero incapaz de llevar a término actividades normales o trabajo activo",
            valor: '70'
          },
          {
            nombre: "Requiere atención ocasional, pero puede cuidarse a sí mismo",
            valor: '60'
          },
          {
            nombre: "Requiere gran atención incluso de tipo médico. En cama menos del 50% del día",
            valor: '50'
          },
          {
            nombre: "Inválido, incapacitado, necesita cuidados y atenciones especiales. En cama más del 50% del día",
            valor: '40'
          },
          {
            nombre: "Inválido grave, severamente incapacitado, tratamiento de soporte activo",
            valor: '30'
          },
          {
            nombre: "Todo el tiempo en cama, paciente muy grave, necesita hospitalización y tratamiento activo",
            valor: '20'
          },
          {
            nombre: "En agonía",
            valor: '10'
          },
          {
            nombre: "Fallecido",
            valor: '0'
          },

        ],
          valor_scala_karnofski: {},

      };
    },
    computed: {
      ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    created() {
        const datosKarnofski = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/KarnosfskiComponent');
        if (datosKarnofski) {
          this.valor_scala_karnofski = datosKarnofski?.valor_scala_karnofski || '';
        }
    },

    mounted() {
      // this.obtenerDatosKarnofski()
    },

    methods: {
      validarErrores() {
        return [];
      },

      obtenerDatosKarnofski() {
        this.$axios.get(`historia/obtenerDatosKarnofski/${this.datos.afiliado.id}`)
          .then(res => {
            Object.keys(res.data).forEach(key => {
              this.$set(this.karnofski, key, res.data[key]);
            });
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
            this.$toast.error('Error al cargar los datos de karnofski');
          });
      },
      obtenerDatos() {
                const data = {
                  valor_scala_karnofski: this.valor_scala_karnofski
                }
                return {
                    datos: data
                };
            },
    },
  };

</script>

<style lang="scss" scoped>

</style>
