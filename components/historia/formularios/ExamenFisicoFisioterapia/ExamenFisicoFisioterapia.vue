<template>
  <div>
    <v-alert text dense color="info" border="left" class="text-center" icon="mdi-human"><b>EXAMEN FÍSICO</b></v-alert>
    <v-row>
      <v-col v-for="(component, index) in components" :key="index" :cols="component.cols" :sm="component.sm"
        :md="component.md">
        <component :is="component.name" v-model="examenDatos[component.key]" @datos="updateExamenDatos(component.key, $event)"></component>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import dolor from "@/components/historia/formularios/ExamenFisicoFisioterapia/dolorFisioterapia.vue";
  import edema from "@/components/historia/formularios/ExamenFisicoFisioterapia/EdemaInflamacion.vue";
  import sensibilidad from "@/components/historia/formularios/ExamenFisicoFisioterapia/sensibilidadFisioterapia.vue";
  import movilidad from "@/components/historia/formularios/ExamenFisicoFisioterapia/movilidadFisioterapia.vue";
  import fuerza from "@/components/historia/formularios/ExamenFisicoFisioterapia/fuerzaMuscularFisioterapia.vue";
  import equilibrio from "@/components/historia/formularios/ExamenFisicoFisioterapia/equilibrioFisioterapia.vue";
  import marchas from "@/components/historia/formularios/ExamenFisicoFisioterapia/marchasFisioterapia.vue";
  import ayudas from "@/components/historia/formularios/ExamenFisicoFisioterapia/ayudasExternasFisioterapia.vue";
  import { mapGetters } from 'vuex';

  export default {
    components: {
      dolor,
      edema,
      sensibilidad,
      movilidad,
      fuerza,
      equilibrio,
      marchas,
      ayudas,
    },
    props: ['datos'],
    data() {
      return {
        loading: false,
        components: [{
            name: "dolor",
            key: "dolor",
            cols: 12,
            sm: 6,
            md: 6
          },
          {
            name: "edema",
            key: "edema",
            cols: 12,
            sm: 6,
            md: 6
          },
          {
            name: "sensibilidad",
            key: "sensibilidad",
            cols: 12,
            sm: 6,
            md: 6
          },
          {
            name: "movilidad",
            key: "movilidad",
            cols: 12,
            sm: 6,
            md: 6
          },
          {
            name: "fuerza",
            key: "fuerza",
            cols: 12,
            sm: 12,
            md: 12
          },
          {
            name: "equilibrio",
            key: "equilibrio",
            cols: 12,
            sm: 6,
            md: 6
          },
          {
            name: "marchas",
            key: "marchas",
            cols: 12,
            sm: 6,
            md: 6
          },
          {
            name: "ayudas",
            key: "ayudas",
            cols: 12,
            sm: 12,
            md: 12
          },
        ],
        examenDatos: {
          dolor: {},
          edema: {},
          sensibilidad: {},
          movilidad: {},
          fuerza: {},
          equilibrio: {},
          marchas: {},
          ayudas: {},
          consulta_id: this.datos.id
        }
      };
    },
    mounted() {
    const datosConsulta = this.obtenerDatosPorConsulta(this.datos.id, 'ExamenFisicoFisioterapia/Model/ExamenFisicoFisioterapia', 'historia/formularios/ExamenFisicoFisioterapia/ExamenFisicoFisioterapia');
        if (datosConsulta) {
            this.examenDatos = { ...datosConsulta }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
      updateExamenDatos(key, value) {
        this.examenDatos[key] = value;
      },


    obtenerDatos() {
        const { dolor, edema, sensibilidad, movilidad, fuerza, equilibrio, marchas, ayudas, consulta_id } = this.examenDatos;
        return {
        datos: {
            dolor_presente: dolor.presente,
            frecuencia_dolo: dolor.frecuencia,
            intensidad_dolor: dolor.intensidad,

            edema_presente: edema.presente,
            ubicacion_edema: edema.ubicacion,

            sensibilidad_conservada: sensibilidad.conservada,
            sensibilidad_alterada: sensibilidad.alterada,
            ubicacion_sensibilidad: sensibilidad.ubicacion,

            fuerza_muscular: fuerza.rango,
            pruebas_semiologicas: fuerza.pruebas_semiologicas,

            equilibrio_conservado: equilibrio.conservada,
            equilibrio_alterado: equilibrio.alterada,

            marcha_conservada: marchas.conservada,
            marcha_alterada: marchas.alterada,

            ayudas_externas: ayudas,
            consulta_id: consulta_id
        }
        };
    }
    }
  };
</script>
