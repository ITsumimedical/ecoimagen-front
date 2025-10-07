<template>
    <div class="fill-height">
        <v-card class="fill-height">
            <v-toolbar dense dark color="titulo black--text">
                <v-btn color="black" icon @click="$emit('cerrarModal')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Urgencia</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
                <v-row dense>
                    <!-- Información del paciente e ingreso -->
                    <v-col cols="12" md="6" sm="12">
                        <p class="mb-2">
                            <strong>Paciente:</strong>
                            {{ datos.asignacion_cama[0].admision_urgencia.consulta.afiliado.tipo_documento.sigla }}
                            {{ datos.asignacion_cama[0].admision_urgencia.consulta.afiliado.numero_documento }} -
                            {{ nombreCompletoAfiliado }}
                        </p>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                        <p class="mb-2">
                            <strong>Nro ingreso:</strong>
                            {{ datos.asignacion_cama[0].admision_urgencia.id }}
                        </p>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                        <p class="mb-2">
                            <strong>Cama:</strong>
                            {{ datos.nombre }} - {{ datos.pabellon }}
                        </p>
                    </v-col>


                    <v-col cols="12" md="6" sm="12">
                        <p class="mb-2">
                            <strong>Contrato:</strong>
                            {{ datos.asignacion_cama[0].admision_urgencia.contratos.entidad.nombre }} -
                            {{ datos.asignacion_cama[0].admision_urgencia.contratos.prestador.nombre_prestador }}
                        </p>
                    </v-col>

                    <v-col cols="12" md="4" sm="12">
                        <p class="mb-2">
                            <strong>Edad:</strong>
                            {{ datos.asignacion_cama[0].admision_urgencia.consulta.afiliado.edad_cumplida }} años
                        </p>
                    </v-col>

                    <v-col cols="12" md="4" sm="12">
                        <p class="mb-2">
                            <strong>Fecha y hora ingreso:</strong>
                            {{ $moment(datos.asignacion_cama[0].admision_urgencia.created_at).format(`YYYY-MM-DD HH: mm:
                            ss`) }}
                        </p>
                    </v-col>

                    <v-col cols="12" md="4" sm="12">
                        <p class="mb-2">
                            <strong>Tipo admisión:</strong> Urgencias
                        </p>
                    </v-col>

                    <!-- Unidad funcional -->
                    <v-col cols="12" md="12" sm="12">
                        <p class="mb-2">
                            <strong>Unidad funcional:</strong> Urgencias
                        </p>
                    </v-col>

                    <!-- Diagnóstico -->
                    <v-col cols="12" md="12" sm="12" v-if="cie10">
                        <p class="mb-2">
                            <strong>Diagnóstico:</strong>
                            {{ cie10.codigo_cie10 }}-{{ cie10.nombre }}
                        </p>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="12" md="12" sm="12">
                        <ordenamientoComponet
                            :consulta="parseInt(datos.asignacion_cama[0].admision_urgencia.consulta.id)"
                            :habilitarBoton="true" :dialog="false" />
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-slide-group show-arrows class="justify-left">
                            <v-slide-item v-for="btn in botones" :key="btn.id">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on" @click="accionar(btn)" :color="btn.color">
                                            <v-icon>{{ btn.icon }}</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ btn.label }}</span>
                                </v-tooltip>
                            </v-slide-item>
                        </v-slide-group>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" md="12" sm="12">
                        <component :is="componente" :datos="datos.asignacion_cama[0]" :crear="true"
                            ref="componenteDinamico" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import ConsentimientoInformadoComponente from "../urgencias/ConsentimientosInformadosComponent.vue";
import OxigenoComponente from "../urgencias/OxigenoComponent.vue";
import SignosVitalesComponente from "../urgencias/SignosVitalesComponent.vue";
import NotasEnfermeriaComponent from "../urgencias/NotasEnfermeriaComponent.vue";
import HistoriaClinicaComponente from "../urgencias/HistoriaClinicaComponent.vue";
import ordenamientoComponet from "~/components/ordenamiento/ordenamiento.vue";
import listarEvolucionesAdmision from "../admisiones/evoluciones/listarEvolucionesAdmision.vue";

import {
    mapActions
} from "vuex";

export default {
    props: {
        ejecutar: {
            type: Boolean,
            default: false,
        },
        datos: Object
    },
    components: {
        SignosVitalesComponente,
        NotasEnfermeriaComponent,
        HistoriaClinicaComponente,
        OxigenoComponente,
        ordenamientoComponet,
        ConsentimientoInformadoComponente,
        listarEvolucionesAdmision
    },
    name: 'triage',
    data() {
        return {
            preload: false,
            cie10: null,
            botones: [
                {
                    id: 1,
                    label: 'Notas de enfermeria',
                    icon: 'mdi-doctor',
                    color: 'info',
                    componente: 'NotasEnfermeriaComponent'
                },
                {
                    id: 2,
                    label: 'Historia clinica',
                    icon: 'mdi-file-sign',
                    color: 'info',
                    componente: 'HistoriaClinicaComponente'
                },
                {
                    id: 3,
                    label: 'Signos vitales',
                    color: 'info',
                    icon: 'mdi-heart-pulse',
                    componente: 'SignosVitalesComponente'
                },
                {
                    id: 4,
                    label: 'Oxigeno',
                    color: 'info',
                    icon: 'mdi-gas-cylinder',
                    componente: 'OxigenoComponente'
                },
                {
                    id: 5,
                    label: 'Consentimientos informados',
                    color: 'info',
                    icon: 'mdi-file-pdf-box',
                    componente: 'ConsentimientoInformadoComponente'
                },
                {
                    id: 6,
                    label: 'Evoluciones',
                    color: 'info',
                    icon: 'mdi-account-clock-outline',
                    componente: 'listarEvolucionesAdmision'
                },
            ],
            componente: null,
        }
    },
    mounted() {
        this.listarCie10Primario()
    },

    computed: {
        nombreCompletoAsignacion() {
            const afiliado = this.datos?.asignacion_cama?.[0]?.admision_urgencia?.consulta?.afiliado || {};
            return [
                afiliado.primer_nombre,
                afiliado.segundo_nombre,
                afiliado.primer_apellido,
                afiliado.segundo_apellido,
            ].filter(Boolean).join(' ');
        }
    },

    watch: {
        componente(nuevoComponente) {
            this.manejarCambioComponente(nuevoComponente);
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        listarCie10Primario() {
            this.setPreload(true)
            this.$axios.get("/cie10/cie10Primario/" + this.datos.asignacion_cama[0].admision_urgencia.consulta.id)
                .then((res) => {
                    this.cie10 = res.data;
                }).catch((err) => {
                    return this.$toast.error("Error al listar antecedentes personales");
                }).finally(() => {
                    this.setPreload(false)
                })
        },

        accionar(boton) {
            console.log('f', boton);
            this.componente = boton.componente

        },

        manejarCambioComponente(nombreComponente) {
            const handlers = {
                listarEvolucionesAdmision: this.ejecutarListarEvoluciones,
                // puedes agregar más en el futuro
            };

            if (handlers[nombreComponente]) {
                // Espera un tick para que el componente se monte
                this.$nextTick(() => handlers[nombreComponente]());
            }
        },

        ejecutarListarEvoluciones() {
            const componente = this.$refs.componenteDinamico;
            if (componente && typeof componente.listarEvolucionesAdmision === 'function') {
                componente.listarEvolucionesAdmision();
            } else {
                console.warn('El componente no tiene la función listarEvolucionesAdmision');
            }
        }
    }
}

</script>

<style scoped>
.fill-height {
    height: 100vh;
}
</style>
