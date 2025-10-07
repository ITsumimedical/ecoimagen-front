<template>
  <div>
    <v-container>
      <v-row>
        <v-col xs="12" sm="12" md="12">
          <v-alert prominent border="left" class="text-center" dense text  type="info" icon="mdi-medication">
            <b>ANTECEDENTES ODONTOLOGICOS</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field dense outlined type="date" label="Fecha ultima consulta odontología"
            v-model="odontologia.ultima_consulta_odontologo"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="12">
          <v-textarea dense outlined auto-grow label="Descripción ultima consulta"
            v-model="odontologia.descripcion_ultima_consulta"></v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense outlined label="Aplicación de fluor y sellantes:"
            v-model="odontologia.aplicacion_fluor_sellantes" :items="fluor"></v-autocomplete>
        </v-col>
        <v-col v-if="odontologia.aplicacion_fluor_sellantes == true" cols="12" sm="6" md="12">
          <v-textarea dense outlined label="Descripción aplicación de fluor y sellantes:"
            v-model="odontologia.descripcion_aplicacion_fl_sellante"></v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense outlined label="Exodoncias:" v-model="odontologia.exodoncias" :items="fluor">
          </v-autocomplete>
        </v-col>
        <v-col v-if="odontologia.exodoncias == true" cols="12" sm="6" md="12">
          <v-textarea dense outlined label="Descripción exodoncia:" v-model="odontologia.descripcion_exodoncia">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense outlined label="Traumas:" v-model="odontologia.traumas" :items="fluor">
          </v-autocomplete>
        </v-col>
        <v-col v-if="odontologia.traumas == true" cols="12" sm="6" md="12">
          <v-textarea dense outlined label="Descripción traumas:" v-model="odontologia.descripcion_trauma"></v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense outlined label="Aparatologia:" v-model="odontologia.aparatologia" :items="fluor">
          </v-autocomplete>
        </v-col>
        <v-col v-if="odontologia.aparatologia == true" cols="12" sm="6" md="12">
          <v-textarea dense outlined label="Descripción Aparatologia:" v-model="odontologia.descripcion_aparatologia">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense outlined label="biopsias:" v-model="odontologia.biopsias" :items="fluor">
          </v-autocomplete>
        </v-col>
        <v-col v-if="odontologia.biopsias == true" cols="12" sm="6" md="12">
          <v-textarea dense outlined label="Descripción biopsia:" v-model="odontologia.descripcion_biopsia">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense outlined label="Cirugias orales:" v-model="odontologia.cirugias_orales" :items="fluor">
          </v-autocomplete>
        </v-col>
        <v-col v-if="odontologia.cirugias_orales == true" cols="12" sm="6" md="12">
          <v-textarea dense outlined label="Descripción cirugia oral:" v-model="odontologia.descripcion_cirugia_oral">
          </v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {
    props: ['datos', 'resumen'],
    data() {
      return {
        odontologia: {
          ultima_consulta_odontologo: '',
          descripcion_ultima_consulta: '',
          aplicacion_fluor_sellantes: '',
          descripcion_aplicacion_fl_sellante: '',
          exodoncias: '',
          descripcion_exodoncia: '',
          traumas: '',
          descripcion_trauma: '',
          aparatologia: '',
          descripcion_aparatologia: '',
          biopsias: '',
          descripcion_biopsia: '',
          cirugias_orales: '',
          descripcion_cirugia_oral: ''
        },
        fluor: [
            {
                text: 'Si',
                value: true
            },
            {
                text: 'No',
                value: false
            }
        ]
      };
    },
    created() {
        const datosOdontologicos = this.obtenerDatosPorConsulta(this.datos.id, 'AntecedentesOdontologicos/Model/antecedentesOdontologicos', 'historia/formularios/antecedentesOdontologicos');

        if (datosOdontologicos) {
            this.odontologia = { ...datosOdontologicos }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {

        obtenerDatos() {
                return {
                    datos: this.odontologia
                };
            },



    }
  };

</script>
