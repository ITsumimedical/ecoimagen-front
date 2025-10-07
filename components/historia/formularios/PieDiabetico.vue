<template>
    <div v-if="this.examenF.poseePieDiabetico === true">
        <v-col xs="12" sm="12" md="12">
            <v-alert class="text-center" dense text border="left" type="info" icon="mdi-hospital">
                <b>CLASIFICACIÓN PIE DIABÉTICO</b></v-alert>
        </v-col>
        <v-container>
            <v-row dense>
                <v-col cols="12" sm="6" md="6">
                    <v-autocomplete label="Grado" :items="grados" dense outlined :rules="campoRequerido"
                        v-model="grado">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3" md="6">
                    <v-autocomplete label="Presencia de: " :items="presencias" dense outlined :rules="campoRequerido"
                        v-model="presencia">
                    </v-autocomplete>
                </v-col>
            </v-row>
            <div v-if="clasificacionPieDiabetico">
                <span><strong>Estadio:{{ clasificacionPieDiabetico.estadio }}</strong></span> |
                <span><strong>{{ clasificacionPieDiabetico.grado }}</strong></span> |
                <span><strong>Descripción:</strong> {{ clasificacionPieDiabetico.descripcion }}</span>
            </div>
        </v-container>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
    name: "PieDiabetico",
    props: ['datos', 'resumen'],
    data() {
        return {
            poseePieDiabetico: this.examenF?.poseePieDiabetico,
            estadio: null,
            descripcion: null,
            presencia: null,
            grado: null,
            consultaId: this.datos.id,
            grados: [
                'Pre o postulcerativo, herida cerrada',
                'Herida superficial que no afecta tendones, cápsulas ni hueso',
                'Herida que penetra tendones o cápsulas',
                'Herida que afecta el hueso o articulación'
            ],
            presencias: [
                'Isquemia',
                'Infección',
                'Isquemia e infección',
                'Ninguna'
            ],
            campoRequerido: [
                v => v !== null && v !== undefined || 'Este campo es requerido',
            ],
        }
    },
    mounted() {
        const datosPieDiabetico = this.obtenerDatosPorConsulta(
            this.datos.id, 'PieDiabetico/Models/PieDiabetico','historia/formularios/PieDiabetico');

        if (datosPieDiabetico) {
            this.presencia = datosPieDiabetico.presencia;
            this.grado = datosPieDiabetico.descripcion;
        }
    },
    computed: {
        ...mapGetters('medidas', ['examenF']),
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),

        clasificacionPieDiabetico() {
            if (!this.grado || !this.presencia) {
                return null;
            }

            const gradoIndex = this.grados.indexOf(this.grado);
            const gradoNumero = gradoIndex !== -1 ? `Grado: ${gradoIndex}` : '';

            let estadio = '';
            switch (this.presencia) {
                case 'Ninguna':
                    estadio = 'A';
                    break;
                case 'Infección':
                    estadio = 'B';
                    break;
                case 'Isquemia':
                    estadio = 'C';
                    break;
                case 'Isquemia e infección':
                    estadio = 'D';
                    break;
            }
            const descripcion = this.presencia !== 'Ninguna'
                ? `${this.grado}`
                : `''`;

            return {
                grado: gradoNumero,
                presencia: this.presencia,
                estadio,
                descripcion
            };
        },
    },
    watch: {
        clasificacionPieDiabetico(val) {
            if (val) {
                this.estadio = val.estadio;
                this.descripcion = val.descripcion;
                this.gradoNumero = val.grado
            }
        }
    },
    methods: {
        ...mapActions('medidas', ['updateExamenF']),

        obtenerDatos() {
            const data = {
                presencia: this.presencia,
                grado: this.gradoNumero,
                estadio: this.estadio,
                descripcion: this.descripcion,
                consulta_id: this.consultaId
            }
            return { datos: data };
        },
    }
};

</script>