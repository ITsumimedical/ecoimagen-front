<template>
    <div>
        <v-col cols="12" sm="12" md="12"
            v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica' && !([1, 12, 13, 6, 7, 20, 23, 32].includes(datos.cita.tipo_historia_id))">
            <v-alert class="text-center" dense text border="left" type="info" icon="mdi-pistol">
                <b>Valoración psicosocial</b></v-alert>
        </v-col>
        <v-container fluid>
            <v-row dense
                v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica' && !([1, 12, 13, 6, 7, 20, 23, 32].includes(datos.cita.tipo_historia_id))">
                <v-col xs="12" sm="6" md="6">
                    <v-select dense v-model="examenF.violencia_mental" :items="sino" label="Violencia :">
                    </v-select>
                </v-col>
                <v-col xs="12" sm="6" md="6">
                    <v-select dense v-model="examenF.violencia_conflicto" :items="sino"
                        label="Violencia conflicto armado:">
                    </v-select>
                </v-col>
                <v-col xs="12" sm="6" md="6"
                    v-if="datos.afiliado.edad_cumplida >= 12 && datos.afiliado.edad_cumplida <= 50">
                    <v-select dense v-model="examenF.violencia_sexual" :items="sino" label="Violencia sexual:">
                    </v-select>
                </v-col>
                <v-col xs="12" sm="6" md="6"
                    v-if="datos.afiliado.edad_cumplida >= 12 && datos.afiliado.edad_cumplida <= 50">
                    <v-select dense v-model="examenF.lesiones_auto_inflingidas" :items="sino"
                        label="Lesiones autoinflingidas:">
                    </v-select>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "ValoracionPsicosocial",
    props: ['datos', 'resumen'],

    data() {
        return {
            examenF: {
                violencia_mental: null,
                violencia_conflicto: null,
                violencia_sexual: null,
                lesiones_auto_inflingidas: null,
            },
            sino: ['Si', 'No'],
        }
    },
    mounted() {
    const datosValoracionPsicosocial = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/ValoracionPsicosocial');

    if (datosValoracionPsicosocial) {
      this.examenF = { ...datosValoracionPsicosocial }
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