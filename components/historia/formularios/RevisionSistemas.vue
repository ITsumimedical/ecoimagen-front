<template>
    <div>
        <v-form>
          <v-col cols="12" sm="12" md="12">
              <v-alert class="text-center" dense text type="info" icon="mdi-stethoscope" border="left">
                <b>REVISIÓN POR SISTEMAS</b></v-alert>
                <v-row dense>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea outlined auto-grow label="Descripción" hint="Escriba aqui la descripción de la revision por sistemas que se ha realizado"
                     v-model="revisionSistemaHC.descripcion_revision_sistemas"></v-textarea>
                  </v-col>
                  <v-container fluid class="d-flex flex-wrap">
                    <v-checkbox label="Sintomatico respiratorio" class="mx-4" v-model="revisionSistemaHC.sintomatico_respiratorio"></v-checkbox>
                    <v-checkbox label="Sintomatico de piel" class="mx-4" v-model="revisionSistemaHC.sintomatico_piel"></v-checkbox>
                  </v-container>
                  <!-- <v-col cols="12" md="12" sm="12" v-show="datos.cita.especialidad.nombre === 'Control Prenatal (30 Min)'">
                    <v-textarea label="Aspecto" outlined auto-grow v-model="revisionSistemaHC.observaciones_generales"></v-textarea>
                  </v-col>
                    <v-col cols="12" md="3" sm="6">
                        <v-textarea label="Oftalmologico" outlined auto-grow v-model="revisionSistemaHC.oftalmologico"></v-textarea>
                    </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Otorrinoralingologico" outlined auto-grow v-model="revisionSistemaHC.otorrinoralingologico"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Linfatico" outlined auto-grow v-model="revisionSistemaHC.linfatico"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Endocrinologico" outlined auto-grow v-model="revisionSistemaHC.endocrinologico"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Cardiovascular" outlined auto-grow v-model="revisionSistemaHC.cardiovascular"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Respiratorio" outlined auto-grow v-model="revisionSistemaHC.respiratorio"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Gastrointestinal" outlined auto-grow v-model="revisionSistemaHC.gastrointestinal"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Genitourinario" outlined auto-grow v-model="revisionSistemaHC.genitourinario"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Osteomuscular" outlined auto-grow v-model="revisionSistemaHC.osteomioarticular"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Tegumentario" outlined auto-grow v-model="revisionSistemaHC.tegumentario"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Sistema nervioso" outlined auto-grow v-model="revisionSistemaHC.neurologico"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="3" sm="6">
                    <v-textarea label="Otro" outlined auto-grow v-model="revisionSistemaHC.no_refiere"></v-textarea>
                  </v-col> -->
                </v-row>
          </v-col>
        </v-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
        name: "RevisionSistemas",
        props: ['datos','resumen'],
        data() {
            return {
                preloadHistoria: false,
                revisionSistemaHC: {
                  descripcion_revision_sistemas: '',
                  sintomatico_respiratorio: false,
                  sintomatico_piel: false
                    // observaciones_generales: '',
                    // oftalmologico: '',
                    // genitourinario: '',
                    // otorrinoralingologico: '',
                    // linfatico: '',
                    // osteomioarticular: '',
                    // neurologico: '',
                    // cardiovascular: '',
                    // tegumentario: '',
                    // respiratorio: '',
                    // endocrinologico: '',
                    // gastrointestinal: '',
                    // no_refiere: '',
                },
            }
        },
        computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
        },
        created() {
        const revisionSistemas = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/RevisionSistemas');

            if (revisionSistemas) {
                this.revisionSistemaHC = { ...revisionSistemas }
            }
        },
        methods: {
            obtenerDatos() {
                const data = {
                    descripcion_revision_sistemas: this.revisionSistemaHC.descripcion_revision_sistemas,
                    sintomatico_respiratorio: this.revisionSistemaHC.sintomatico_respiratorio,
                    sintomatico_piel: this.revisionSistemaHC.sintomatico_piel,
                }
                return { datos: data };
            },
          validarErrores() {
              return [];
            },
        }
    }

</script>
