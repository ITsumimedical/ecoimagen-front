<template>
  <div>
    <v-form>
      <v-col cols="12" sm="12" md="12">
        <v-alert class="text-center" dense text type="info" icon="mdi-book-open-page-variant">
          <b>ESCALA DE VALORACIÓN FUNCIONAL ECOG: </b></v-alert>
        <v-row>
          <!-- <pre>{{ data }}</pre> -->
          <v-col cols="12" sm="12" md="12">
            <v-radio-group v-model="valor_scala_ecog" color="primary">
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
    name: "HorusHealthKarnosfskiComponent",
    props: ["datos", "resumen"],
    data() {
      return {
        opciones: [{
            nombre: "El paciente se encuentra totalmente asintomático y es capaz de realizar un trabajo y actividades normales de la vida diaria.",
            valor: "0",
          },
          {
            nombre: "El paciente presenta síntomas que le impiden realizar trabajos arduos, aunque se desempeña normalmente en sus actividades cotidianas y en trabajos ligeros. El paciente sólo permanece en la cama durante las horas de sueño nocturno.",
            valor: "1",
          },
          {
            nombre: "El paciente no es capaz de desempeñar ningún trabajo, se encuentra con síntomas que le obligan a permanecer en la cama durante varias horas al día, además de las de la noche, pero que no superan el 50% del día. El individuo satisface la mayoría de sus necesidades personales solo.",
            valor: "2",
          },
          {
            nombre: "El paciente necesita estar encamado más de la mitad del día por la presencia de síntomas. Necesita ayuda para la mayoría de las actividades de la vida diaria como por ejemplo el vestirse.",
            valor: "3",
          },
          {
            nombre: "El paciente permanece encamado el 100% del día y necesita ayuda para todas las actividades de la vida diaria, como por ejemplo la higiene corporal, la movilización en la cama e incluso la alimentación.",
            valor: "4",
          },
          {
            nombre: "Fallecido.",
            valor: "5",
          },
        ],
          valor_scala_ecog: null,
      };
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    created() {
        const datosEcog = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/EcogComponent');

        if (datosEcog) {
          this.valor_scala_ecog = datosEcog?.valor_scala_ecog || '';
        }
    },
    mounted() {
      // this.obtenerDatosEcog()
    },
    methods: {
      validarErrores() {
        return [];
      },

      obtenerDatosEcog() {
        this.$axios
          .get(`historia/obtenerdatosEcog/${this.datos.afiliado.id}`)
          .then(res => {
            Object.keys(res.data).forEach(key => {
              this.$set(this.ecog, key, res.data[key]);
            });
          })
          .catch((error) => {
            console.error("Error al obtener los datos:", error);
            this.$toast.error("Error al cargar los datos del ecog");
          });
      },
      obtenerDatos() {
        const data = {
          valor_scala_ecog: this.valor_scala_ecog,
        }
                return {
                    datos: data
                };

            },
    },
  };

</script>

<style lang="scss" scoped></style>
