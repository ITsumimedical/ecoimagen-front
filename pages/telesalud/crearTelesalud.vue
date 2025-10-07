<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Crear - Telesalud</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formBuscarAfiliado">
                    <v-row dense>
                        <v-col cols="12" md="5" sm="12">
                            <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
                                :loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id"
                                item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento"
                                hint="Ingresa el tipo de documento del afiliado"
                                :rules="[(v) => !!v || 'Este campo es requerido']" />
                        </v-col>
                        <v-col cols="12" md="5" sm="12">
                            <v-text-field dense outlined label="Número Documento" @keyup.enter="consultarAfiliado()"
                                v-model.trim="datosBuscarAfiliado.numero_documento"
                                hint="Ingresa el número de documento del afiliado"
                                :rules="[(v) => !!v || 'Este campo es requerido']" />
                        </v-col>
                        <v-col cols="12" md="2" sm="12" style="display: flex; gap: 0.2rem">
                            <v-btn color="primary" dark @click="consultarAfiliado()"
                                style="min-width: fit-content">Consultar <v-icon right>mdi-magnify</v-icon></v-btn>
                            <v-btn color="red" dark @click="limpiarAfiliado()"
                                style="min-width: fit-content">Limpiar<v-icon right>mdi-close</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <v-row v-if="afiliado" dense>
                    <v-col cols="12" sm="12" md="12">
                        <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" />
                    </v-col>
                </v-row>
                <v-form ref="formCrearTelesalud" v-if="afiliado" class="mt-5">
                    <v-row dense>
                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense border="left" type="info" icon="mdi-bottle-tonic-plus-outline"
                                class="text-center">
                                <b>Generar Telesalud</b>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="4" sm="12">
                            <v-autocomplete dense outlined label="Tipo de Estrategia *" :items="opcionesTiposEstrategia"
                                :loading="loading.tiposEstrategia" no-data-text="No hay resultados" item-value="id"
                                item-text="nombre" v-model="formTelesalud.tipo_estrategia_id"
                                :rules="[rules.obligatorio]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4" sm="12">
                            <v-autocomplete dense outlined label="Tipo de Solicitud *" :items="opcionesTiposSolicitud"
                                :loading="loading.tiposSolicitudes" no-data-text="No hay resultados" item-value="id"
                                item-text="nombre" v-model="formTelesalud.tipo_solicitud_id"
                                :rules="[rules.obligatorio]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4" sm="12">
                            <v-autocomplete dense outlined label="Especialidad *" :items="opcionesEspecialidades"
                                :loading="loading.especialidades" no-data-text="No hay resultados" item-value="id"
                                item-text="nombre" v-model="formTelesalud.especialidad_id"
                                :rules="[rules.obligatorio]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6" sm="12">
                            <v-textarea dense outlined label="Motivo *" v-model="formTelesalud.motivo"
                                :rules="[rules.obligatorio, rules.min]" hint="Ingrese el motivo de la solicitud."
                                auto-grow></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" sm="12">
                            <v-textarea dense outlined label="Resumen de la Historia Clínica *"
                                v-model="formTelesalud.resumen_hc" :rules="[rules.obligatorio, rules.min]"
                                hint="Ingrese el resumen de la historia clinica del afiliado." auto-grow></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" sm="12">
                            <v-autocomplete dense outlined label="Diagnostico Principal *"
                                :items="opcionesDiagnosticoPrincipal" :loading="loading.diagnosticoPrincipal"
                                :rules="[rules.obligatorio]"
                                no-data-text="Ingrese el nombre del diagnóstico para iniciar la búsqueda"
                                item-text="Codigo_Nombre" item-value="id" chips clearable small-chips
                                :search-input.sync="campoBusquedaDiagnosticoPrincipal"
                                v-model="formTelesalud.diagnostico_principal_id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6" sm="12">
                            <v-autocomplete dense outlined label="Diagnósticos Secundarios"
                                :items="opcionesDiagnosticos" :loading="loading.diagnosticos"
                                no-data-text="Ingrese el nombre del diagnóstico para iniciar la búsqueda"
                                item-text="Codigo_Nombre" item-value="id" multiple chips deletable-chips clearable
                                small-chips :search-input.sync="campoBusquedaDiagnostico"
                                v-model="formTelesalud.diagnosticos_ids"
                                :rules="[rules.noDuplicadoConPrincipal]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-file-input dense outlined label="Adjuntar Archivos" v-model="formTelesalud.adjuntos"
                                multiple show-size chips prepend-icon="" append-icon="mdi-paperclip" small-chips
                                clearable deletable-chips accept=".pdf, .jpg, .jpeg, .png" counter
                                :rules="[rules.fileSize]"></v-file-input>
                        </v-col>

                        <v-col cols="12" sm="12" md="12">
                            <v-checkbox v-model="ley1581" color="info" dense :rules="[rules.ley1581]"
                                label="Con el diligenciamiento de este formato autorizo expresamente el uso de mis datos personales según Ley 1581 de 2012.">
                            </v-checkbox>
                        </v-col>

                        <v-col cols="12" sm="12" md="12" align="right">
                            <v-btn color="warning" small dark @click="limpiarFormulario()">Limpiar Formulario</v-btn>
                            <v-btn color="success" small dark @click="crearTelesalud()">Guardar</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Ordenamiento  -->
        <Ordenamiento :consulta="consultaSeleccionada" :habilitarBoton="false" :dialog="mostrarOrdenamiento"
            @respuestaComponente="cerrarOrdenamiento" />
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import Ordenamiento from "~/components/ordenamiento/ordenamiento.vue";

export default {
    middleware({ $can, redirect }) {
        if (!$can("telesalud.crear")) {
            return redirect("/");
        }
    },
    components: {
        EditarAfiliadoComponente,
        Ordenamiento,
    },
    data() {
        return {
            tiposDocumentos: [],
            loading: {
                tiposDocumentos: false,
                tiposEstrategia: false,
                tiposSolicitudes: false,
                especialidades: false,
                diagnosticos: false,
                diagnosticoPrincipal: false,

            },
            datosBuscarAfiliado: {
                tipo_documento: null,
                numero_documento: null,
            },
            afiliado: null,
            formTelesalud: {
                tipo_estrategia_id: null,
                tipo_solicitud_id: null,
                especialidad_id: null,
                motivo: "",
                resumen_hc: "",
                diagnostico_principal_id: null,
                diagnosticos_ids: [],
                adjuntos: [],
            },
            rules: {
                obligatorio: (v) =>
                    (v !== null && v !== undefined && v !== "") ||
                    "Este campo es obligatorio.",
                min: (v) =>
                    v.length >= 10 || "Este campo debe tener al menos 10 caracteres",
                fileSize: (files) => {
                    if (!files || !files.length) return true;
                    for (let file of files) {
                        if (file.size > 1073741824) {
                            return "Cada archivo no debe superar 1GB";
                        }
                    }
                    return true;
                },
                ley1581: (v) =>
                    !!v || "Debe aceptar la ley de tratamiento de datos personales.",
                diagnostico: (v) =>
                    (v && v.length > 0) || "Debe ingresar al menos un diagnóstico.",
                noDuplicadoConPrincipal: (v) => {
                    if (!v) return true;
                    if (v.includes(this.formTelesalud.diagnostico_principal_id)) {
                        return "Uno de los diagnósticos ya fue seleccionado como principal.";
                    }
                    return true;
                },
            },
            opcionesTiposEstrategia: [],
            opcionesTiposSolicitud: [],
            opcionesEspecialidades: [],
            opcionesDiagnosticos: [],
            opcionesDiagnosticoPrincipal: [],
            campoBusquedaDiagnostico: null,
            campoBusquedaDiagnosticoPrincipal: null,
            ley1581: false,
            mostrarOrdenamiento: false,
            consultaSeleccionada: null,
        };
    },



    mounted() {
        this.listarTiposDocumentos();
    },

    watch: {
        campoBusquedaDiagnostico(newValue) {
            if (newValue && newValue.length >= 3) {
                this.listarOpcionesDiagnosticos();
            }
        },
        campoBusquedaDiagnosticoPrincipal(newValue) {
            if (newValue && newValue.length >= 3) {
                this.listarOpcionesDiagnosticoPrincipal();
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        listarTiposDocumentos() {
            this.loading.tiposDocumentos = true;
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
                    this.loading.tiposDocumentos = false;
                });
        },

        async consultarAfiliado() {
            try {
                if (!this.$refs.formBuscarAfiliado.validate()) {
                    this.$toast.error(
                        "Por favor ingrese el tipo de documento y el número de documento."
                    );
                    return;
                }

                this.afiliado = null;
                this.setPreload(true);

                const res = await this.$axios.get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                );

                this.afiliado = res.data;
                this.listarOpcionesTiposEstrategia();
                this.listarTiposSolicitud();
                this.listarOpcionesEspecialidades();
            } catch (error) {
                this.$toast.error(
                    "El afiliado no se encuentra registrado en la base de datos."
                );
                console.log(error);
            } finally {
                this.setPreload(false);
            }
        },

        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;

            this.$refs.formBuscarAfiliado.resetValidation();

            this.limpiarFormulario();
        },

        listarOpcionesTiposEstrategia() {
            this.loading.tiposEstrategia = true;
            this.$axios
                .get("/tipo-estrategia-telesalud/listarActivos")
                .then((res) => {
                    this.opcionesTiposEstrategia = res.data.data;
                })
                .catch((error) => {
                    "Ocurrió un error al cargar los tipos de estrategia";
                })
                .finally(() => {
                    this.loading.tiposEstrategia = false;
                });
        },

        listarTiposSolicitud() {
            this.loading.tiposSolicitudes = true;
            this.$axios
                .get("/tipo-solicitud/listarActivos")
                .then((res) => {
                    this.opcionesTiposSolicitud = res.data.data;
                })
                .catch(() => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de solicitudes"
                    );
                })
                .finally(() => {
                    this.loading.tiposSolicitudes = false;
                });
        },

        listarOpcionesEspecialidades() {
            this.loading.especialidades = true;
            this.$axios
                .post("/especialidades/listarEspecialidadesTelesalud")
                .then((res) => {
                    this.opcionesEspecialidades = res.data
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar las especialidades");
                })
                .finally(() => {
                    this.loading.especialidades = false;
                });
        },

        listarOpcionesDiagnosticos() {
            this.loading.diagnosticos = true;
            this.$axios
                .post("/cie10/listarFiltro", {
                    valor: this.campoBusquedaDiagnostico,
                })
                .then((res) => {
                    this.opcionesDiagnosticos = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar los diagnosticos");
                })
                .finally(() => {
                    this.loading.diagnosticos = false;
                });
        },

        listarOpcionesDiagnosticoPrincipal() {
            this.loading.diagnosticoPrincipal = true;
            this.$axios
                .post("/cie10/listarFiltro", {
                    valor: this.campoBusquedaDiagnosticoPrincipal,
                })
                .then((res) => {
                    this.opcionesDiagnosticoPrincipal = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar los diagnosticos");
                })
                .finally(() => {
                    this.loading.diagnosticoPrincipal = false;
                });
        },

        async crearTelesalud() {
            if (!this.$refs.formCrearTelesalud.validate()) {
                return;
            }

            const formData = new FormData();

            formData.append(
                "tipo_solicitud_id",
                this.formTelesalud.tipo_solicitud_id
            );
            formData.append(
                "tipo_estrategia_id",
                this.formTelesalud.tipo_estrategia_id
            );
            formData.append("especialidad_id", this.formTelesalud.especialidad_id);
            formData.append("motivo", this.formTelesalud.motivo);
            formData.append("resumen_hc", this.formTelesalud.resumen_hc);
            formData.append("afiliado_id", this.afiliado.id);
            formData.append("numero_documento", this.afiliado.numero_documento);
            formData.append(
                "diagnostico_principal",
                this.formTelesalud.diagnostico_principal_id
            );

            if (this.formTelesalud.diagnosticos_ids.length > 0) {
                for (let i = 0; i < this.formTelesalud.diagnosticos_ids.length; i++) {
                    formData.append(
                        "diagnosticos[]",
                        this.formTelesalud.diagnosticos_ids[i]
                    );
                }
            }

            if (this.formTelesalud.adjuntos.length > 0) {
                for (let i = 0; i < this.formTelesalud.adjuntos.length; i++) {
                    formData.append("adjuntos[]", this.formTelesalud.adjuntos[i]);
                }
            }

            try {
                this.setPreload(true);
                const res = await this.$axios.post(
                    "/telesalud/crearTelesalud",
                    formData
                );

                this.$swal.fire({
                    title: "Éxito",
                    text: `Telesalud registrada correctamente, su número de identificación es ${res.data.data.id}`,
                    type: "success",
                    confirmButtonText: "Ok",
                });

                if ([1, 4].includes(this.formTelesalud.tipo_estrategia_id)) {
                    this.consultaSeleccionada = res.data.data.consulta_id;
                    this.abrirOrdenamiento();
                }

                this.limpiarFormulario();
            } catch (error) {
                if (error.response.data.error = 'Especialidad no válida') {
                    this.$toast.error('La especialidad seleccionda no tiene un servicio asociado, por favor parametrizar la especialidad')
                } else {
                    this.$toast.error("Ocurrio un error al registrar la Telesalud");
                }
            } finally {
                this.setPreload(false);
            }
        },

        limpiarFormulario() {
            this.formTelesalud = {
                tipo_estrategia_id: null,
                tipo_solicitud_id: null,
                especialidad_id: null,
                motivo: "",
                resumen_hc: "",
                diagnosticos_ids: [],
                adjuntos: [],
                diagnostico_principal_id: null,
            };

            this.ley1581 = false;

            this.$refs.formCrearTelesalud.resetValidation();
        },

        abrirOrdenamiento() {
            this.mostrarOrdenamiento = true;
        },

        cerrarOrdenamiento() {
            this.mostrarOrdenamiento = false;
        },
    },
};
</script>
