<template>
    <div>
        <v-container fluid>
            <v-card elevation="3" class="pa-4">
                <!-- Encabezado -->
                <v-card-title class="px-4">
                    <v-toolbar flat class="w-100 px-0">
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="Logo" height="50" width="50" />
                            <span class="ml-3 text-h6 font-weight-bold">Administración de Afiliados</span>
                        </div>

                        <v-divider class="mx-4" inset vertical></v-divider>

                        <div class="d-flex align-center flex-wrap ml-auto">
                            <!-- <v-btn color="info" small class="mr-2 mb-2" @click="modalCargaMasiva = true">
                                Carga Masiva <v-icon right>mdi-upload</v-icon>
                            </v-btn> -->

                            <v-btn small color="warning" class="mr-2 mb-2"
                                v-if="$can('aseguramiento.verificacion.descargarCapita')" dark
                                @click="descargarCapita()">
                                Reporte FOMAG <v-icon right>mdi-download</v-icon>
                            </v-btn>

                            <v-btn color="success" small class="mb-2" @click="abrirFormularioNuevo">
                                Crear Afiliado <v-icon right>mdi-plus</v-icon>
                            </v-btn>

                        </div>
                    </v-toolbar>
                </v-card-title>
                <v-divider></v-divider>

                <!-- Panel búsqueda -->
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="6" md="3">
                            <v-autocomplete :loading="loading.loadingTipoDocumento" :items="tiposDocumentos"
                                item-text="nombre" item-value="id" outlined label="Tipo de Documento" dense
                                v-model="tipoDocumento"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" v-if="tipoDocumento != 7">
                            <v-text-field outlined label="Número de Documento" dense v-model="cedula" type="number"
                                hint="Ingrese el número de documento del afiliado"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" v-else>
                            <v-text-field outlined label="Número de Documento" dense v-model="cedula"
                                hint="Ingrese el número de documento del afiliado"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" class="d-flex align-end">
                            <v-btn small class="mb-8 mr-2" color="primary" @click="buscarAfiliado">
                                Buscar
                                <v-icon right>mdi-magnify</v-icon>
                            </v-btn>
                            <v-btn small class="mb-8" color="error" @click="limpiarFiltros">
                                Limpiar
                                <v-icon right>mdi-account-remove</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>

        <!-- Modal creación de afiliado -->
        <v-dialog v-model="modalCreacion" persistent fullscreen>
            <v-card>
                <v-card-title class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                        <span class="ml-3 text-h6">
                            {{ modoDetalle ? 'Información del Afiliado' : (modoEdicion ? 'Actualizar Afiliado' :
                                'Registrar Nuevo Afiliado') }}
                        </span>
                    </div>

                    <v-divider class="mx-4" inset vertical></v-divider>

                    <div class="d-flex align-center ml-auto">
                        <template v-if="modoEdicion">
                            <v-btn v-show="$can('certificadoAfiliacion.descargar')" dark small color="success"
                                @click="descargarCertificado" class="mr-2">
                                Certificado de Afiliación
                                <v-icon right>mdi-account-arrow-down</v-icon>
                            </v-btn>

                            <v-btn v-show="$can('grupoFamiliar.vista')" dark small color="primary" class="mr-2"
                                @click="abrirModalGrupoFamiliar">
                                Ver Grupo Familiar
                                <v-icon right>mdi-account-multiple</v-icon>
                            </v-btn>

                            <v-btn dark small color="warning" @click="mostrarMarcacion = true" class="mr-2">
                                gestionar marcaciones
                                <v-icon right>mdi-tag</v-icon>
                            </v-btn>

                            <v-btn dark small color="blue-grey" @click="abrirModalNovedades(afiliadoSeleccionado)"
                                class="mr-2">
                                Registrar Novedad <v-icon right>mdi-alert-plus</v-icon>
                            </v-btn>

                            <v-btn dark small color="purple" @click="modalCambioContrasena = true" class="mr-2">
                                Actualizar Contraseña
                                <v-icon right>mdi-account-key</v-icon>
                            </v-btn>

                        </template>

                        <v-btn icon @click="cerrarFormulario" class="ml-4">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>

                    <!-- Diálogo Marcacion -->
                    <v-dialog v-model="mostrarMarcacion" max-width="1600px" persistent scrollable>
                        <v-card>
                            <v-card-title>
                                <v-toolbar flat>
                                    <v-toolbar-title>
                                        <div class="d-flex align-center">
                                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                            <span>Clasificaciones del afiliado</span>
                                        </div>
                                    </v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                </v-toolbar>
                                <v-btn icon @click="mostrarMarcacion = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-card-title>
                            <v-card-text>
                                <marcacion :datos="afiliadoSeleccionado" />
                            </v-card-text>
                        </v-card>
                    </v-dialog>

                </v-card-title>
                <v-card-text>
                    <FormularioAfiliadoComponente :mostrarClasificaciones="false"
                        :key="modoEdicion ? afiliadoSeleccionado?.id : 'nuevo'" :afiliado="afiliadoSeleccionado"
                        :modo-edicion="modoEdicion" @cerrarModal="cerrarFormulario" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Modal carga masiva -->
        <v-dialog v-model="modalCargaMasiva" max-width="700px">
            <CargaMasivaAfiliadoComponente v-model="modalCargaMasiva" />
        </v-dialog>

        <!-- Modal grupo familiar -->
        <ModalGrupoFamiliar :mostrarGrupoFamiliar.sync="mostrarGrupoFamiliar" :afiliado="afiliadoSeleccionado" />

        <!-- Modal de novedad -->
        <v-dialog v-model="dialogModalNovedad" max-width="900" persistent>
            <ModalNovedad :afiliado="afiliadoSeleccionado" @cerrar="dialogModalNovedad = false" />
        </v-dialog>

        <!-- Modal cambio de contraseña -->
        <ModalCambioContrasenaPorExpiracion v-model="modalCambioContrasena" :usuario="afiliadoSeleccionado?.user"
            @input="$store.dispatch('cambioContrasena/abrirModalCambioContrasena', { usuario: afiliadoSeleccionado?.user || null, obligatorio: false })" />
    </div>
</template>

<script>
import {
    mapActions,
    mapState
} from "vuex";
import FormularioAfiliadoComponente from '~/components/afiliado/FormularioAfiliadoComponente.vue';
import CargaMasivaAfiliadoComponente from '~/components/afiliado/CargaMasivaAfiliadoComponente.vue';
import ModalGrupoFamiliar from "~/components/afiliado/modalGrupoFamiliar.vue";
import ModalNovedad from '~/components/aseguramiento/afiliados/ModalNovedad.vue';
import Marcacion from '~/components/aseguramiento/verificacion/Marcacion.vue';
import ModalCambioContrasenaPorExpiracion from "~/components/usuario/modalCambioContrasenaPorExpiracion.vue";

export default {
    components: {
        FormularioAfiliadoComponente,
        CargaMasivaAfiliadoComponente,
        ModalGrupoFamiliar,
        ModalNovedad,
        Marcacion,
        ModalCambioContrasenaPorExpiracion
    },

    data() {
        return {
            modalCambioContrasena: false,
            tiposDocumentos: [],
            tipoDocumento: null,
            cedula: null,
            loading: {
                loadingTipoDocumento: false
            },
            modalCreacion: false,
            afiliadoSeleccionado: null,
            modoEdicion: false,
            modoDetalle: false,
            modalCargaMasiva: false,
            mostrarGrupoFamiliar: false,
            mostrarMarcacion: false,
            dialogModalNovedad: false,
            mostrarModalAfiliado: false
        };
    },

    mounted() {
        this.listartipoDocumentos();
    },

    computed: {
        ...mapState('cambioContrasena', [
            'mostrarModalCambioContrasena',
            'usuarioObjetivo'
        ]),
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        listartipoDocumentos() {
            this.loading.loadingTipoDocumento = true;
            this.$axios.get("/tipo-documento/listar").then((res) => {
                this.tiposDocumentos = res.data;
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                this.loading.loadingTipoDocumento = false;
            });
        },

        buscarAfiliado() {
            if (!this.tipoDocumento || !this.cedula) {
                return this.$toast.error('Por favor ingrese los filtros necesarios.');
            }

            this.setPreload(true);

            this.$axios.get(`/afiliados/${this.cedula}/${this.tipoDocumento}`)
                .then((res) => {
                    this.afiliadoSeleccionado = res.data;
                    this.modoEdicion = true;
                    this.modalCreacion = true;
                })
                .catch((error) => {
                    if (error.response?.data?.error) {
                        this.$toast.error(error.response.data.error);
                    } else {
                        this.$toast.error('Ocurrió un error inesperado al consultar el afiliado.');
                    }
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        abrirModalGrupoFamiliar() {
            this.mostrarGrupoFamiliar = true;
        },

        cerrarFormulario() {
            this.modalCreacion = false;
            this.modoEdicion = false;
            this.afiliadoSeleccionado = null;
            this.mostrarGrupoFamiliar = false;
        },

        abrirFormularioNuevo() {
            this.afiliadoSeleccionado = null;
            this.modoEdicion = false;
            this.modalCreacion = true;
        },

        limpiarFiltros() {
            this.tipoDocumento = null;
            this.cedula = null;
            this.afiliadoSeleccionado = null;
            this.modoEdicion = false;
        },

        descargarCapita() {
            let correo = this.$store.state.auth.usuario.operador.email_recuperacion;
            this.$swal({
                title: "Reporte Afiliados Fomag",
                text: "Valide que el correo esté correcto",
                input: "email",
                inputPlaceholder: "Enter your email address",
                inputValue: correo
            }).then((result) => {
                if (result.value) {
                    this.$axios.post('/afiliados/reporteRedAfiliados/' + correo).then((response) => {
                        this.$toast("El reporte será enviado al correo registrado.");
                    }).finally(() => {
                        this.preload = false;
                        this.$toast("El reporte será enviado al correo registrado.");
                    });
                }
            });
        },

        descargarCertificado() {
            this.setPreload(true);

            const afiliado = this.afiliadoSeleccionado;

            const nombreCompleto = [
                afiliado.primer_nombre,
                afiliado.segundo_nombre,
                afiliado.primer_apellido,
                afiliado.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');

            const data = {
                numero_documento: afiliado.numero_documento,
                tipo_documento: afiliado.tipo_documento.nombre,
                primer_nombre: afiliado.primer_nombre,
                segundo_nombre: afiliado.segundo_nombre,
                primer_apellido: afiliado.primer_apellido,
                segundo_apellido: afiliado.segundo_apellido,
                estado: afiliado.estado_afiliado.nombre,
                tipo_afiliado: afiliado.tipo_afiliado_id,
                ips: afiliado.ips.nombre,
            };

            this.$axios
                .post("certificado/crear", data, { responseType: 'arraybuffer' })
                .then((res) => {
                    this.$toast.success("Certificado generado con éxito");

                    const blob = new Blob([res.data], { type: "application/pdf" });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `certificado_afiliado_${afiliado.numero_documento}.pdf`;
                    link.click();
                })
                .catch((e) => {
                    console.error("Error al generar certificado", e);
                    this.$toast.error("Error al generar certificado");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        pdf() {
            const data = {
                tipo: "certificadoAfiliado",
                id: this.afiliado.id,
            };
            this.setPreload(true);
            this.$axios.post("certificado/pdf", data, {
                responseType: "arraybuffer",
            }).then((res) => {
                this.preload = false;
                let blob = new Blob([res.data], {
                    type: "application/pdf",
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            }).catch((e) => {
                this.$toast.error("Error al generar certificado");
            }).finally(() => {
                this.setPreload(false);
            });
        },

        abrirModalNovedades(afiliado) {
            this.afiliadoSeleccionado = afiliado;
            this.dialogModalNovedad = true;
        },

        cerrarModalCambioContrasena() {
            this.$store.commit('cambioContrasena/SET_MOSTRRAR_MODAL', false);
        },
    },
};

</script>
