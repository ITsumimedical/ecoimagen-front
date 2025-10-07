<template>
  <div>
    <v-container>
      <v-alert text dense color="info" class="text-center" icon="mdi-human-male-male">
        <b>TEST DE LA FIGURA HUMANA </b>
      </v-alert>
      <v-col>
        <strong>Para la realización de este test debes realizar lo siguiente:
          Facilitale
          al niño una hoja de papel en blanco y un esfero o
          un lápiz para dibujar. En este caso, puede decirle
          al niño: “Mira esta(s) hoja(s). Dibuja una persona.
          Haz el dibujo más lindo que puedas hacer. Trabaja
          con mucho cuidado y emplea todo el tiempo que
          necesites. Hazlo con entusiasmo y verás que lindo
          dibujo haces”.
        </strong>
      </v-col>
      <v-col>
        <v-alert text dense color="warning" border="left" icon="mdi-human">
          <b>SEGMENTOS CORPORALES</b>
        </v-alert>
      </v-col>
      <v-stepper v-model="step" non-linear>
        <!-- Header del Stepper -->
        <v-stepper-header>
          <v-row dense>
            <v-stepper-step v-for="item in steps" :key="item.step" :editable="true" :step="item.step">
              {{ item.label }}
            </v-stepper-step>
            <v-divider v-for="(item, i) in steps.slice(0, -1)" :key="`divider-${i}`"></v-divider>
          </v-row>
        </v-stepper-header>

        <v-col></v-col>
        <v-col></v-col>
        <v-col></v-col>

        <v-stepper-items>
          <v-stepper-content v-for="item in steps" :key="'content-' + item.step" :step="item.step">
            <component :is="item.component" @update-data="actualizarDatos(item.step, $event)"></component>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <!-- <v-card-actions class="justify-center">
        <v-btn color="success" small @click="guardar()" :loading="loading">Guardar respuestas</v-btn>
      </v-card-actions> -->
    </v-container>
    <v-alert v-if="mostrarEdadMental" dense text color="warning" icon="mdi-information-variant-circle-outline">
      <b>La edad mental del niño es: {{ edadMentalTexto }}</b>
    </v-alert>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
  import general from "@/components/historia/formularios/FiguraHumana/general.vue";
  import tronco from "@/components/historia/formularios/FiguraHumana/tronco.vue";
  import brazos_piernas from "@/components/historia/formularios/FiguraHumana/brazosPiernas.vue";
  import cuello from "@/components/historia/formularios/FiguraHumana/cuello.vue";
  import cara from "@/components/historia/formularios/FiguraHumana/cara.vue";
  import cabello from "@/components/historia/formularios/FiguraHumana/cabello.vue";
  import ropas from "@/components/historia/formularios/FiguraHumana/ropas.vue";
  import dedos from "@/components/historia/formularios/FiguraHumana/dedos.vue";
  import articulaciones from "@/components/historia/formularios/FiguraHumana/articulaciones.vue";
  import proporciones from "@/components/historia/formularios/FiguraHumana/proporciones.vue";
  import coordinacion from "@/components/historia/formularios/FiguraHumana/coordinacionMotora.vue";
  import ojos from "@/components/historia/formularios/FiguraHumana/detallesOjos.vue";
  import menton from "@/components/historia/formularios/FiguraHumana/menton.vue";
  import perfil from "@/components/historia/formularios/FiguraHumana/perfil.vue";

  export default {
    components: {
      general,
      tronco,
      brazos_piernas,
      cuello,
      cara,
      cabello,
      ropas,
      dedos,
      articulaciones,
      proporciones,
      coordinacion,
      ojos,
      menton,
      perfil,
    },
    props: ['datos'],
    data() {
      return {
        step: 1,
        mostrarEdadMental: false,
        edadMentalTexto: "",
        loading: false,
        steps: [{
            step: 1,
            label: "General",
            component: "general"
          },
          {
            step: 2,
            label: "Tronco",
            component: "tronco"
          },
          {
            step: 3,
            label: "Brazos y piernas",
            component: "brazos_piernas"
          },
          {
            step: 4,
            label: "Cuello",
            component: "cuello"
          },
          {
            step: 5,
            label: "Cara",
            component: "cara"
          },
          {
            step: 6,
            label: "Cabello",
            component: "cabello"
          },
          {
            step: 7,
            label: "Ropas",
            component: "ropas"
          },
          {
            step: 8,
            label: "Dedos",
            component: "dedos"
          },
          {
            step: 9,
            label: "Articulaciones",
            component: "articulaciones"
          },
          {
            step: 10,
            label: "Proporciones",
            component: "proporciones"
          },
          {
            step: 11,
            label: "Coordinación motora",
            component: "coordinacion"
          },
          {
            step: 12,
            label: "Detalles de los ojos",
            component: "ojos"
          },
          {
            step: 13,
            label: "Mentón",
            component: "menton"
          },
          {
            step: 14,
            label: "Perfil",
            component: "perfil"
          },
        ],
        respuestas: {
          general: null,
          tronco: null,
          brazos_piernas: null,
          cuello: null,
          cara: null,
          cabello: null,
          ropas: null,
          dedos: null,
          articulaciones: null,
          proporciones: null,
          coordinacion: null,
          ojos: null,
          menton: null,
          perfil: null,
        },
      };
    },

    watch: {
        respuestas: {
            handler(newVal) {
                this.calcularEdadMental();
            },
            deep: true,
        }
    },

    mounted()
    {
        const datosFiguraHumana = this.obtenerDatosPorConsulta(this.datos.id, 'FiguraHumana/Model/FiguraHumana', 'historia/formularios/FiguraHumana/TestFiguraHumana');

        if (datosFiguraHumana) {
            this.respuestas = { ...datosFiguraHumana }
        } else {
            this.cargarDatos();
        }
    },

    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    methods: {
        obtenerDatos() {
            const data = {
                ...this.respuestas,
                interpretacion_resultados: this.edadMentalTexto,
            }
            return { datos: data };
        },

      actualizarDatos(step, data) {
        const key = this.steps.find(item => item.step === step) ?.component;
        if (key) {
          this.$set(this.respuestas, key, data);
        }
      },

      calcularEdadMental() {
        // Sumar todos los puntos de las respuestas
        const totalPuntos = Object.values(this.respuestas).reduce((acc, val) => acc + (val || 0), 0);

        // Calcular la edad mental
        const edadBasal = 3; // Edad basal de 3 años
        const añosAdicionales = Math.floor(totalPuntos / 4); // Cada 4 puntos = 1 año
        const mesesAdicionales = (totalPuntos % 4) * 3; // Cada punto restante = 3 meses

        const edadMental = edadBasal + añosAdicionales + (mesesAdicionales / 12);

        // Formatear la edad mental en años y meses
        const años = Math.floor(edadMental);
        const meses = Math.round((edadMental - años) * 12);

        // Mostrar el resultado en un console.alert
        this.edadMentalTexto = `${años} años y ${meses} meses.`;
        this.mostrarEdadMental = true;
      },


      cargarDatos() {
        this.$axios.get(`figuraHumana/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
          this.respuestas = {
            ...this.respuestas,
            ...res.data
          }
          this.calcularEdadMental()
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al cargar los datos');
        });
      },
    }
  };

</script>
