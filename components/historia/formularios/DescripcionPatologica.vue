<template>
    <div>
        <template>
            <div class="text-center">
                <v-dialog v-model="preload" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo, procesamos tu solicitud!
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>
        <v-form>
            <v-row>
                <v-col xs="12" sm="12" md="12">
                    <v-alert class="text-center" dense text outlined type="info" icon="mdi-medication-outline">
                        <b>DESCRIPCIÓN DE LA PATOLOGÍA</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea auto-grow autofocus outlined label="Descripción patología cáncer actual"
                        v-model="patologia.patologia_cancer_actual"></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                    <v-text-field dense outlined label="Fecha recolección muestra Dx cáncer actual"
                        v-model="patologia.fdx_cancer_actual" type="date"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                    <v-text-field dense outlined label="Fecha reporte laboratorio patología"
                        v-model="patologia.flaboratorio_patologia" type="date"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="9">
                    <v-select dense outlined label="Diferenciación tumor sólido maligno según biopsia"
                        v-model="patologia.tumor_segunda_biopsia" :items="tumor"></v-select>
                </v-col>
                <v-col md="12">
                    <v-alert class="text-center" dense text outlined type="info" icon="mdi-information">
                        <b>TIPO TUMOR</b>
                    </v-alert>
                </v-col>
                <v-col md="3">
                    <v-select :items="localizacion" v-model="patologia.localizacion_cancer" dense
                        label="Localización cáncer">
                    </v-select>
                </v-col>
                <v-col v-if="patologia.localizacion_cancer == 'Colorrectal'">
                    <v-text-field dense value="Dukes" label="Clasificación según tipo de cáncer" readonly>
                    </v-text-field>
                </v-col>
                <v-col v-if="patologia.localizacion_cancer == 'Colorrectal'">
                    <v-select dense :items="valores" label="Valores de la lista" v-model="patologia.Dukes">
                    </v-select>
                </v-col>
                <v-col v-if="patologia.localizacion_cancer == 'Próstata'">
                    <v-text-field dense value="Gleason" label="Clasificación según tipo de cáncer" readonly>
                    </v-text-field>
                </v-col>
                <v-col v-if="patologia.localizacion_cancer == 'Próstata'">
                    <v-select dense label="Valores de la lista" :items="valores" v-model="patologia.gleason"></v-select>
                </v-col>
                <v-col v-if="patologia.localizacion_cancer == 'Mama'">
                    <v-text-field dense value="Her 2" label="Clasificación según tipo de cáncer" readonly>
                    </v-text-field>
                </v-col>
                <v-col v-if="patologia.localizacion_cancer == 'Mama'">
                    <v-select dense :items="her2" label="Valores de la lista" v-model="patologia.her2"></v-select>
                </v-col>
                <v-col v-if="patologia.localizacion_cancer == 'Linfomas Hodgkin/ no Hoodgkin'">
                    <v-text-field dense value="Estadificación clínica" label="Clasificación según tipo de cáncer"
                        readonly>
                    </v-text-field>
                </v-col>
                <v-col v-if="patologia.localizacion_cancer == 'Linfomas Hodgkin/ no Hoodgkin'">
                    <v-select v-model="patologia.estadificacion_clinica" dense :items="Estadificaciónclinica"
                        label="Valores de la lista">
                    </v-select>
                </v-col>
                <v-col md="12">
                    <v-alert class="text-center" dense text outlined type="info" icon="mdi-medical-bag">
                        <b>ESTADIFICACIÓN DEL TUMOR</b>
                    </v-alert>
                </v-col>
                <v-col md="12">
                    <v-textarea outlined dense label="Estadificación inicial por TNM"
                        v-model="patologia.estadificacion_inicial">
                    </v-textarea>
                </v-col>
                <v-col>
                    <v-text-field type="date" outlined label="Fecha de estadificación" dense
                        v-model="patologia.fecha_estadificacion">
                    </v-text-field>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex';

    export default {
        props: {
            datos: Object
        },
        data() {
            return {
                consulta_id: this.datos.id,
                patologia: {
                    patologia_cancer_actual: '',
                    fdx_cancer_actual: '',
                    flaboratorio_patologia: '',
                    tumor_segunda_biopsia: '',
                    localizacion_cancer: '',
                    Dukes: '',
                    gleason: '',
                    her2: '',
                    estadificacion_clinica: '',
                    estadificacion_inicial: '',
                    fecha_estadificacion: '',
                    consulta_id: this.datos.id,
                },
                preload: false,
                tumor: ['Bien diferenciado (grado 1)', 'Moderadamente diferenciado (grado 2)',
                    'Mal diferenciado (grado 3)', 'Anaplásico o indiferenciado (grado 4)', 'No aplica'
                ],
                localizacion: ['Colorrectal', 'Próstata', 'Mama', 'Linfomas Hodgkin/ no Hoodgkin', 'No aplica'],
                valores: ['A', 'B', 'C', 'D'],
                her2: ['+++ positivo', '++ equívoco o indeterminado', '+ negativo', 'cero o negativo'],
                Estadificaciónclinica: ['Estado (etapa) I', 'Estado (etapa) II', 'Estado (etapa) III',
                    'Estado (etapa) IV'
                ]
            }
        },
        computed: {
            ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
        },
        created() {
        const datosPatologia = this.obtenerDatosPorConsulta(this.datos.id, 'Patologia/Model/AntecedentesPatologias', 'historia/formularios/DescripcionPatologica');
            if (datosPatologia) {
                this.patologia = {
                    ...datosPatologia
                };
            }
        },
        methods: {
            validarErrores() {
                return [];
            },
            // guardarPatologia() {
            //     this.patologia.consulta_id = this.datos.id
            //     this.preload = true;
            //     this.$axios.post('/patologias/crear', this.patologia)
            //         .then(res => {
            //             console.log('res', res)
            //             this.preload = false;
            //             this.$toast.success('Patología creada con éxito!');
            //         })
            //         .catch(err => {
            //             this.preload = false;
            //             this.$toast.error('Hubo un error al crear la patología.');
            //             console.error(err);
            //         });
            // },
            obtenerDatos() {
                const data = {
                    ...this.patologia,
                    consulta_id: this.datos.id
                };
                return {
                    datos: data
                };
            },

        }
    }

</script>
