<template>
    <v-card flat :loading="loading" :disable="loading">
        <v-alert text dense color="primary" icon="mdi-atom">
            <b>REGISTRO DE BIOPSIA Y PATOLOGIA</b>
        </v-alert>

        <v-col cols="12">
            <v-alert text dense color="blue-grey" icon="mdi-beaker-check-outline">
                <b>BIOPSIA</b>
            </v-alert>
        </v-col>

        <v-form lazy-validation ref="formBiopsia">
            <v-row>
                <v-col cols="12" lg="6">
                    <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition"
                        offset-y max-width="290px" min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field :rules="[rules.requerido]" v-model="fechaInicioFormatted"
                                label="Fecha de ingreso" hint="MM/DD/YYYY" outlined dense append-icon="mdi-calendar"
                                v-bind="attrs" @blur="resultadoBiopsia.fecha_inicio = parseDate(fechaInicioFormatted)"
                                v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="resultadoBiopsia.fecha_inicio" no-title @input="menu1 = false">
                        </v-date-picker>
                    </v-menu>
                </v-col>


                <v-col cols="12" lg="6">
                    <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition"
                        offset-y max-width="290px" min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field :rules="[rules.requerido]" v-model="fechaFinalFormatted" label="Fecha final"
                                hint="MM/DD/YYYY" outlined dense append-icon="mdi-calendar" v-bind="attrs"
                                @blur="resultadoBiopsia.fecha_final = parseDate(fechaFinalFormatted)" v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="resultadoBiopsia.fecha_final" no-title @input="menu2 = false">
                        </v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete :rules="[rules.requerido]" label="Lateralidad" dense
                        v-model="resultadoBiopsia.lateralidad" outlined :items="lateralidades"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-alert text dense color="blue-grey" icon="mdi-beaker-plus-outline">
                        <b>PATOLOGÍA</b></v-alert>
                </v-col>

                <v-col cols="12" lg="6">
                    <v-menu ref="menu3" v-model="menu3" :close-on-content-click="false" transition="scale-transition"
                        offset-y max-width="290px" min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field :rules="[rules.requerido]" v-model="fechaInicioPatologiaFormatted"
                                label="Fecha inicial (Patología)" hint="MM/DD/YYYY" outlined dense
                                append-icon="mdi-calendar" v-bind="attrs"
                                @blur="resultadoBiopsia.fecha_inicio_patologia = parseDate(fechaInicioPatologiaFormatted)"
                                v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="resultadoBiopsia.fecha_inicio_patologia" no-title
                            @input="menu3 = false">
                        </v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" lg="6">
                    <v-menu ref="menu4" v-model="menu4" :close-on-content-click="false" transition="scale-transition"
                        offset-y max-width="290px" min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field :rules="[rules.requerido]" v-model="fechaFinalPatologiaFormatted"
                                label="Fecha final (Patología)" hint="MM/DD/YYYY" outlined dense
                                append-icon="mdi-calendar" v-bind="attrs"
                                @blur="resultadoBiopsia.fecha_final_patologia = parseDate(fechaFinalPatologiaFormatted)"
                                v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="resultadoBiopsia.fecha_final_patologia" no-title @input="menu4 = false">
                        </v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-alert text dense color="blue-grey" icon="mdi-hospital-box-outline"><b>REGISTRO DE DIAGNÓSTICO
                            (CIE
                            10)</b></v-alert>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-autocomplete label="Diagnóstico (cie 10)" dense outlined :loading="loading" :items="cie10s"
                        item-text="Codigo_Nombre" item-value="id" :search-input.sync="cie10"
                        v-model="resultadoBiopsia.cie10_id" no-data-text="Por favor escriba el nombre del diagnóstico"
                        @change="verificarTipoCancerCie10(resultadoBiopsia.cie10_id)"
                        :rules="!resultadoBiopsia.codigo_cie10 ? [rules.requerido] : []">
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12" v-if="resultadoBiopsia.codigo_cie10">
                    <v-alert text dense color="purple" border="left" icon="mdi-medication-outline"><b>Diagnostico
                            asociado
                            previamente:
                            {{
                                resultadoBiopsia?.codigo_cie10 }} - {{
                                resultadoBiopsia?.nombre_cie10 }}</b></v-alert>
                </v-col>


                <v-col v-if="tipoCancer?.id === 1">
                    <cancer-mama :afiliado="datos" :resultadoBiopsia="resultadoBiopsia" :cancerProp="cancer"
                        @limpiarFormulario="$emit('limpiarFormulario')" :historia="historia"
                        ref="cancerTipo1"></cancer-mama>
                </v-col>

                <v-col v-if="tipoCancer?.id === 2">
                    <CancerProstata :afiliado="datos" :resultadoBiopsia="resultadoBiopsia" :historia="historia"
                        :cancerProp="cancer" @limpiarFormulario="$emit('limpiarFormulario')" ref="cancerTipo2">
                    </CancerProstata>
                </v-col>

                <v-col v-if="tipoCancer?.id === 3">
                    <cancerColon :afiliado="datos" :resultadoBiopsia="resultadoBiopsia" :historia="historia"
                        :cancerProp="cancer" @limpiarFormulario="$emit('limpiarFormulario')" ref="cancerTipo3">
                    </cancerColon>
                </v-col>

                <v-col v-if="tipoCancer?.id === 4">
                    <cancerOvario :afiliado="datos" :resultadoBiopsia="resultadoBiopsia" :historia="historia"
                        @limpiarFormulario="$emit('limpiarFormulario')" :cancerProp="cancer" ref="cancerTipo4">
                    </cancerOvario>
                </v-col>

                <v-col v-if="tipoCancer?.id === 5">
                    <cancerPulmon :afiliado="datos" :resultadoBiopsia="resultadoBiopsia" :historia="historia"
                        :cancerProp="cancer" @limpiarFormulario="$emit('limpiarFormulario')" ref="cancerTipo5">
                    </cancerPulmon>
                </v-col>

                <v-col v-if="tipoCancer?.id === 6">
                    <cancerGastrico :afiliado="datos" :resultadoBiopsia="resultadoBiopsia" :historia="historia"
                        :cancerProp="cancer" @limpiarFormulario="$emit('limpiarFormulario')" ref="cancerTipo6">
                    </cancerGastrico>
                </v-col>
            </v-row>

        </v-form>
    </v-card>
</template>

<script>
import CancerMama from '@/components/historia/formularios/BiopsiaCancerMamaComponente.vue';
import CancerProstata from '@/components/historia/formularios/BiopsiaCancerProstata.vue';
import cancerOvario from '@/components/historia/formularios/BiopsiaCancerOvario.vue';
import cancerPulmon from '@/components/historia/formularios/BiopsiaCancerPulmon.vue';
import cancerGastrico from '@/components/historia/formularios/BiopsiaCancerGastrico.vue';
import cancerColon from '@/components/historia/formularios/BiopsiaCancerColon.vue'
import {
    mapActions
} from "vuex";
export default {
    components: {
        CancerMama,
        CancerProstata,
        cancerOvario,
        cancerPulmon,
        cancerGastrico,
        cancerColon
    },
    props: {
        datos: Object,
        historia: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            menu1: false,
            menu2: false,
            menu3: false,
            menu4: false,
            cie10s: [],
            loading: false,
            cie10: null,
            loading: false,
            cancer: {},
            lateralidades: [
                'Derecha',
                'Izquierda',
                'Ambos(as)'
            ],
            resultadoBiopsia: {
                fecha_inicio: '',
                fecha_final: '',
                cie10_id: null,
                lateralidad: null,
                fecha_inicio_patologia: '',
                fecha_final_patologia: ''
            },
            tipoCancer: null,
            rules: {
                requerido: v => !!v || 'Este campo es requerido',
            },
        };
    },
    computed: {
        fechaInicioFormatted: {
            get() {
                return this.formatDate(this.resultadoBiopsia.fecha_inicio);
            },
            set(value) {
                this.resultadoBiopsia.fecha_inicio = this.parseDate(value);
            }
        },
        fechaFinalFormatted: {
            get() {
                return this.formatDate(this.resultadoBiopsia.fecha_final);
            },
            set(value) {
                this.resultadoBiopsia.fecha_final = this.parseDate(value);
            }
        },
        fechaInicioPatologiaFormatted: {
            get() {
                return this.formatDate(this.resultadoBiopsia.fecha_inicio_patologia);
            },
            set(value) {
                this.resultadoBiopsia.fecha_inicio_patologia = this.parseDate(value);
            }
        },
        fechaFinalPatologiaFormatted: {
            get() {
                return this.formatDate(this.resultadoBiopsia.fecha_final_patologia);
            },
            set(value) {
                this.resultadoBiopsia.fecha_final_patologia = this.parseDate(value);
            }
        }

    },
    watch: {
        cie10(val) {
            if (!val || val.length < 4) {
                this.cie10s = [];
            } else if (val.length === 4) {
                this.listarCie10();
            }
        }
    },
    mounted() {
        this.listarUltimaBiopsiaAfiliado()
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        formatDate(date) {
            if (!date) return '';
            return this.$moment(date).format('MM/DD/YYYY');
        },
        parseDate(date) {
            if (!date) return '';
            return this.$moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
        },

        validarErrores() {
            const esValidoBiopsia = this.$refs.formBiopsia?.validate();

            // Validar componente según el tipo de cáncer
            const tipoId = this.tipoCancer?.id;
            if (tipoId) {
                const refKey = `cancerTipo${tipoId}`;
                const componenteRef = this.$refs[refKey];

                if (componenteRef?.validarErrores) {
                    const esValidoTipoCancer = componenteRef.validarErrores();
                    return esValidoBiopsia && esValidoTipoCancer;
                }
            }

            return esValidoBiopsia;
        },


        listarCie10() {
            const data = {
                valor: this.cie10
            };
            this.loading = true;
            this.$axios.$post('cie10/listarFiltro', data).then(res => {
                this.cie10s = res;
            }).catch(err => {
                console.log(err);
                this.$toast.error(err.response?.data?.mensaje || 'Error al buscar CIE10');
            }).finally(() => {
                this.loading = false;
            });
        },

        verificarTipoCancerCie10(cie10) {
            this.setPreload(true);
            this.$axios.get('tipo-cancer/obtener-tipo-cancer-por-cie10/' + cie10).then((res) => {
                this.tipoCancer = res.data
                if (Object.keys(this.tipoCancer).length > 0) {
                    this.alertaDiagnostico(this.tipoCancer);
                }
                if (this.historia) {
                    this.obtenerRegistroCancerAfiliado(this.resultadoBiopsia?.id)
                }
            }).catch((err) => {
                console.error(err);
            }).finally(() => {
                this.setPreload(false);
            });
        },

        alertaDiagnostico(tipoCancer) {
            return this.$swal(({
                title: "Atención",
                text: `Diagnostico marcado como ${tipoCancer.nombre}, por favor responde las preguntas que salen a continuación.`,
                type: "info",
            }))
        },

        async listarUltimaBiopsiaAfiliado() {
            let afiliado = this.historia === true ? this.datos.afiliado_id : this.datos.id;
            try {
                const res = await this.$axios.get(`registrar-biopsias/listar-ultima-biopsia-afiliado/${afiliado}`);

                if (res.data && Object.keys(res.data).length > 0) {
                    this.resultadoBiopsia = {
                        ...res.data,
                        fecha_inicio: res.data.fecha_inicial_biopsia,
                        fecha_final: res.data.fecha_final_biopsia
                    };
                }
                const cie10 = res.data.cie10_id;
                if (cie10) {
                    this.verificarTipoCancerCie10(cie10);
                }
            } catch (error) {
                console.error('Error al obtener la última biopsia del afiliado:', error);
            }
        },

        obtenerRegistroCancerAfiliado(biopsia) {
            this.$axios.get('registrar-biopsias/listar-registro-cancer-afiliado/' + biopsia).then((res) => {
                this.cancer = {
                    ...res.data,
                    porcentaje_estrogenos: parseInt(res.data.porcentaje_estrogenos || 0, 10),
                    porcentaje_progestagenos: parseInt(res.data.porcentaje_progestagenos || 0, 10),
                    fecha_ingreso_ihq: res.data.fecha_ingreso_ihq?.split(' ')[0] || '',
                    fecha_salida_ihq: res.data.fecha_salida_ihq?.split(' ')[0] || ''
                };
            }).catch((error) => {
                console.log(error)
            })
        }

    }
};

</script>
