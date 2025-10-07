<template>
    <div>
        <v-row v-show="!([1, 12, 13, 6, 7, 20, 23, 32, 35].includes(datos.cita.tipo_historia_id))" dense>
            <v-col xs="12" sm="12" md="12"
                v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica' && datos.cita.nombre !== 'Consulta   Individual De Riesgo Cardiovascular (30 Min)'">
                <v-alert class="text-center" dense text border="left" type="info" icon="mdi-ear-hearing">
                    <b>Valoración salud auditiva y
                        comunicativa</b></v-alert>
            </v-col>
            <v-container fluid>
                <v-row dense>
                    <v-col xs="12" sm="6" md="4">
                        <v-text-field dense v-model="examenF.funciones"
                            label="Funciones de la articulación, voz y habla:">
                        </v-text-field>
                    </v-col>
                    <v-col xs="12" sm="6" md="4">
                        <v-text-field dense v-model="examenF.desempenio_comunicativo" label="Desempeño comunicativo:">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-show="datos.cita.tipo_historia_id == 6">
                        <v-text-field dense label="Tamizaje auditivo neonatal"
                            v-model="examenF.tamizaje_auditivo_neonatal">
                        </v-text-field>
                    </v-col>
                    <v-col xs="12" sm="6" md="12">
                        <v-text-field dense v-model="examenF.factores_oido"
                            label="lista de chequeo de factores de riesgo de las enfermedades del oído, alteraciones auditivas, vestibulares y de la comunicación:">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-row>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: "ValoracionAuditiva",
    props: ['datos', 'resumen'],

    data() {
        return {
            examenF: {
                funciones: null,
                desempenio_comunicativo: null,
                factores_oido: null,
                resultado_vale: null,
            },
        }
    },
    mounted() {
    const datosValoracionAuditiva = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/ValoracionAuditiva');

    if (datosValoracionAuditiva) {
      this.examenF = { ...datosValoracionAuditiva }
    }
  },
  computed: {
    ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
  },
    methods: {
        obtenerDatos() {
            return {
                ...this.examenF,
                datos: this.examenF
            };
        }
    }
}

</script>