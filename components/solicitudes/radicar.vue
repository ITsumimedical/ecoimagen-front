<template>
    <div>
        <!-- Diálogo Informativo -->
        <v-dialog v-model="dialogoInformativo" persistent max-width="900px">
            <v-card>
                <v-alert border="left" color="blue-grey" dense text icon="mdi-information-variant">
                    <b>Información</b>
                </v-alert>
                <v-card-text>
                    <p class="text-body-1">
                        Señor afiliado, debe tener en cuenta que para su solicitud debe
                        facilitar los siguientes archivos:
                    </p>
                    <v-list dense>
                        <v-list-item v-for="archivo in archivosRequeridos" :key="archivo">
                            <v-list-item-icon>
                                <v-icon color="primary">mdi-file-document-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title class="text-body-1">{{ archivo }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-alert border="left" dense text type="warning" icon="mdi-information-box"
                        v-if="tipoSolicitudSeleccionada === 26">
                        <p class="text-subtitle-1">
                            Estos archivos pueden variar dependiendo del tipo de Beneficiario
                            a registrar.
                        </p>
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="dialogoInformativo = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-row dense v-if="panelBusqueda">
            <v-card>
                <v-alert border="left" class="text-center" dense text type="info" icon="mdi-account-search">
                    <b>Buscar Afiliado</b>
                </v-alert>
                <v-card-text>
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="5">
                                <v-autocomplete dense outlined :loading="loading.tipoDocumento"
                                    :items="opcionesTipoDocumento" item-text="nombre" item-value="id"
                                    v-model="formBuscarAfiliado.tipo_documento" label="Tipo de Documento">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="5">
                                <v-text-field dense outlined v-model.trim="formBuscarAfiliado.numero_documento"
                                    label="N° de Documento" @keyup.enter="buscarAfiliado"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="2">
                                <v-btn small color="primary" @click="buscarAfiliado" style="width: 49%">Buscar</v-btn>
                                <v-btn small color="error" @click="limpiarAfiliado" style="width: 49%">Limpiar</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-row>

        <v-col cols="12" v-if="afiliado">
            <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                :mostrarClasificaciones="true" />
            <v-card>
                <v-container fluid>
                    <v-autocomplete dense outlined :loading="loading.tipoSolicitud"
                        :items="opcionesTipoSolicitudAfiliaciones" item-text="nombre" item-value="id"
                        v-model="tipoSolicitudSeleccionada" label="Tipo de solicitud a realizar">
                    </v-autocomplete>
                    <component :is="formularioActual" :afiliado="afiliado" :tipoSolicitud="tipoSolicitudSeleccionada"
                        @volver="volver"></component>
                </v-container>
            </v-card>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="info" @click="volver()">
                    <v-icon left>mdi-arrow-left</v-icon>Volver al panel anterior
                </v-btn>
            </v-card-actions>
        </v-col>
    </div>
</template>

<script>
import {
    mapActions
} from "vuex"
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import formCambioPuntoAtencion from "~/components/solicitudes/formCambioPuntoAtencion.vue";
import formTranscripcionMedicamentos from "~/components/solicitudes/formTranscripcionMedicamentos.vue";
import formTranscripcionIncapacidades from "~/components/solicitudes/formTranscripcionIncapacidades.vue";
import formTranscripcionServicios from "~/components/solicitudes/formTranscripcionServicios.vue";
import formTranscripcionOncologia from "~/components/solicitudes/formTranscripcionOncologia.vue";
import formRegistroBeneficiario from "~/components/solicitudes/formRegistroBeneficiario.vue";
import formTrasladoBeneficiario from "~/components/solicitudes/formTrasladoBeneficiario.vue";
import formRetiro from "~/components/solicitudes/formRetiro.vue";
import formActualizacionDatosBasicos from "~/components/solicitudes/formActualizacionDatosBasicos.vue";
import formCambioBeneficiario from "~/components/solicitudes/formCambioBeneficiario.vue";

export default {
    components: {
        EditarAfiliadoComponente,
        formRegistroBeneficiario,
        formCambioPuntoAtencion,
        formTranscripcionMedicamentos,
        formTranscripcionServicios,
        formTranscripcionOncologia,
        formTrasladoBeneficiario,
        formRetiro,
        formActualizacionDatosBasicos,
        formCambioBeneficiario,
        formTranscripcionIncapacidades,
    },
    props: ["docuemntoAfiliado", "panelBusqueda", "tipoDocumento"],
    data() {
        return {
            loading: {
                tipoDocumento: false,
                tipoSolicitud: false,
            },
            formBuscarAfiliado: {
                numero_documento: "",
                tipo_documento: "",
            },
            opcionesTipoDocumento: [],
            afiliado: null,
            opcionesTipoSolicitud: [],
            tipoSolicitudSeleccionada: null,
            formularios: {
                1: "formCambioPuntoAtencion",
                10: "formTranscripcionMedicamentos",
                11: "formTranscripcionIncapacidades",
                12: "formTranscripcionServicios",
                13: "formTranscripcionOncologia",
                26: "formRegistroBeneficiario",
                27: "formTrasladoBeneficiario",
                28: "formRetiro",
                29: "formActualizacionDatosBasicos",
                30: "formCambioBeneficiario",
            },
            dialogoInformativo: false,
            textoInformativo: "",
            archivosRequeridos: [],
        };
    },

    computed: {
        opcionesTipoSolicitudAfiliaciones() {
            return this.opcionesTipoSolicitud.filter((opcion) => {
                // Excluir opción 26 si el tipo_afiliado_id es 1 (Beneficiario)
                if (this.afiliado && this.afiliado.tipo_afiliado_id === 1 && opcion.id === 26) {
                    return false;
                }
                return (opcion.id);
            });
        },
        formularioActual() {
            return this.formularios[this.tipoSolicitudSeleccionada] || null;
        },
    },
    watch: {
        tipoSolicitudSeleccionada(nuevoValor) {
            if (nuevoValor) {
                this.mostrarDialogoInformativo(nuevoValor);
            }
        },
    },
    mounted() {
        this.listarTiposDocumento();
        if (this.docuemntoAfiliado) {
            this.buscarAfiliado();
        }
        this.listarTiposSolicitud();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        listarTiposDocumento() {
            this.loading.tipoDocumento = true;
            this.$axios
                .get("/tipo-documento/listar")
                .then((res) => {
                    this.opcionesTipoDocumento = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de documentos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tipoDocumento = false;
                });
        },

        buscarAfiliado() {
            if (this.docuemntoAfiliado) {
                this.setPreload(true);
                this.$axios
                    .get(`/afiliados/${this.docuemntoAfiliado}/${this.tipoDocumento}`)
                    .then((res) => {
                        this.afiliado = res.data;
                        this.avisoInicialAfiliado();
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al cargar el afiliado");
                        console.log(e);
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            } else {
                if (
                    this.formBuscarAfiliado.numero_documento === "" ||
                    this.formBuscarAfiliado.tipo_documento === ""
                ) {
                    return this.$toast.error(
                        "Debe ingresar un tipo de documento y un número de documento"
                    );
                }
                this.setPreload(true);
                this.$axios
                    .get(
                        `/afiliados/${this.formBuscarAfiliado.numero_documento}/${this.formBuscarAfiliado.tipo_documento}`
                    )
                    .then((res) => {
                        this.afiliado = res.data;
                        this.avisoInicialAfiliado();
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al cargar el afiliado");
                        console.log(e);
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            }
        },

        limpiarAfiliado() {
            this.afiliado = null;
            this.formBuscarAfiliado = {
                numero_documento: "",
                tipo_documento: "",
            };
        },

        avisoInicialAfiliado() {
            this.$swal({
                type: "info",
                title: "AVISO IMPORTANTE",
                text: "Señor usuario, recuerde que para recibir una respuesta a su solicitud, es importante mantener sus datos de contacto actualizados.",
            });
        },

        listarTiposSolicitud() {
            this.loading.tipoSolicitud = true;
            this.$axios
                .get("tipo-solicitud-red-vital/listarActivos")
                .then((res) => {
                    this.opcionesTipoSolicitud = res.data.map((tipoSolicitud) => {
                        return {
                            id: tipoSolicitud.id,
                            nombre: tipoSolicitud.nombre,
                        };
                    });
                })
                .catch((e) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de solicitudes."
                    );
                    console.log(e);
                })
                .finally(() => {
                    this.loading.tipoSolicitud = false;
                });
        },

        mostrarDialogoInformativo(tipoSolicitud) {
            const infoTiposSolicitud = {
                1: [
                    "Para COTIZANTES solo copia de su documento de identidad.",
                    "Para BENEFICIARIOS copia documento de identidad del cotizante y del beneficiario.",
                    "Formulario Único de Afiliación marcado en la opción Traslado, debidamente diligenciado y firmado por el cotizante.",
                ],
                10: ["Historia Clínica - Orden de la fórmula"],
                12: ["Adjuntar Historia Clínica - Soportes de Ayudas (Si Aplica)."],
                13: ["Adjuntar copia de la Historia Clínica - Órdenes a autorizar"],
                26: [
                    "Formato Integrado de Afiliación y Novedades Formato Fiduprevisora",
                    "Fotocopia legible del documento de identidad del Beneficiario. (RC hasta 7 años, TI de 7 a 17 y CC de 18 años en adelante)",
                    "Fotocopia legible de la cédula de ciudadanía del Docente.",
                    "Original o copia de Registro Civil del matrimonio.",
                    "Declaración del beneficiario sobre condición de trabajo o dependencia económica y afiliación a seguridad social, según formato de Fiduprevisora",
                    "Declaración juramentada de convivencia con compañero permanente",
                    "Original o copia de Registro Civil de nacimiento del beneficiario en donde conste el parentesco",
                    "Certificado de discapacidad por entidad competente Secretaría de Salud de su municipio, Junta Regional de su municipio o Ministerio de Salud",
                    "Original o copia de Registro Civil de nacimiento del Docente en donde conste el parentesco",
                    "Acta de entrega de custodia al Cotizante docente emitida por autoridad competente (Comisaría de Familia, ICBF o Juzgado)",
                ],
                27: [
                    "Formato Integrado de Afiliación y Novedades Formato Fiduprevisora",
                    "Fotocopia legible del documento de identidad del Beneficiario. (RC hasta 7 años, TI de 7 a 17 y CC de 18 años en adelante)",
                    "Fotocopia legible de la cédula de ciudadanía del Docente.",
                ],
                28: [
                    "Formato Integrado de Afiliación y Novedades Formato Fiduprevisora",
                    "Fotocopia legible del documento de identidad del Beneficiario. (RC hasta 7 años, TI de 7 a 17 y CC de 18 años en adelante)",
                    "Fotocopia legible de la cédula de ciudadanía del Docente.",
                ],
                29: [
                    "Formato Integrado de Afiliación y Novedades Formato Fiduprevisora",
                    "Fotocopia legible del documento de identidad del Beneficiario. (RC hasta 7 años, TI de 7 a 17 y CC de 18 años en adelante)",
                    "Fotocopia legible de la cédula de ciudadanía del Docente.",
                ],
                30: [
                    "Formato Integrado de Afiliación y Novedades Formato Fiduprevisora",
                    "Fotocopia legible del documento de identidad del Beneficiario. (RC hasta 7 años, TI de 7 a 17 y CC de 18 años en adelante)",
                    "Fotocopia legible de la cédula de ciudadanía del Docente.",
                ],
                11: [
                    "Historia clínica",
                    "Incapacidad",
                    "Soporte de la incapacidad",
                    "Fotocopia de la cedula",
                ],
            };

            this.archivosRequeridos = infoTiposSolicitud[tipoSolicitud] || [
                "Documentos requeridos no especificados.",
            ];
            this.dialogoInformativo = true;
        },

        volver() {
            this.limpiarAfiliado();
            this.tipoSolicitudSeleccionada = null;
            this.$emit("dialogo");
        },
    },
};

</script>
