<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Ingreso</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-container fluid>
                <!-- Buscar Afiliado -->
                <v-row dense>
                    <v-col cols="12" md="4" sm="4">
                        <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
                            :loading="loading.tipo_documento" no-data-text="No hay resultados" item-value="id"
                            item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento" />
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-text-field dense outlined label="Número Documento" @keyup.enter="consultarAfiliado()"
                            v-model.trim="datosBuscarAfiliado.numero_documento" />
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-btn color="primary" dark @click="consultarAfiliado()" small>Consultar <v-icon right>
                                mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn color="red" dark @click="limpiarAfiliado()" small>Limpiar<v-icon right>mdi-close
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>

                <!-- Afiliado -->
                <v-row dense v-if="afiliado">
                    <v-col cols="12" md="12" sm="12">
                        <AfiliadoComponent :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
                    </v-col>
                </v-row>

                <!-- Registro de Concurrencia -->
                <v-card flat v-if="afiliado" class="mt-5">
                    <v-alert text dense border="left" type="info" icon="mdi-clipboard-account">Proceso de registro
                        ingreso
                        concurrencia
                    </v-alert>
                    <v-form ref="formRegistroConcurrencia" @submit.prevent="enviarFormulario">
                        <v-row dense class="px-5">
                            <v-col cols="12" md="4" sm="4">
                                <v-menu dense v-model="menuFechaIngreso" :close-on-content-click="false"
                                    :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="formIngresoConcurrencia.fecha_ingreso"
                                            label="Fecha de Ingreso *" readonly dense v-bind="attrs" v-on="on" :rules="[
                                                () =>
                                                    !!formIngresoConcurrencia.fecha_ingreso ||
                                                    'Este campo es requerido',
                                            ]"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="formIngresoConcurrencia.fecha_ingreso"
                                        @input="menuFechaIngreso = false">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete dense label="Diagnóstico de Ingreso *"
                                    v-model="formIngresoConcurrencia.diagnostico" :loading="loading.diagnostico"
                                    :search-input.sync="filtroDiagnostico" :items="diagnosticos"
                                    item-text="Codigo_Nombre" item-value="id"
                                    no-data-text="Por favor escriba el nombre del diagnóstico para iniciar la búsqueda"
                                    :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.diagnostico ||
                                            'Este campo es requerido',
                                    ]">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete dense label="Tipo de Hospitalización *"
                                    v-model="formIngresoConcurrencia.tipo_hospitalizacion"
                                    :items="opcionesTipoHospitalizacion" :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.tipo_hospitalizacion ||
                                            'Este campo es requerido',
                                    ]">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete dense label="Unidad Funcional *"
                                    v-model="formIngresoConcurrencia.unidad_funcional" :items="opcionesUnidadFuncional"
                                    :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.unidad_funcional ||
                                            'Este campo es requerido',
                                    ]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete dense label="Vía de Ingreso *"
                                    v-model="formIngresoConcurrencia.via_ingreso" :items="opcionesViaIngreso" :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.via_ingreso ||
                                            'Este campo es requerido',
                                    ]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete dense
                                    label="Reingreso de Hospitalización 15 días, por el mismo diagnóstico egreso *"
                                    v-model="formIngresoConcurrencia.reingreso_15_dias" :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.reingreso_15_dias ||
                                            'Este campo es requerido',
                                    ]" :items="opcionesReingreso"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete dense
                                    label="Reingreso de Hospitalización 30 días, por el mismo diagnóstico egreso *"
                                    v-model="formIngresoConcurrencia.reingreso_30_dias" :items="opcionesReingreso"
                                    :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.reingreso_30_dias ||
                                            'Este campo es requerido',
                                    ]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete dense label="Instituto de Atención *"
                                    v-model="formIngresoConcurrencia.instituto_atencion"
                                    :search-input.sync="filtroInstitucion" item-text="nombre" item-value="id" :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.instituto_atencion ||
                                            'Este campo es requerido',
                                    ]" no-data-text="Por favor escriba el nombre de la institución para iniciar la búsqueda"
                                    :loading="loading.instituto_atencion" :items="instituciones"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense label="Cama / Piso"
                                    v-model="formIngresoConcurrencia.cama_piso"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense label="Código Hospitalización"
                                    v-model="formIngresoConcurrencia.codigo_hospitalizacion"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense label="Estancia Total (Días)" :value="estanciaTotal"
                                    readonly></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete dense label="Especialidad Tratante *" :items="especialidades"
                                    v-model="formIngresoConcurrencia.especialidad_tratante" item-text="nombre"
                                    item-value="id" :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.especialidad_tratante ||
                                            'Este campo es requerido',
                                    ]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-textarea label="Nota de ingreso" v-model="formIngresoConcurrencia.nota_seguimiento"
                                    auto-grow :rules="[
                                        () =>
                                            !!formIngresoConcurrencia.nota_seguimiento ||
                                            'Este campo es requerido',
                                        () =>
                                            formIngresoConcurrencia.nota_seguimiento.length >= 10 ||
                                            'La nota de seguimiento debe tener al menos 10 caracteres',
                                    ]"></v-textarea>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" align="right">
                                <v-spacer></v-spacer>
                                <v-btn v-if="ingreso_concurrencia == null" small color="error"
                                    @click="limpiarFormulario()">Limpiar
                                    formulario <v-icon right>mdi-broom</v-icon>
                                </v-btn>
                                <v-btn v-if="ingreso_concurrencia == null" small color="success"
                                    @click="enviarFormulario()">Registrar
                                    ingreso <v-icon right>mdi-content-save-check-outline</v-icon>
                                </v-btn>
                                <v-btn v-if="ingreso_concurrencia != null" small color="warning"
                                    @click="actualizarIngreso(itemCreado)">
                                    Actualizar
                                    ingreso <v-icon right>mdi-update</v-icon>
                                </v-btn>
                                <v-col cols="12"></v-col>
                            </v-col>
                        </v-row>
                        <v-col cols="12" v-if="this.ingreso_concurrencia != null">
                            <ComplementoIngresoConcurrencia :IngresoConcurrencia="this.ingreso_concurrencia" />
                        </v-col>
                        <v-col cols="12" v-if="this.ingreso_concurrencia != null">
                            <OrdenamientoConcurrencia :IngresoConcurrencia="this.ingreso_concurrencia" />
                        </v-col>
                    </v-form>
                </v-card>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import {
    mapActions
} from "vuex";
import moment from "moment";
import ComplementoIngresoConcurrencia from '~/components/concurrencia/ComplementoIngresoConcurrencia.vue';
import OrdenamientoConcurrencia from '~/components/concurrencia/OrdenamientoConcurrencia.vue';

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("concurrencia.ingreso")) {
            return redirect("/");
        }
    },

    components: {
        AfiliadoComponent,
        ComplementoIngresoConcurrencia,
        OrdenamientoConcurrencia,
    },
    data() {
        return {
            loading: {
                tipo_documento: false,
                diagnostico: false,
                instituto_atencion: false,
                especialidades: false,
            },
            tiposDocumentos: [],
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            afiliado: null,
            datosBasicos: true,
            editar: true,
            menuFechaIngreso: false,
            formIngresoConcurrencia: {
                afiliado_id: null,
                fecha_ingreso: "",
                diagnostico: "",
                tipo_hospitalizacion: "",
                unidad_funcional: "",
                via_ingreso: "",
                reingreso_15_dias: "",
                reingreso_30_dias: "",
                instituto_atencion: "",
                cama_piso: "",
                codigo_hospitalizacion: "",
                estancia_total: "",
                especialidad_tratante: "",
                nota_seguimiento: "",
                user_id: this.$store.state.auth.usuario.id,
            },
            diagnosticos: [],
            filtroDiagnostico: "",
            opcionesTipoHospitalizacion: ["MÉDICA", "QUIRÚRGICA"],
            opcionesUnidadFuncional: [
                "HOSPITALIZACIÓN OBSTÉTRICA",
                "HOSPITALIZACIÓN",
                "INTERMEDIO ADULTO",
                "INTERMEDIO NEONATAL",
                "INTERMEDIO PEDRIATRÍA",
                "UCI ADULTO",
                "UCI NEONATAL",
                "UCI PEDRIATRÍA",
            ],
            opcionesViaIngreso: [
                "CONSULTA EXTERNA",
                "MEDICINA DOMICILIARIA",
                "PRIORITARIA",
                "PROGRAMADO",
                "REFERENCIA",
                "URGENCIAS",
                "TRASLADO NO REGULADO",
            ],
            opcionesReingreso: [
                "NO ES UN REINGRESO A HOSPITALIZACIÓN POR LA MISMA CAUSA ANTES DE 15 DÍAS",
                "ALTAS TEMPRANAS NO PERTINENTES",
                "ALTAS VOLUNTARIAS",
                "COMPLICACIÓN POSTERIOR A LA REALIZACIÓN DEL PROCEDIMIENTO",
                "DETERIORO DEL ESTADO CLÍNICO",
                "DISFUNCIONALIDAD DE CATÉTERES O SONDAS (PATOLOGÍAS CRÓNICAS)",
                "EVENTOS RELACIONADOS CON USO DE MEDICAMENTOS PRESCRITOS",
                "FALTA OPORTUNIDAD EN PROCEDIMIENTOS AMBULATORIOS POSTERIOR AL ALTA (DIFERIDAS)",
                "INFECCIÓN DE SITIO OPERATORIO - ISO",
                "NO ADHERENCIA AL TRATAMIENTO POR PARTE DEL PACIENTE",
                "NO DISPENSACIÓN DEL MEDICAMENTO POSTERIOR AL ALTA",
                "NO INGRESO A PROGRAMAS NI CAPTACIÓN DE GESTIÓN RIESGO POSTERIOR AL ALTA",
            ],
            filtroInstitucion: "",
            instituciones: [],
            especialidades: [],
            ingreso_concurrencia: null,
            itemCreado: '',
        };
    },
    computed: {
        estanciaTotal() {
            if (this.formIngresoConcurrencia.fecha_ingreso) {
                const fechaIngreso = moment(this.formIngresoConcurrencia.fecha_ingreso);
                const hoy = moment();
                return hoy.diff(fechaIngreso, "days");
            }
            return 0;
        },
    },
    watch: {
        filtroDiagnostico(newVal) {
            if (newVal && newVal.length === 4) {
                this.buscarDiagnostico();
            }
        },

        filtroInstitucion(newVal) {
            if (newVal && newVal.length === 4) {
                this.buscarInstituciones();
            }
        },
    },
    created() {
        this.listarTiposDocumentos();
        this.listarEspecialidades();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        listarTiposDocumentos() {
            (this.loading.tipo_documento = true),
                this.$axios
                    .get("/tipo-documento/listar")
                    .then((res) => {
                        this.tiposDocumentos = res.data;
                    })
                    .catch((error) => {
                        this.$toast.error(
                            "Ocurrió un error al cargar los tipos de documento"
                        );
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading.tipo_documento = false;
                    });
        },

        consultarAfiliado() {
            if (
                !this.datosBuscarAfiliado.numero_documento ||
                !this.datosBuscarAfiliado.tipo_documento
            ) {
                return this.$toast.error(
                    "Por favor ingrese el tipo de documento y el número de documento."
                );
            }

            this.setPreload(true);
            this.$axios
                .get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                )
                .then((res) => {
                    this.afiliado = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarAfiliado() {
            (this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            }),
                (this.afiliado = null);
        },

        buscarDiagnostico() {
            const data = {
                valor: this.filtroDiagnostico,
            };
            this.loading.diagnostico = true;
            this.$axios
                .post("cie10/listarFiltro", data)
                .then((res) => {
                    this.diagnosticos = res.data;
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al cargar los diagnósticos");
                    console.log(err);
                })
                .finally(() => {
                    this.loading.diagnostico = false;
                });
        },

        buscarInstituciones() {
            const data = {
                prestador: this.filtroInstitucion,
            };
            this.loading.instituto_atencion = true;
            this.$axios
                .post("reps/listar?page=0", data)
                .then((res) => {
                    this.instituciones = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
                        };
                    });
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar las instituciones");
                    console.log(error);
                })
                .finally(() => {
                    this.loading.instituto_atencion = false;
                });
        },
        listarEspecialidades() {
            this.loading.especialidades = true;
            this.$axios
                .post("especialidades/listarTodas")
                .then((res) => {
                    this.especialidades = res.data;
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al cargar las especialidades");
                    console.log(err);
                })
                .finally(() => {
                    this.loading.especialidades = false;
                });
        },

        enviarFormulario() {
            if (this.$refs.formRegistroConcurrencia.validate()) {
                const formData = new FormData();

                formData.append("afiliado_id", this.afiliado.id);
                formData.append(
                    "fecha_ingreso",
                    this.formIngresoConcurrencia.fecha_ingreso
                );
                formData.append("cie10_id", this.formIngresoConcurrencia.diagnostico);
                formData.append(
                    "tipo_hospitalizacion",
                    this.formIngresoConcurrencia.tipo_hospitalizacion
                );
                formData.append(
                    "unidad_funcional",
                    this.formIngresoConcurrencia.unidad_funcional
                );
                formData.append(
                    "via_ingreso",
                    this.formIngresoConcurrencia.via_ingreso
                );
                formData.append(
                    "reingreso_15_dias",
                    this.formIngresoConcurrencia.reingreso_15_dias
                );
                formData.append(
                    "reingreso_30_dias",
                    this.formIngresoConcurrencia.reingreso_30_dias
                );
                formData.append(
                    "rep_id",
                    this.formIngresoConcurrencia.instituto_atencion
                );
                formData.append("cama_piso", this.formIngresoConcurrencia.cama_piso);
                formData.append(
                    "codigo_hospitalizacion",
                    this.formIngresoConcurrencia.codigo_hospitalizacion
                );
                formData.append("estancia_total", this.estanciaTotal);
                formData.append(
                    "especialidad_id",
                    this.formIngresoConcurrencia.especialidad_tratante
                );
                formData.append(
                    "nota_seguimiento",
                    this.formIngresoConcurrencia.nota_seguimiento
                );
                formData.append(
                    "user_id",
                    this.formIngresoConcurrencia.user_id
                );

                this.setPreload(true);

                this.$axios.post("concurrencia/crearIngreso", formData).then((res) => {
                    this.$toast.success("Concurrencia registrada con éxito");
                    this.ingreso_concurrencia = res.data.id;
                    this.setPreload(false);
                    // this.limpiarFormulario();
                    // this.limpiarAfiliado();
                }).catch((error) => {
                    this.$toast.error("Ocurrió un error al registrar la concurrencia");
                    console.log(error);
                }).finally(() => {
                    this.setPreload(false);
                })
            } else {
                this.$toast.error("Por favor complete los campos obligatorios");
            }
        },

        actualizarIngreso(itemCreado) {
            itemCreado = this.ingreso_concurrencia
            this.formIngresoConcurrencia.id = itemCreado,
                this.formIngresoConcurrencia.afiliado_id = this.afiliado.id,
                this.formIngresoConcurrencia.cie10_id = this.formIngresoConcurrencia.diagnostico,
                this.formIngresoConcurrencia.especialidad_id = this.formIngresoConcurrencia.especialidad_tratante,
                this.formIngresoConcurrencia.rep_id = this.formIngresoConcurrencia.instituto_atencion,
                this.formIngresoConcurrencia.estancia_total = this.estanciaTotal.toString(),
                this.$axios.put("concurrencia/actualizar", this.formIngresoConcurrencia).then((res) => {
                    return this.$toast.success('se ha actualizado el registro de ingreso correctamente!.')
                })
                    .catch((err) => {
                        this.$toast.error("Ocurrió un error al actualizar el reporte de ingreso");
                        console.log(err);
                    })
        },

        limpiarFormulario() {
            this.formIngresoConcurrencia = {
                fecha_ingreso: "",
                diagnostico: "",
                tipo_hospitalizacion: "",
                unidad_funcional: "",
                via_ingreso: "",
                reingreso_15_dias: "",
                reingreso_30_dias: "",
                instituto_atencion: "",
                cama_piso: "",
                codigo_hospitalizacion: "",
                estancia_total: "",
                especialidad_tratante: "",
                nota_seguimiento: "",
            };
        },
    },
};

</script>
