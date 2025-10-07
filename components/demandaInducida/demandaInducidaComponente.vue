<template>
    <div>
        <v-row>
            <v-col cols="12" sm="6" md="12">
                <v-row>
                    <v-col>
                        <buscar-afiliado :documentos="documentos" @buscarAfiliado="realizarBusqueda"
                            ref="buscarAfiliado" @input="limpiarComponente">
                            <template v-slot:acciones> </template>
                        </buscar-afiliado>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- informacion general -->
        <v-card-text :loading="loading" :disabled="loading">
            <component :is="componente" :afiliado="datos" :modoDetalle="true" :modoEdicion="true"
                :mostrarClasificaciones="true" />
        </v-card-text>

        <v-card v-if="mostrarCampos" flat>
            <v-card-text>
                <v-col class="mb-5" cols="12" sm="12" md="12">
                    <v-alert border="left" dense text outlined color="info" icon="mdi-directions"><b>Antecedentes
                            Personales</b>
                    </v-alert>
                    <v-col>
                        <v-data-table :loading="loading" :disable="loading" :headers="headers"
                            :items="antecedentesPersonalesLista">
                            <template v-slot:[`item.medico`]="{ item }">
                                {{ item.operador?.nombre }} {{ item.operador?.apellido }}
                            </template>
                            <template v-slot:[`item.created_at`]="{ item }">
                                {{ formatearFecha(item.created_at) }}
                            </template>
                        </v-data-table>
                    </v-col>
                </v-col>
                <v-col class="row mt-5" cols="12" sm="12" md="12">
                    <v-col class="mb-5" cols="12" sm="12" md="12">
                        <v-alert border="left" dense text outlined color="info" icon="mdi-directions"><b>Programa a
                                direccionar</b>
                        </v-alert>
                    </v-col>
                    <v-col class="row ml-3" cols="12" sm="12" md="2">
                        <v-checkbox v-model="demandaInducida.demanda_inducida_efectiva" label="Efectiva"
                            :error-messages="errors.demanda_inducida_efectiva">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                        <v-text-field dense type="date" v-model="demandaInducida.fecha_registro"
                            label="Registra la fecha de la demanda inducida" :error-messages="errors.fecha_registro">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="7">
                        <v-autocomplete dense :items="tiposDemandaInducida"
                            v-model="demandaInducida.tipo_demanda_inducida" label="Tipo demanda inducida"
                            :error-messages="errors.tipo_demanda_inducida">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="5">
                        <v-autocomplete dense :items="programaDemandaInducida"
                            v-model="demandaInducida.programa_remitido" label="Programa de demanda inducida"
                            :error-messages="errors.programa_remitido">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="5" v-if="demandaInducida.programa_remitido == 'RIESGO CARDIOVASCULAR'">
                        <v-text-field type="date" v-model="demandaInducida.fecha_dx_riesgo_cardiovascular"
                            label="Fecha dx riesgo cardio vascular"
                            :error-messages="errors.fecha_dx_riesgo_cardiovascular">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="5" v-if="demandaInducida.programa_remitido == 'EVENTOS SALUD PUBLICA'">
                        <v-textarea type="string" v-model="demandaInducida.descripcion_evento_salud_publica"
                            label="Descripcion evento salud publica"
                            :error-messages="errors.descripcion_evento_salud_publica" auto-grow></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="5" v-if="demandaInducida.programa_remitido == 'OTROS PROGRAMAS'">
                        <v-textarea type="string" v-model="demandaInducida.descripcion_otro_programa"
                            label="Descripcion del otro programa" :error-messages="errors.descripcion_otro_programa"
                            auto-grow>
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea filled label="Observaciones" v-model="demandaInducida.observaciones"
                            :error-messages="errors.observaciones" auto-grow></v-textarea>
                    </v-col>
                    <template>
                        <v-row>
                            <v-spacer></v-spacer>
                            <v-col class="text-right" cols="12" sm="6" md="12">
                                <v-btn color="red" dark small @click="limpiarComponente()">Cerrar</v-btn>
                                <v-btn color="success" :loading="cargando" :disable="cargando" dark small
                                    @click="generarDemanda()">
                                    Generar demanda inducida
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>
                </v-col>
            </v-card-text>
        </v-card>

        <v-dialog v-model="crearAntecedente" max-width="900px" persistent>
            <v-card flat>
                <v-alert text color="info" icon="mdi-account-sync-outline"><b>Generar Antecedente Personal</b></v-alert>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <v-autocomplete outlined dense :items="cie10" item-value="id" item-text="nombre"
                                label="Antecedentes Personales" v-model="antePersonal.cie10_id" required>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                            <v-textarea outlined dense label="Escribir descripcion Antecedente Personal"
                                v-model="antePersonal.patologias" required auto-grow>
                            </v-textarea>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" small @click="cerrarDialog()" dark>Cerrar</v-btn>
                        <v-btn color="success" :loading="cargando" :disable="cargando" small
                            @click="guardarAntecedentePersonal()">
                            Guardar</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import {
    mapActions
} from "vuex";
import BuscarAfiliado from "@/components/afiliado/BuscarAfiliadoComponente.vue";

import {
    buscarAfiliado
} from "@/api/afiliados/afiliados";

import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    props: {
        ejecutar: Boolean
    },
    name: "FrontHorusDemandaInducida",
    components: {
        EditarAfiliadoComponente,
        BuscarAfiliado,
    },

    data() {
        return {
            reporte: false,
            preload: false,
            mostrarCampos: false,
            antecedentes: [],
            guardarAntecedente: [],
            cie10: [],
            search: "",
            loading: false,
            cargando: false,
            crearAntecedente: false,
            antecedentesPersonalesLista: [],
            demandaInducida: {
                fecha_dx_riesgo_cardiovascular: "",
                demanda_inducida_efectiva: "",
                tipo_demanda_inducida: "",
                programaDemandaInducida: "",
                observaciones: "",
                afiliado_id: "",
                fechaInicial: "",
                fechaFinal: "",
                descripcion_evento_salud_publica: "",
                descripcion_otro_programa: "",
                cie10s_id: "",
                fecha_registro: "",
                id: "",
            },
            antePersonal: {
                patologias: "",
                cie10_id: "",
                demanda_inducida_id: "",
                afiliado_id: "",
            },
            demandaInducidaId: null,
            tiposDemandaInducida: [
                "DEMANDA INDUCIDA TELEFONICA",
                "DEMANDA INDUCIDA PRESENCIAL",
                "REMITIDO POR MEDICO O ENFERMERA",
                "DEMANDA INDUCIDA ESPONTANEA",
                "REFERIDO GESTORES",
            ],
            datosBasicos: false,
            cedula_paciente: "",
            componenteAfiliado: false,
            componente: null,
            datos: [],
            documentos: [],

            errors: {
                demanda_inducida_efectiva: "",
                tipo_demanda_inducida: "",
                programa_remitido: "",
                fecha_dx_riesgo_cardiovascular: "",
                descripcion_evento_salud_publica: "",
                observaciones: "",
                fecha_registro: "",
            },

            headers: [{
                text: "Fecha",
                value: "created_at",
            },
            {
                text: "Médico",
                value: "medico",
                align: "center",
                sortable: false,
            },
            {
                text: "Antecedente",
                value: "patologias",
            },
            {
                text: "Diagnostico",
                value: "cie10",
            },
            ],
        };
    },

    computed: {
        programaDemandaInducida() {
            const edadAfiliado = this.datos.edad_cumplida;
            const sexoAfiliado = this.datos.sexo;

            if (edadAfiliado >= 0 && edadAfiliado <= 5) {
                return [
                    "VACUNACION",
                    "CONSULTA PRIMERA INFANCIA  (0-5 años)",
                    "CONTROL RECIEN NACIDO",
                    "SALUD ORAL",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ];
            } else if (edadAfiliado >= 6 && edadAfiliado <= 11) {
                return [
                    "VACUNACION",
                    "CONSULTA INFANCIA (6-11años)",
                    "SALUD ORAL",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ];
            } else if (
                edadAfiliado >= 12 &&
                edadAfiliado <= 17 &&
                sexoAfiliado === "M"
            ) {
                return [
                    "VACUNACION",
                    "CONSULTA ADOLESCENCIA (12-17 años)",
                    "SALUD ORAL",
                    "PRECONCEPCIONAL",
                    "PLANIFICACIÓN FAMILIAR",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ];
            } else if (
                edadAfiliado >= 12 &&
                edadAfiliado <= 17 &&
                sexoAfiliado === "F"
            ) {
                return [
                    "VACUNACION",
                    "CONSULTA ADOLESCENCIA (12-17 años)",
                    "PLANIFICACIÓN FAMILIAR",
                    "PRECONCEPCIONAL",
                    "CONTROL PRENATAL",
                    "CONSULTA NUTRICION PRENATAL",
                    "ASESORIA  LACTANCIA",
                    "CURSO PSICOPROFILACTICO",
                    "CITOLOGIA",
                    "CONTROL POSPARTO",
                    "SALUD ORAL",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ];
            } else if (
                edadAfiliado >= 18 &&
                edadAfiliado <= 28 &&
                sexoAfiliado === "M"
            ) {
                return [
                    "VACUNACION",
                    "CONSULTA JUVENTUD (18-28 años)",
                    "SALUD ORAL",
                    "PRECONCEPCIONAL",
                    "PLANIFICACIÓN FAMILIAR",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ];
            } else if (
                edadAfiliado >= 18 &&
                edadAfiliado <= 28 &&
                sexoAfiliado === "F"
            ) {
                return [
                    "VACUNACION",
                    "CONSULTA JUVENTUD (18-28 años)",
                    "SALUD ORAL",
                    "PLANIFICACIÓN FAMILIAR",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ]
            } else if (
                edadAfiliado >= 29 &&
                edadAfiliado <= 59 &&
                sexoAfiliado === "F"
            ) {
                return [
                    "VACUNACION",
                    "CONSULTA ADULTEZ (29-59 años)",
                    "PLANIFICACIÓN FAMILIAR",
                    "PRECONCEPCIONAL",
                    "CONTROL PRENATAL",
                    "CONSULTA NUTRICION PRENATAL",
                    "ASESORIA  LACTANCIA",
                    "CURSO PSICOPROFILACTICO",
                    "CITOLOGIA",
                    "MAMOGRAFIA",
                    "CONTROL POSPARTO",
                    "CONTROL RECIEN NACIDO",
                    "SALUD ORAL",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ];
            } else if (
                edadAfiliado >= 29 &&
                edadAfiliado <= 59 &&
                sexoAfiliado === "M"
            ) {
                return [
                    "VACUNACION",
                    "CONSULTA ADULTEZ (29-59 años)",
                    "PLANIFICACIÓN FAMILIAR",
                    "PRECONCEPCIONAL",
                    "CURSO PSICOPROFILACTICO",
                    "TAMIZAJE PROSTATA",
                    "SALUD ORAL",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ];
            } else if (edadAfiliado >= 60 && sexoAfiliado === "M") {
                return [
                    "VACUNACION",
                    'CONSULTA VEJEZ (60 años o más)',
                    "SALUD ORAL",
                    "PRECONCEPCIONAL",
                    "PLANIFICACIÓN FAMILIAR",
                    "TALLERES EDUCATIVOS",
                    "RIESGO CARDIOVASCULAR",
                    "EVENTOS SALUD PUBLICA",
                    "OTROS PROGRAMAS",
                ];
            } else if (edadAfiliado >= 60 && sexoAfiliado === "F") {
                return [
                    'VACUNACION',
                    'CONSULTA VEJEZ (60 años o más)',
                    'CITOLOGIA',
                    'MAMOGRAFIA',
                    'SALUD ORAL',
                    'TALLERES EDUCATIVOS',
                    'RIESGO CARDIOVASCULAR',
                    'EVENTOS SALUD PUBLICA',
                    'OTROS PROGRAMAS'
                ];
            }
            return [];
        },
    },

    mounted() {
        this.ListarCie10();
    },
    watch: {
        ejecutar: {
            handler(valor) {
                if (valor) {
                    this.$nextTick(() => {
                        this.$refs.buscarAfiliado.limpiarFormulario();
                    });
                }
            },
            immediate: true,
        }
    },

    methods: {
        ...mapActions("app", ["setPreload"]),
        generarDemanda() {
            this.cargando = true;
            this.demandaInducida["afiliado_id"] = this.datos.id;
            if (this.demandaInducida.demanda_inducida_efectiva === undefined) {
                this.demandaInducida.demanda_inducida_efectiva = false;
            } else {
                this.demandaInducida.demanda_inducida_efectiva = this.demandaInducida
                    .demanda_inducida_efectiva ?
                    true :
                    false;
            }
            this.$axios
                .post("demanda-inducidas/crear", this.demandaInducida)
                .then((res) => {
                    this.demandaId = res.data.id;
                    this.$toast.success("Se creo la demanda inducida correctamente");
                    this.cargando = false;
                    this.crearAntecedente = true;
                })
                .catch((e) => {
                    this.cargando = false;
                    console.log(e);
                    this.$toast.error("Error al crear la demanda inducida!");
                    if (
                        !this.demandaInducida.tipo_demanda_inducida ||
                        !this.demandaInducida.programa_remitido ||
                        !this.demandaInducida.observaciones
                    ) {
                        this.errors.tipo_demanda_inducida = !this.demandaInducida
                            .tipo_demanda_inducida ?
                            "¡Campo de tipo_demanda_inducida requerido!" :
                            null;
                        this.errors.programa_remitido = !this.demandaInducida
                            .programa_remitido ?
                            "¡Seleccione un tipo de educación!" :
                            null;
                        this.errors.observaciones = !this.demandaInducida.observaciones ?
                            "¡El campo de observaciones es requerido!" :
                            null;
                        this.errors.fecha_registro = !this.demandaInducida.fecha_registro ?
                            "¡El campo de fecha es requerido!" :
                            null;
                        return;
                    }
                });
        },

        formatearFecha(date) {
            return date.substring(0, 10);
        },

        guardarAntecedentePersonal() {
            this.cargando = true;
            this.antePersonal.afiliado_id = this.datos.id;
            this.antePersonal.demanda_inducida_id = this.demandaId;
            this.$axios
                .post("antecedentes-personales/guardar", this.antePersonal)
                .then((res) => {
                    this.cargando = false;
                    this.$toast.success("Antecedente guardado correctamente");
                    this.crearAntecedente = false;
                    this.cerrarDialog();
                })
                .catch((e) => {
                    this.cargando = false;
                    this.$toast.error("Error al guardar el antecedente personal");
                    console.error(e);
                });
        },

        cerrarDialog() {
            this.crearAntecedente = false;
            this.antePersonal = {
                patologias: "",
                cie10_id: "",
                demanda_inducida_id: "",
                afiliado_id: "",
            };
            (this.demandaInducida = {
                fecha_dx_riesgo_cardiovascular: "",
                demanda_inducida_efectiva: "",
                tipo_demanda_inducida: "",
                programaDemandaInducida: "",
                observaciones: "",
                afiliado_id: "",
                fechaInicial: "",
                fechaFinal: "",
                descripcion_evento_salud_publica: "",
                descripcion_otro_programa: "",
                cie10s_id: "",
                fecha_registro: "",
            }),
                this.listarAntecedentes(this.datos.numero_documento);
        },
        limpiarComponente() {
            this.componente = null;
            this.datos = {};
            this.mostrarCampos = false;
            this.cedula_paciente = "";
            this.demandaInducida = {
                demanda_inducida_efectiva: null,
                tipo_demanda_inducida: null,
                programa_remitido: null,
                observaciones: "",
            };
            this.errors = {
                demanda_inducida_efectiva: "",
                tipo_demanda_inducida: "",
                programa_remitido: "",
                observaciones: "",
            };
        },

        realizarBusqueda(cedula, tipoDocumento) {
            this.$loadingGetRequest(buscarAfiliado(cedula, tipoDocumento))
                .then((res) => {
                    this.componente = "EditarAfiliadoComponente";
                    this.componenteAfiliado = true;
                    this.mostrarCampos = true;
                    this.datos = res.data;
                    this.listarAntecedentes(cedula);
                    this.editar = true;
                    this.preload = false;
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.error);
                    this.limpiarComponente();
                });
        },

        listarAntecedentes(numero_documento) {
            this.loading = true;
            this.$axios
                .get(`antecedentes-personales/listarAntecedente/${numero_documento}`)
                .then((res) => {
                    this.loading = false;
                    this.antecedentesPersonalesLista = res.data;
                })
                .catch((e) => {
                    this.loading = false;
                    this.$toast.error("error al listar los antecedentes del afiliado");
                });
        },

        async ListarCie10() {
            const response = await fetch("/cie10s.json");
            const data = await response.json();

            this.cie10 = data.map(item => {
                return {
                    id: item.id - 1,
                    nombre: `${item.codigo_cie10} - ${item.nombre}`,
                }
            });
        }

    },
};

</script>

<style scoped>
.text-right {
    text-align: right;
}
</style>

<style lang="scss" scoped></style>
