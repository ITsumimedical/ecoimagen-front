<template>
    <div>
        <v-alert text dense color="blue" border="left" class="text-center" icon="mdi-account-file-outline"><b>CONDUCTA
                INADAPTATIVA</b></v-alert>
        <v-container>
            <v-row>
                <v-col cols="12" sm="3" md="3">
                    <v-select label="¿Se come las uñas?" dense outlined v-model="formConducta.come_unas"
                        :items="opcionSino"></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-select label="¿Se succiona los dedos?" dense outlined v-model="formConducta.succiona_dedos"
                        :items="opcionSino"></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-select label="¿Se muerde el labio?" dense outlined v-model="formConducta.muerde_labio"
                        :items="opcionSino"></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-select label="¿Le sudan las manos?" dense outlined v-model="formConducta.sudan_manos"
                        :items="opcionSino"></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-select label="¿Le tiemblan las manos y piernas?" dense outlined
                        v-model="formConducta.tiemblan_manos" :items="opcionSino"></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-select label="¿Agrede a las personas sin motivo?" dense outlined
                        v-model="formConducta.agrege_sin_motivo" :items="opcionSino"></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                    <v-select label="¿Se le caen las cosas con facilidad?" dense outlined
                        v-model="formConducta.se_caen_cosas" :items="opcionSino"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Trastornos del comportamiento" dense outlined v-model="formConducta.trastornos_comportamiento"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Trastornos emocionales" dense outlined v-model="formConducta.trastornos_emocionales"></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-alert color="blue" text dense border="left" class="text-center"
                        icon="mdi-controller "><b>JUEGOS</b></v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="¿Su hijo juega solo? ¿por qué? ¿dirige o es dirigido?" dense outlined
                        v-model="formConducta.juega_solo"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="¿Qué juegos prefiere su hijo? ¿cuáles son sus juguetes preferidos?" dense
                        outlined v-model="formConducta.juegos_prefiere"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="¿Prefiere jugar con niños mayores, menores o de su edad" dense outlined
                        v-model="formConducta.prefiere_jugar_ninos"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="¿Cuáles son las distracciones de sus hijos? (uso del tiempo libre, deportes):"
                        dense outlined v-model="formConducta.distracciones_hijos"></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea
                        label="Conductas en el juego con otros niños, agresividad, ausencia del deseo del contacto:"
                        dense outlined v-model="formConducta.conductas_juegos"></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-alert color="blue" text dense border="left" class="text-center"
                        icon="mdi-school"><b>ESCOLARIDAD</b></v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Inicio ¿a qué edad?, adaptación, dificultades:" dense outlined
                        v-model="formConducta.inicio_escolaridad"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Cambios de colegio ¿por qué?:" dense outlined
                        v-model="formConducta.cambio_colegio"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea
                        label="¿Observó dificultades en el aprendizaje? ¿desde cuándo? ¿qué hizo?, rendimiento en escritura, lectura, matemáticas:"
                        dense outlined v-model="formConducta.dificultad_aprendizaje"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="¿Repeticiones de año? ¿cuántas veces?" dense outlined
                        v-model="formConducta.repeticiones_escolares"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Conducta en clase" dense outlined
                        v-model="formConducta.conducta_clase"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Materias de mayor desempeño:" dense outlined
                        v-model="formConducta.materias_mayor_nivel"></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea label="Materias de peor desempeño:" dense outlined
                        v-model="formConducta.materias_menor_nivel"></v-textarea>
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
            formConducta: {
                come_unas: '',
                succiona_dedos: '',
                muerde_labio: '',
                sudan_manos: '',
                tiemblan_manos: '',
                agrege_sin_motivo: '',
                se_caen_cosas: '',
                trastornos_comportamiento: '',
                trastornos_emocionales: '',
                juega_solo: '',
                juegos_prefiere: '',
                prefiere_jugar_ninos: '',
                distracciones_hijos: '',
                conductas_juegos: '',
                inicio_escolaridad: '',
                cambio_colegio: '',
                dificultad_aprendizaje: '',
                repeticiones_escolares: '',
                conducta_clase: '',
                materias_mayor_nivel: '',
                materias_menor_nivel: '',
                consulta_id: this.datos.id,
            },
            opcionSino: [
                {
                    text: 'Si',
                    value: true
                },
                {
                    text: 'No',
                    value: false
                }
            ]
        }
    },
    mounted() {
        const conducta = this.obtenerDatosPorConsulta(this.datos.id, 'ConductasInadaptativas/Model/ConductaInadaptativa', 'historia/formularios/conductaInadaptativa');

        if (conducta) {
            this.formConducta = { ...conducta }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
        obtenerDatos() {
                return {
                    datos: this.formConducta
                };
            },
        guardarConducta() {
            this.$axios.post('conductaInadaptativa/crear', this.formConducta).then(() => {
                this.$toast.success('Guardado con éxito')
            }).catch((error) => {
                console.log(error)
            })
        }
    }
}
</script>
