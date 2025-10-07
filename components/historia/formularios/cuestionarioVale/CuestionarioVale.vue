<template>
    <div>
        <riesgosGenerales :datos="datos" @envioDatos="manejarDatosRiesgos" @recibirRiesgosGenerales="recibirRiesgosGenerales" />
        
        <condicionesEstructurales :datos="datos"
        @conteoNo="actualizarConteoNo" @recibirCondicionesEstructurales="datosCondicionesEstructurales" />
        
        <ItemsValoracionVale :datos="datos" @respuestasNegativas="actualizarConteoNoItems" />

        <v-alert text dense :color="colorResultado(this.totalRespuestasNegativas)" border="left" class="text-center"
            icon="mdi-information">
            <b> {{ interpretacion_resultado }}</b>
        </v-alert>
        <template>
            <v-container class="text-center">
                <b>¿ Requiere remisión urgente ?</b>
                <v-radio-group v-model="remision_urgente">
                    <v-row justify="center" align="center" dense>
                        <v-col cols="12" sm="1" md="1">
                            <v-radio label="Si" value="Si"></v-radio>
                        </v-col>
                        <v-col cols="12" sm="1" md="1">
                            <v-radio label="No" value="No"></v-radio>
                        </v-col>
                    </v-row>
                </v-radio-group>
            </v-container>
        </template>
        <br>
    </div>
</template>

<script>
import { mapActions } from "vuex";

    import ItemsValoracionVale from "@/components/historia/formularios/cuestionarioVale/ItemsValoracionVale.vue";
    import riesgosGenerales from "@/components/historia/formularios/cuestionarioVale/ValeRiesgosGenerales.vue";
    import condicionesEstructurales from "@/components/historia/formularios/cuestionarioVale/ValeCondicionesEstructurales.vue";

    export default {
        props: ['datos'],
        components: {
            riesgosGenerales,
            ItemsValoracionVale,
            condicionesEstructurales
        },
        data() {
            return {
                datosRiesgosGenerales: {
                bajo_peso: '',
                nacio_antes: '',
                estancia_superior: '',
                complicaciones_bebe: '',
                descripcion_complicaciones: '',
                bebe_diagnosticado: '',
                descripcion_diagnosticos: '',
                condicion_riesgo_social: '',
                descripcion_riesgo_social: '',
                dificultad_aprendizaje: '',
                descripcion_dificultades: '',
            },
                valoresCondicionesEstructurales: {
                    orejas: null,
                    integridad_orejas: null,
                    labios: null,
                    integridad_labios: null,
                    lengua: null,
                    integridad_lengua: null,
                    nariz: null,
                    integridad_nariz: null,
                    paladar: null,
                    integridad_paladar: null,
                    ojos: null,
                    integridad_ojos: null,
                    dientes: null,
                    integridad_dientes: null,
                    cuello: null,
                    integridad_cuello: null,
                    hombros: null,
                    integridad_hombros: null,
                },
                conteoNoItemsValoracion:{
                    C:0,
                    E:0,
                    I:0,
                    V:0,
                },
                totalRespuestasNegativas: null,
                consulta_id: this.datos.id,
                conteoNoRiesgos: '',
                conteoNoCondicionesE: 0,
                interpretacion_resultado: null,
                respuestasNegativas: '',
                steps: [{
                        name: 'Riesgos Generales',
                        component: 'riesgosGenerales'
                    },
                    {
                        name: 'Condiciones Estructurales',
                        component: 'condicionesEstructurales'
                    }
                ],
                datosCuestionarioVale: {},
                loading: false,
                remision_urgente: null,
            }
        },
        watch: {
            valoresAObservar: {
                handler() {
                    if (
                        parseInt(this.conteoNoRiesgos) >= 1 ||
                        parseInt(this.conteoNoCondicionesE) >= 1 ||
                        parseInt(this.conteoNoItemsValoracion.C) > 1 ||
                        parseInt(this.conteoNoItemsValoracion.E) > 1 ||
                        parseInt(this.conteoNoItemsValoracion.I) > 1 ||
                        parseInt(this.conteoNoItemsValoracion.V) > 1 
                    ) {
                        this.interpretacion_resultado =
                            'Según las respuestas dadas, el paciente requiere una remisión a evaluación de Procesos de Habla, Lenguaje y Evaluación a Audiología Básica';
                        this.totalRespuestasNegativas = 1;
                    } else {
                        this.interpretacion_resultado = 'Según la evaluación, el resultado es considerado para la edad';
                        this.totalRespuestasNegativas = 0;
                    }
                },
                immediate: true,
                deep: false
            }
        },
        computed: {
            valoresAObservar() {
                return [
                    this.conteoNoRiesgos,
                    this.conteoNoCondicionesE,
                    this.conteoNoItemsValoracion
                ];
            }
        },
        methods: {
            ...mapActions("app", ["setPreload"]),

            recibirRiesgosGenerales(valor) {
                this.datosRiesgosGenerales = valor;
            },
            datosCondicionesEstructurales(valor) {
                this.valoresCondicionesEstructurales = valor;
            },
            actualizarConteoNo(valor) {
                this.conteoNoCondicionesE = valor;
            },
            actualizarConteoNoItems(valor) {
                this.conteoNoItemsValoracion = valor;
            },
            manejarDatosRiesgos(valor) {
                this.conteoNoRiesgos = valor;
            },
            guardarDatos() {
                this.loading = true
                this.$axios.post('cuestionario-vale/crear', this.datosCuestionarioVale).then(() => {
                    this.$toast.success('Creado con éxito')
                }).catch((error) => {
                    console.log('error al crear')
                }).finally(() => {
                    this.loading = false
                })
            },
            colorResultado(totalRespuestasNegativas) {
                if (totalRespuestasNegativas === 0) return '#3bfd47'; // verde
                if (totalRespuestasNegativas === 1) return '#f44336'; // rojo
                return '#ccc'; // color por defecto
            },
            obtenerDatos() {
                const data = {
                    consulta_id: this.consulta_id,
                    valorItemC: this.conteoNoItemsValoracion.C,
                    valorItemE: this.conteoNoItemsValoracion.E,
                    valorItemI: this.conteoNoItemsValoracion.I, 
                    valorItemV: this.conteoNoItemsValoracion.V,
                    interpretacion_resultado: this.interpretacion_resultado,
                    remision_urgente: this.remision_urgente,
                    orejas: this.valoresCondicionesEstructurales.orejas,
                    integridad_orejas: this.valoresCondicionesEstructurales.integridad_orejas,
                    labios: this.valoresCondicionesEstructurales.labios,
                    integridad_labios: this.valoresCondicionesEstructurales.integridad_labios,
                    lengua: this.valoresCondicionesEstructurales.lengua,
                    integridad_lengua: this.valoresCondicionesEstructurales.integridad_lengua,
                    nariz: this.valoresCondicionesEstructurales.nariz,
                    integridad_nariz: this.valoresCondicionesEstructurales.integridad_nariz,
                    paladar: this.valoresCondicionesEstructurales.paladar,
                    integridad_paladar: this.valoresCondicionesEstructurales.integridad_paladar,
                    ojos : this.valoresCondicionesEstructurales.ojos,
                    integridad_ojos: this.valoresCondicionesEstructurales.integridad_ojos,
                    dientes: this.valoresCondicionesEstructurales.dientes,
                    integridad_dientes: this.valoresCondicionesEstructurales.integridad_dientes,
                    cuello: this.valoresCondicionesEstructurales.cuello,
                    integridad_cuello: this.valoresCondicionesEstructurales.integridad_cuello,
                    hombros: this.valoresCondicionesEstructurales.hombros,
                    integridad_hombros: this.valoresCondicionesEstructurales.integridad_hombros,      
                    observacionesItems: this.valoresCondicionesEstructurales.observacionesItems,
                    bajo_peso: this.datosRiesgosGenerales.bajo_peso,
                    nacio_antes: this.datosRiesgosGenerales.nacio_antes,
                    estancia_superior: this.datosRiesgosGenerales.estancia_superior,
                    complicaciones_bebe: this.datosRiesgosGenerales.complicaciones_bebe,
                    descripcion_complicaciones: this.datosRiesgosGenerales.descripcion_complicaciones,
                    bebe_diagnosticado: this.datosRiesgosGenerales.bebe_diagnosticado,
                    descripcion_diagnosticos: this.datosRiesgosGenerales.descripcion_diagnosticos,
                    condicion_riesgo_social: this.datosRiesgosGenerales.condicion_riesgo_social,
                    descripcion_riesgo_social: this.datosRiesgosGenerales.descripcion_riesgo_social,
                    dificultad_aprendizaje: this.datosRiesgosGenerales.dificultad_aprendizaje,
                    descripcion_dificultades: this.datosRiesgosGenerales.descripcion_dificultades,
                }
                return {
                    datos: data
                };
            },
        }
    }

</script>
