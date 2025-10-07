<template>
    <div>
        <v-col cols="12" sm="12" md="12">
            <v-alert class="text-center" dense text type="info" icon="mdi-book-open-page-variant">
                <b>ESCALA ABREVIADA DE DESARROLLO</b>
            </v-alert>
        </v-col>
        <MotricidadGruesa :datos="datos" :resumen="resumen" @actualizarDatos="actualizarDatos"
            :datosEscala="datosEscala" @rangoFijo="rangoFijo=$event" @tipoEscala="tipoEscala=$event"
            @confirmar="convertirPd" :conversion="conversion"
            @puntuacionTotalMotricidadGruesa="puntuacionTotalMotricidadGruesa" @envioResultado="interpretacionMotricidadGruesa"></MotricidadGruesa>

        <MotricidadFinoadaptativa :datos="datos" :resumen="resumen"
            @actualizarDatosFinoadaptativa="actualizarDatosFinoadaptativa" :datosEscala="datosEscala"
            @tipoEscalaFinoadaptativa="tipoEscalaFinoadaptativa=$event" @confirmar="convertirPd"
            :conversion="conversion" @puntuacionTotalMotricidadFinoadaptativa="puntuacionTotalMotricidadFinoadaptativa" @EnvioResultadoFinoadaptativa="interpretacionFinoadaptativa">
        </MotricidadFinoadaptativa>

        <AudicionLenguaje :datos="datos" :resumen="resumen"
            @actualizarDatosAudicionLenguaje="actualizarDatosAudicionLenguaje" :datosEscala="datosEscala"
            @tipoEscalaAudicion="tipoEscalaAudicion=$event" @confirmar="convertirPd" :conversion="conversion"
            @puntuacionTotalAudicionLenguaje="puntuacionTotalAudicionLenguaje" @EnvioResultadoAudicionLenguaje="interpretacionAudicionLenguaje"></AudicionLenguaje>

        <PersonaSocial :datos="datos" :resumen="resumen" @actualizarDatosPersonaSocial="actualizarDatosPersonaSocial"
            :datosEscala="datosEscala" @tipoEscalaPersonaSocial="tipoEscalaPersonaSocial=$event"
            @confirmar="convertirPd" :conversion="conversion"
            @puntuacionTotalPersonaSocial="puntuacionTotalPersonaSocial" @EnvioResultadoPersonaSocial="interpretacionPersonaSocial"></PersonaSocial>

        <testMchat :datos="datos" v-if="interpretacion_audicion_lenguaje === 'Bajo' && parseInt(datos.afiliado.edad_cumplida) >= 18 && parseInt(datos.afiliado.edad_cumplida) <= 24">></testMchat>

    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";
    import MotricidadGruesa from "~/components/escalaAbreviadaItems/MotricidadGruesa.vue";
    import MotricidadFinoadaptativa from "~/components/escalaAbreviadaItems/MotricidadFinoadaptativa.vue";
    import AudicionLenguaje from "~/components/escalaAbreviadaItems/AudicionLenguaje.vue";
    import PersonaSocial from "~/components/escalaAbreviadaItems/PersonaSocial.vue";
    import testMchat from "~/components/historia/formularios/testMchat.vue";

    export default {
        name: 'EscalaAbreviadaDesarrollo',
        props: ['datos', 'resumen'],
        components: {
            MotricidadGruesa,
            MotricidadFinoadaptativa,
            AudicionLenguaje,
            PersonaSocial,
            testMchat,
        },
        data() {
            return {
                conversion: [],
                datosEscala: [],
                afiliadoId: this.datos.afiliado_id,
                punto_inicio_motricidad_gruesa: null,
                puntuacion_directa_motricidad_gruesa: null,
                consulta_id: null,
                punto_inicio_motricidad_finoadaptativa: null,
                puntuacion_directa_motricidad_finoadaptativa: null,
                punto_inicio_audicion_lenguaje: null,
                puntuacion_directa_audicion_lenguaje: null,
                punto_inicio_persona_social: null,
                puntuacion_directa_persona_social: null,
                edadCumplidaFija: null,
                tipoEscala: null,
                tipoEscalaFinoadaptativa: null,
                tipoEscalaAudicion: null,
                tipoEscalaPersonaSocial: null,
                puntuacion_total_motricidad_gruesa: null,
                puntuacion_total_motricidad_finoadaptativa: null,
                puntuacion_total_audicion_lenguaje: null,
                puntuacion_total_persona_social: null,
                resultado: null,
                resultadoFinoadaptativa: null,
                resultadoAudicionLenguaje: null,
                resultadoPersonaSocial: null,
                interpretacion_finoadaptativa: null,
                interpretacion_motricidad_gruesa: null,
                interpretacion_audicion_lenguaje: null,
                interpretacion_persona_social: null,
            }
        },
        mounted() {
            this.listarRegistroEscalaAbreviadaDesarrollo();
        },

        methods: {
            ...mapActions("app", ["setPreload"]),

            actualizarDatos({
                punto_inicio_motricidad_gruesa,
                puntuacion_directa_motricidad_gruesa,
                consulta_id,
                edadCumplidaFija,
                puntuacion_total_motricidad_gruesa,
            }) {
                this.consulta_id = consulta_id;
                this.punto_inicio_motricidad_gruesa = punto_inicio_motricidad_gruesa;
                this.puntuacion_directa_motricidad_gruesa = puntuacion_directa_motricidad_gruesa;
                this.edadCumplidaFija = edadCumplidaFija;
                this.puntuacion_total_motricidad_gruesa = puntuacion_total_motricidad_gruesa;
            },
            actualizarDatosFinoadaptativa({
                punto_inicio_motricidad_finoadaptativa,
                puntuacion_directa_motricidad_finoadaptativa
            }) {
                this.punto_inicio_motricidad_finoadaptativa = punto_inicio_motricidad_finoadaptativa;
                this.puntuacion_directa_motricidad_finoadaptativa = puntuacion_directa_motricidad_finoadaptativa;
            },
            actualizarDatosAudicionLenguaje({
                punto_inicio_audicion_lenguaje,
                puntuacion_directa_audicion_lenguaje
            }) {
                this.punto_inicio_audicion_lenguaje = punto_inicio_audicion_lenguaje;
                this.puntuacion_directa_audicion_lenguaje = puntuacion_directa_audicion_lenguaje;
            },
            actualizarDatosPersonaSocial({
                punto_inicio_persona_social,
                puntuacion_directa_persona_social
            }) {
                this.punto_inicio_persona_social = punto_inicio_persona_social;
                this.puntuacion_directa_persona_social = puntuacion_directa_persona_social;
            },
            puntuacionTotalMotricidadGruesa({
                puntuacion_total_motricidad_gruesa
            }) {
                this.puntuacion_total_motricidad_gruesa = puntuacion_total_motricidad_gruesa;
            },
            interpretacionMotricidadGruesa(resultado) {
                this.interpretacion_motricidad_gruesa = resultado;
            },
            interpretacionFinoadaptativa(resultadoFinoadaptativa) {
                this.interpretacion_finoadaptativa = resultadoFinoadaptativa;
            },
            interpretacionAudicionLenguaje(resultadoAudicionLenguaje) {
                this.interpretacion_audicion_lenguaje = resultadoAudicionLenguaje;
            },
            interpretacionPersonaSocial(resultadoPersonaSocial) {
                this.interpretacion_persona_social = resultadoPersonaSocial;
            },
            puntuacionTotalMotricidadFinoadaptativa({
                puntuacion_total_motricidad_finoadaptativa
            }) {
                this.puntuacion_total_motricidad_finoadaptativa = puntuacion_total_motricidad_finoadaptativa;
            },
            puntuacionTotalAudicionLenguaje({
                puntuacion_total_audicion_lenguaje
            }) {
                this.puntuacion_total_audicion_lenguaje = puntuacion_total_audicion_lenguaje;
            },
            puntuacionTotalPersonaSocial({
                puntuacion_total_persona_social
            }) {
                this.puntuacion_total_persona_social = puntuacion_total_persona_social;
            },

            obtenerDatos() {
                const data = {
                    consulta_id: this.consulta_id,
                    punto_inicio_motricidad_gruesa: this.punto_inicio_motricidad_gruesa,
                    puntuacion_directa_motricidad_gruesa: this.puntuacion_directa_motricidad_gruesa,
                    puntuacion_total_motricidad_gruesa: this.puntuacion_total_motricidad_gruesa,
                    interpretacion_motricidad_gruesa : this.interpretacion_motricidad_gruesa,

                    punto_inicio_motricidad_finoadaptativa: this.punto_inicio_motricidad_finoadaptativa,
                    puntuacion_directa_motricidad_finoadaptativa: this.puntuacion_directa_motricidad_finoadaptativa,
                    puntuacion_total_motricidad_finoadaptativa: this.puntuacion_total_motricidad_finoadaptativa,
                    interpretacion_finoadaptativa: this.interpretacion_finoadaptativa,

                    punto_inicio_audicion_lenguaje: this.punto_inicio_audicion_lenguaje,
                    puntuacion_directa_audicion_lenguaje: this.puntuacion_directa_audicion_lenguaje,
                    puntuacion_total_audicion_lenguaje: this.puntuacion_total_audicion_lenguaje,
                    interpretacion_audicion_lenguaje: this.interpretacion_audicion_lenguaje,


                    punto_inicio_persona_social: this.punto_inicio_persona_social,
                    puntuacion_directa_persona_social: this.puntuacion_directa_persona_social,
                    puntuacion_total_persona_social: this.puntuacion_total_persona_social,
                    interpretacion_persona_social: this.interpretacion_persona_social,
                }
                return {
                    datos: data
                };
            },
            listarRegistroEscalaAbreviadaDesarrollo() {
                this.setPreload(true);
                this.$axios.post('/escala-abreviada-desarrollo/listar', {
                        afiliado_id: this.afiliadoId,
                    })
                    .then((response) => {
                        this.setPreload(false);
                        this.datosEscala = response.data;
                    })
                    .catch((error) => {
                        this.setPreload(false);
                        console.error(error);
                    });
            },
            convertirPd() {
                this.setPreload(true);

                const escalas = [{
                        tipoEscala: this.tipoEscala,
                        puntuacion_directa: this.puntuacion_directa_motricidad_gruesa,
                        nombre: 'motricidad_gruesa'
                    },
                    {
                        tipoEscala: this.tipoEscalaFinoadaptativa,
                        puntuacion_directa: this.puntuacion_directa_motricidad_finoadaptativa,
                        nombre: 'finoadaptativa'
                    },
                    {
                        tipoEscala: this.tipoEscalaAudicion,
                        puntuacion_directa: this.puntuacion_directa_audicion_lenguaje,
                        nombre: 'audicion_lenguaje'
                    },
                    {
                        tipoEscala: this.tipoEscalaPersonaSocial,
                        puntuacion_directa: this.puntuacion_directa_persona_social,
                        nombre: 'persona_social'
                    }
                ];

                const resultados = {};

                const escalasValidas = escalas.filter(
                    e => e.puntuacion_directa !== null && e.puntuacion_directa !== undefined && e
                    .puntuacion_directa !== ''
                );

                const promesas = escalasValidas.map(escala =>
                    this.$axios.post('/escala-abreviada-desarrollo/convertirPd', {
                        rango: this.rangoFijo,
                        tipoEscala: escala.tipoEscala,
                        puntuacion_directa: escala.puntuacion_directa
                    }).then(response => {
                        resultados[escala.nombre] = response.data;
                    })
                );

                if (promesas.length === 0) {
                    this.setPreload(false);
                    return;
                }

                Promise.all(promesas)
                    .then(() => {
                        this.setPreload(false);
                        this.conversion = resultados;
                    })
                    .catch(error => {
                        this.setPreload(false);
                        console.error(error);
                    });
            },
        },
    }
</script>
