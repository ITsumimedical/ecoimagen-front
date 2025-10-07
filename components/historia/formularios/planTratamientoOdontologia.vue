<template>
  <div>
    <div>
      <Ordenamiento :consulta="consultaId" :dialog="modalOrdenamiento" :habilitarBoton="false"
        @respuestaComponente="respuestaComponente()" :afiliado="afiliado" />
    </div>
    <v-col xs="12" sm="12" md="12">
      <v-alert border="left" class="text-center" dense text type="info" icon="mdi-account-check">
        <b>PLAN TRATAMIENTO</b>
      </v-alert>
    </v-col>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Operatoria" auto-grow v-model="plan_tratamiento.operatoria" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Periodoncia" auto-grow v-model="plan_tratamiento.periodancia" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Endodoncia" auto-grow v-model="plan_tratamiento.endodoncia" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Cirugia oral" auto-grow v-model="plan_tratamiento.cirugia_oral" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Remision" auto-grow v-model="plan_tratamiento.remision" outlined dense>
          </v-textarea>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>PROMOCIÓN Y PREVENCIÓN</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Educacion en higiene oral" auto-grow v-model="plan_tratamiento.educacion_higiene_oral"
            outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Control de placa" auto-grow v-model="plan_tratamiento.control_de_placa" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Profilaxis" auto-grow v-model="plan_tratamiento.profilaxis" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Detrartraje" auto-grow v-model="plan_tratamiento.detrartraje" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Topicación barniz de fluor" auto-grow v-model="plan_tratamiento.topizacion_barniz_fluor"
            outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Sellantes" auto-grow v-model="plan_tratamiento.sellantes" outlined dense>
          </v-textarea>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>REMISION RIAS</b>
          </v-alert>
        </v-col>
        <v-col>
          <v-autocomplete label="Remisión" :items="rias" v-model="plan_tratamiento.remision_rias" outlined>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
  export default {
    props: ['datos', 'resumen', 'afiliado'],
    data() {
      return {
        loading: false,
        plan_tratamiento: {
          operatoria: '',
          periodancia: '',
          endodoncia: '',
          cirugia_oral: '',
          remision: '',
          educacion_higiene_oral: '',
          control_de_placa: '',
          profilaxis: '',
          detrartraje: '',
          topizacion_barniz_fluor: '',
          sellantes: '',
          remision_rias: ''
        },
        modalOrdenamiento: false,
        consultaId: null,
        rias: [
          'Primera Infancia',
          'Infancia',
          'Adolescencia',
          'Juventud, Adultez',
          'Adulto Mayor',
          'Materno-Perinata',
        ],
      }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    created() {
        const plan = this.obtenerDatosPorConsulta(this.datos.id, 'PlanTratamiento/Model/planTratamientoOdontologia', 'historia/formularios/planTratamientoOdontologia');

        if (plan) {
            this.plan_tratamiento = { ...plan }
        }
    },
    methods: {
      respuestaComponente() {
        this.consultaId = this.datos.id
        this.afiliado = this.afiliado
        this.modalOrdenamiento = false;
      },

      obtenerDatos() {
                return {
                    datos: this.plan_tratamiento
                };
            },
    }
  }

</script>
