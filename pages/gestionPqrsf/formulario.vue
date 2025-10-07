<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Registrar PQRF</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formBuscarAfiliado">
                    <v-row>
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

                <v-row v-if="afiliado">
                    <v-col cols="12" md="12" sm="12">
                        <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" />
                    </v-col>
                </v-row>

                <v-form ref="formRegistrarPqrsf">
                    <v-row v-if="afiliado">
                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense border="left" type="info" icon="mdi-form-select" class="text-center">
                                <v-row dense align="center">
                                    <v-col class="grow">
                                        <b>Registrar PQRF</b>
                                    </v-col>
                                    <v-col class="shrink">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn color="primary" small dark v-on="on" v-bind="attrs"
                                                    @click="abrirModalHistoricoPQRFs()">
                                                    Histórico
                                                    <v-icon right>mdi-timeline-clock-outline</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Ver Histórico de PQRSF</span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                            <v-select dense v-model="formRegistro.quien_genera" :items="opcionesQuienGenera"
                                label="¿Quién Genera? *" outlined :rules="[rules.obligatorio]"></v-select>
                        </v-col>
                        <v-col cols="12" md="4" sm="6" v-if="formRegistro.quien_genera === 'Otro'">
                            <v-text-field dense v-model="formRegistro.nombre_genera" label="Nombre Completo *" outlined
                                :rules="[rules.obligatorio]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6" v-if="formRegistro.quien_genera === 'Otro'">
                            <v-text-field dense v-model="formRegistro.documento_genera" label="N° de Documento *"
                                outlined :rules="[rules.obligatorio]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field dense v-model="formRegistro.correo" label="Correo Electrónico *" outlined
                                :rules="[rules.obligatorio, rules.correoValido]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field dense v-model="formRegistro.telefono" label="Teléfono o Celular *" outlined
                                :rules="[rules.obligatorio]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                            <v-autocomplete dense v-model="formRegistro.tipo_solicitud_id"
                                label="Tipo de Requerimiento *" outlined :loading="loading.opcionesTiposSolicitud"
                                :items="opcionesTiposSolicitud" item-text="nombre" item-value="id"
                                :rules="[rules.obligatorio]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                            <v-autocomplete dense v-model="formRegistro.canal_id" label="Canal de Ingreso *" outlined
                                :loading="loading.opcionesCanales" :items="opcionesCanales" item-text="nombre"
                                item-value="id" :rules="[rules.obligatorio]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                            <v-file-input dense outlined v-model="formRegistro.adjuntos" label="Adjuntar Archivos"
                                counter show-size append-icon="mdi-paperclip" prepend-icon="" multiple clearable
                                small-chips accept=".jpg, .jpeg, ,.png, .pdf" :rules="[rules.fileSize]"></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea dense outlined v-model="formRegistro.descripcion" auto-grow
                                label="Descripción del Caso *" :rules="[rules.obligatorio, rules.min]"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-checkbox v-model="ley1581"
                                label="Con el diligenciamiento de este formato autorizo expresamente el uso de mis datos personales según ley 1581 de 2012"
                                color="success" value="success" hide-details></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-alert v-if="!ley1581" type="warning" dense text border="left" icon="mdi-alert">
                                Debe autorizar el uso de sus datos personales para continuar.
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" align="right">
                            <v-btn small dark color="warning" @click="limpiarFormulario()">Limpiar Formulario</v-btn>
                            <v-btn small dark color="success" @click="enviarFormulario()"
                                :disabled="!ley1581">Enviar</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Modal Historico PQRFs -->
        <modalHistoricoPqrf :mostrarModalHistorico.sync="mostrarModalHistorico" :afiliado="afiliadoSeleccionado" />
    </div>
</template>

<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import modalHistoricoPqrf from "@/components/pqrsf/modalHistoricoPqrf.vue";

export default {
    components: {
        EditarAfiliadoComponente,
        modalHistoricoPqrf,
    },
    data() {
        return {
            loading: {
                tiposDocumentos: false,
                opcionesTiposSolicitud: false,
                opcionesCanales: false,
            },
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            tiposDocumentos: [],
            afiliado: null,
            mostrarModalHistorico: false,
            afiliadoSeleccionado: {},
            formRegistro: {
                quien_genera: "",
                nombre_genera: "",
                documento_genera: "",
                correo: "",
                telefono: "",
                tipo_solicitud_id: null,
                canal_id: null,
                descripcion: "",
                adjuntos: [],
            },
            rules: {
                obligatorio: function (v) {
                    return !!v || "Este campo es obligatorio.";
                },
                min: function (v) {
                    return (
                        (v && v.length >= 10) ||
                        "Este campo debe tener al menos 10 caracteres"
                    );
                },
                fileSize: function (files) {
                    if (!files || !files.length) return true;
                    for (let file of files) {
                        if (file.size > 1073741824) {
                            return "Cada archivo no debe superar 1GB";
                        }
                    }
                    return true;
                },
                correoValido: (v) =>
                    this.emailRegex.test(v) || "Debe ser un correo válido",
            },

            emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            opcionesQuienGenera: ["Usuario", "Otro"],
            opcionesTiposSolicitud: [],
            opcionesCanales: [],
            ley1581: false,
        };
    },
    mounted() {
        this.listarTiposDocumentos();
        this.avisoInicial();
        this.listarTiposSolicitudes();
        this.listarCanalesPQRSF();
    },
    watch: {
        "formRegistro.tipo_solicitud_id": function (newVal) {
            if (newVal) {
                const tipoSolicitud = this.opcionesTiposSolicitud.find(
                    (solicitud) => solicitud.id === newVal
                );
                if (tipoSolicitud) {
                    // Mostrar el alert con el nombre y la descripción
                    this.$swal({
                        icon: "info",
                        title: tipoSolicitud.nombre,
                        text: tipoSolicitud.descripcion || "Descripción no disponible",
                        confirmButtonText: "OK",
                    });
                }
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        avisoInicial() {
            return this.$swal({
                type: "info",
                title: "Estimado Usuario",
                text: "Le recordamos que para recibir una respuesta a su solicitud, es imprescindible proporcionar un correo electrónico válido. De no hacerlo, deberá gestionar su trámite a través de los canales presenciales. Además, le recomendamos actualizar de manera continua sus datos personales en su centro de atención primaria avanzada, ya que esto es de suma importancia.",
            });
        },

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

        consultarAfiliado() {
            if (!this.$refs.formBuscarAfiliado.validate()) {
                this.$toast.error(
                    "Por favor ingrese el tipo de documento y el número de documento."
                );
                return;
            }

            this.afiliado = null;
            this.afiliadoSeleccionado = {};
            this.setPreload(true);
            this.$axios
                .get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                )
                .then((res) => {
                    this.afiliado = res.data;

                    this.abrirModalHistoricoPQRFs();
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
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;

            this.$refs.formBuscarAfiliado.resetValidation();
            this.limpiarFormulario();
        },

        abrirModalHistoricoPQRFs() {
            this.mostrarModalHistorico = true;
            this.afiliadoSeleccionado = this.afiliado;
        },

        listarTiposSolicitudes() {
            this.loading.opcionesTiposSolicitud = true;
            this.$axios
                .get("/tipos-solicitudes-pqrsf/listar")
                .then((res) => {
                    this.opcionesTiposSolicitud = res.data.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los tipos de solicitudes.");
                })
                .finally(() => {
                    this.loading.opcionesTiposSolicitud = false;
                });
        },

        listarCanalesPQRSF() {
            this.loading.opcionesCanales = true;
            this.$axios
                .post("/canales-pqrsf/listarTodos")
                .then((res) => {
                    this.opcionesCanales = res.data;
                })
                .catch(() => {
                    this.$toast.error("Error al cargar los canales");
                })
                .finally(() => {
                    this.loading.opcionesCanales = false;
                });
        },

        enviarFormulario() {
            if (!this.$refs.formRegistrarPqrsf.validate()) {
                return;
            }

            const formData = new FormData();

            formData.append("quien_genera", this.formRegistro.quien_genera);
            if (this.formRegistro.quien_genera === "Otro") {
                formData.append("nombre_genera", this.formRegistro.nombre_genera);
                formData.append("documento_genera", this.formRegistro.documento_genera);
            }
            formData.append("correo", this.formRegistro.correo);
            formData.append("telefono", this.formRegistro.telefono);
            formData.append("tipo_solicitud_id", this.formRegistro.tipo_solicitud_id);
            formData.append("canal_id", this.formRegistro.canal_id);
            formData.append("descripcion", this.formRegistro.descripcion);
            for (let file = 0; file < this.formRegistro.adjuntos.length; file++) {
                formData.append("adjuntos[]", this.formRegistro.adjuntos[file]);
            }

            formData.append("afiliado_id", this.afiliado.id);
            formData.append("documento", this.afiliado.numero_documento);
            formData.append("usuario_registra_id", this.$store.state.auth.usuario.id);
            formData.append("estado_id", 10);

            this.setPreload(true);

            this.$axios
                .post("/formularios-pqrsf/crear", formData)
                .then((res) => {
                    this.$toast.success("PQRF creado con éxito");
                    this.limpiarFormulario();
                    this.$swal({
                        type: "success",
                        title: "¡Éxito!",
                        text: `Sr(a) su solicitud fue radicada con éxito N° de radicado ${res.data}. La respuesta será enviada a su correo electrónico dando cumplimiento a los tiempos de oportunidad establecidos por SUMIMEDICAL S.A.S.`,
                    });
                })
                .catch((error) => {
                    this.$toast.error("Error al crear el PQRF");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarFormulario() {
            this.formRegistro = {
                quien_genera: "",
                nombre_genera: "",
                documento_genera: "",
                correo: "",
                telefono: "",
                tipo_solicitud_id: null,
                canal_id: null,
                descripcion: "",
                adjuntos: [],
            };

            this.ley1581 = false;

            this.$refs.formRegistrarPqrsf.resetValidation();
        },
    },
};
</script>
