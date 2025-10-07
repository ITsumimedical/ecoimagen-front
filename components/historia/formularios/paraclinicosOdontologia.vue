<template>
  <div>
    <v-col xs="12" sm="12" md="12">
      <v-alert border="left" class="text-center" dense text type="info" icon="mdi-medication">
        <b>PARACLÍNICOS</b>
      </v-alert>
    </v-col>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Laboratorio" auto-grow v-model="paraclinico_odontologia.laboratorio" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Lectura radiografica" hint="Describa si el paciente posee una lectura radiografica"
            auto-grow v-model="paraclinico_odontologia.lectura_radiografica" outlined dense>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea label="Otros" hint="Agregue una descripción que considere necesaria" auto-grow
            v-model="paraclinico_odontologia.otros" outlined dense>
          </v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {
    props: ['datos'],

    data() {
      return {
        loading: false,
        paraclinico_odontologia: {
          laboratorio: '',
          lectura_radiografica: '',
          otros: '',
        }
      }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    created() {
        const paraclinicos = this.obtenerDatosPorConsulta(this.datos.id, 'ParaclinicosOdontologia/Model/paraclinicosOdontologia', 'historia/formularios/paraclinicosOdontologia');

        if (paraclinicos) {
            this.paraclinico_odontologia = { ...paraclinicos }
        }
    },
    methods: {

        obtenerDatos() {
                return {
                    datos: this.paraclinico_odontologia
                };
            },
    }
  }

</script>
