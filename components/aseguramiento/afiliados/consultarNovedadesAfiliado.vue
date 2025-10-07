<template>
    <div>
        <v-form ref="formBuscarAfiliado">
            <v-row class="mt-4">
                <v-col cols="12" md="4" sm="12">
                    <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
                        :loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id"
                        item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento"
                        hint="Ingresa el tipo de documento del afiliado" :rules="[rules.obligatorio]" />
                </v-col>
                <v-col cols="12" md="4" sm="12">
                    <v-text-field dense outlined label="Número Documento" @keyup.enter="
                        consultarAfiliado(
                            datosBuscarAfiliado.numero_documento,
                            datosBuscarAfiliado.tipo_documento
                        )
                        " v-model.trim="datosBuscarAfiliado.numero_documento"
                        hint="Ingresa el número de documento del afiliado" :rules="[rules.obligatorio]" />
                </v-col>
                <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                    <v-btn color="primary" dark @click="
                        consultarAfiliado(
                            datosBuscarAfiliado.numero_documento,
                            datosBuscarAfiliado.tipo_documento
                        )
                        " style="width: 49%">Consultar <v-icon right>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn color="red" dark @click="limpiarAfiliado()" style="width: 49%">Limpiar<v-icon
                            right>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-if="afiliado" dense>
                <v-col cols="12" md="12" sm="12">
                    <v-alert color="blue-grey" border="left" type="info" dense text icon="mdi-book-open-page-variant">
                        <v-row dense>
                            <v-col cols="12" sm="4" md="4">
                                <b>Novedades y Clasificaciones</b>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <b>
                                    {{ nombreAfiliado }} |
                                    {{ afiliado?.tipo_documento?.sigla }} -
                                    {{ afiliado?.numero_documento }}</b>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" align="end">
                                <v-btn dark small color="success" @click="abrirModalNovedades()">Añadir Novedad
                                    <v-icon right> mdi-pen-plus</v-icon>
                                </v-btn>
                                <v-btn dark small color="primary" @click="abrirModalClasificaciones()">Añadir
                                    Clasificación
                                    <v-icon right> mdi-account-multiple</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <div v-if="
                        listaClasificacionesAfiliado &&
                        listaClasificacionesAfiliado.length > 0
                    " style="display: flex; gap: 0.2rem; flex-wrap: wrap">
                        <v-tooltip bottom v-for="clasificacion in listaClasificacionesAfiliado" :key="clasificacion.id">
                            <template v-slot:activator="{ on, attrs }">
                                <v-chip :color="clasificacion?.clasificacion?.color" dark label v-bind="attrs"
                                    v-on="on">
                                    <v-icon left> mdi-label </v-icon>
                                    {{ clasificacion?.clasificacion?.nombre }}
                                    <v-icon right @click.stop="eliminarClasificacion(clasificacion)" class="ml-2"
                                        color="white">
                                        mdi-close
                                    </v-icon>
                                </v-chip>
                            </template>
                            <span>{{ clasificacion?.clasificacion?.descripcion }}</span>
                        </v-tooltip>
                    </div>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-data-table :headers="headersListaNovedades" :items="listaNovedadesAfiliado"
                        :loading="loading.novedadesAfiliado" loading-text="Cargando... Por favor espere"
                        hide-default-footer dense disable-pagination>
                        <template v-slot:[`item.usuario_operador_nombre`]="{ item }">
                            {{
                                [item.usuario?.operador?.nombre, item.usuario?.operador?.apellido]
                            .filter(Boolean)
                            .join(' ')
                            }}
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" v-bind="attrs" v-on="on" @click="abrirModalDetalles(item)">
                                        mdi-file-eye
                                    </v-icon>
                                </template>
                                <span>Ver Adjuntos</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="12" sm="12" md="12" class="mb-4">
                    <v-divider></v-divider>
                </v-col>
                <v-col cols="12" sm="11" md="11">
                    <v-pagination v-model="paginacion.pagina" :length="paginacion.total"
                        @input="buscarNovedadesAfiliado()" :total-visible="9"></v-pagination>
                </v-col>
                <v-col cols="12" sm="1" md="1">
                    <v-select v-model="paginacion.cantidadRegistros" :items="[10, 20, 50, 100]" dense outlined
                        label="Cantidad por Página" @change="buscarNovedadesAfiliado()"></v-select>
                </v-col>
            </v-row>
        </v-form>

        <!-- Modales -->
        <modalRegistrarNovedad :mostrarModalNovedades.sync="mostrarModalNovedades" :afiliado="afiliadoSeleccionado"
            @buscarNovedadesAfiliado="buscarNovedadesAfiliado()" />

        <modalRegistrarClasificacion :mostrarModalClasificaciones.sync="mostrarModalClasificaciones"
            :afiliado="afiliadoSeleccionado" @buscarClasificacionesAfiliado="buscarClasificacionesAfiliado()" />

        <modalAdjuntosNovedad :mostrarModalAdjuntos.sync="mostrarModalAdjuntos" :novedad="novedadSeleccionada" />

        <v-dialog v-model="modalClasificacion" width="500">
            <v-card>
                <v-alert dense :color="datosClasificacionEliminar?.clasificacion?.color">
                    Se eliminara la clasificacion <v-icon left color="white"> mdi-label </v-icon>
                    <strong>{{ datosClasificacionEliminar?.clasificacion?.nombre }}</strong>
                </v-alert>

                <v-card-text>
                    <v-textarea outlined auto-grow name="input-7-4" v-model="descripcionClasificacion"
                        label="Escriba la observación del la eliminación"></v-textarea>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="modalClasificacion = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="success" @click="confirmarEliminacionClasificacion(datosClasificacionEliminar)">
                        Aceptar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import {
    mapActions
} from "vuex";
import modalRegistrarNovedad from "@/components/aseguramiento/afiliados/modalRegistrarNovedad.vue";
import modalRegistrarClasificacion from "@/components/aseguramiento/afiliados/modalRegistrarClasificacion.vue";
import modalAdjuntosNovedad from "@/components/aseguramiento/afiliados/modalAdjuntosNovedad.vue";

export default {
    components: {
        modalRegistrarNovedad,
        modalRegistrarClasificacion,
        modalAdjuntosNovedad,
    },
    data() {
        return {
            modalClasificacion: false,
            descripcionClasificacion: '',
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            loading: {
                tiposDocumentos: false,
                novedadesAfiliado: false,
            },
            tiposDocumentos: [],
            afiliado: null,
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio.",
            },
            listaNovedadesAfiliado: [],
            listaClasificacionesAfiliado: [],
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            headersListaNovedades: [{
                text: "ID",
                value: "id"
            },
            {
                text: "Fecha de Novedad",
                value: "fecha_novedad",
                align: "center"
            },
            {
                text: "Tipo de Novedad",
                value: "tipo_novedad.nombre",
                align: "center",
            },
            {
                text: "Descripción",
                value: "motivo"
            },
            {
                text: "Usuario Registró",
                value: "usuario_operador_nombre",
                align: "center",
            },
            {
                text: "Acciones",
                value: "acciones",
                sortable: false,
                align: "center",
            },
            ],
            mostrarModalNovedades: false,
            mostrarModalClasificaciones: false,
            afiliadoSeleccionado: {},
            mostrarModalAdjuntos: false,
            novedadSeleccionada: {},
        };
    },
    mounted() {
        this.listarTiposDocumentos();
    },
    computed: {
        nombreAfiliado() {
            return [
                this.afiliado?.primer_nombre,
                this.afiliado?.segundo_nombre,
                this.afiliado?.primer_apellido,
                this.afiliado?.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');
        }
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

        consultarAfiliado(numero_documento, tipo_documento) {
            if (!this.$refs.formBuscarAfiliado.validate()) {
                this.$toast.error(
                    "Por favor ingrese el tipo de documento y el número de documento."
                );
                return;
            }

            this.afiliado = null;
            this.setPreload(true);
            this.$axios
                .get(`/afiliados/${numero_documento}/${tipo_documento}`)
                .then((res) => {
                    this.afiliado = res.data;
                    this.buscarNovedadesAfiliado();
                    this.buscarClasificacionesAfiliado();
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
            this.afiliadoSeleccionado = {};
            this.listaNovedadesAfiliado = [];
            this.listaClasificacionesAfiliado = [];

            this.$refs.formBuscarAfiliado.resetValidation();
        },

        buscarNovedadesAfiliado() {
            this.loading.novedadesAfiliado = true;
            this.$axios
                .post(
                    `/novedad-afiliado/novedadAfiliado/${this.afiliado.id}?page=${this.paginacion.pagina}&cant=${this.paginacion.cantidadRegistros}`
                )
                .then((res) => {
                    this.listaNovedadesAfiliado = res.data.data;
                    this.paginacion.total = res.data.last_page;
                })
                .catch((error) => {
                    this.$toast.error("Error al cargar las novedades del afiliado");
                })
                .finally(() => {
                    this.loading.novedadesAfiliado = false;
                });
        },

        buscarClasificacionesAfiliado() {
            this.setPreload(true);
            this.$axios
                .post(`/afiliacion-clasificacion/listar/${this.afiliado.id}`)
                .then((res) => {
                    this.listaClasificacionesAfiliado = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Error al cargar las clasificaciones del afiliado");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        abrirModalNovedades() {
            this.mostrarModalNovedades = true;
            this.afiliadoSeleccionado = this.afiliado;
        },

        abrirModalClasificaciones() {
            this.mostrarModalClasificaciones = true;
            this.afiliadoSeleccionado = this.afiliado;
        },

        abrirModalDetalles(item) {
            this.mostrarModalAdjuntos = true;
            this.novedadSeleccionada = item;
        },
        eliminarClasificacion(clasificacion) {
            this.datosClasificacionEliminar = clasificacion
            this.modalClasificacion = true
            this.descripcionClasificacion = ''
        },

        confirmarEliminacionClasificacion(datosClasificacionEliminar) {
            this.datosClasificacionEliminar.descripcionClasificacion = this.descripcionClasificacion
            this.$axios.post(`/afiliacion-clasificacion/eliminarClasificacion/${datosClasificacionEliminar.id}`,
                datosClasificacionEliminar).finally(res => {
                    this.$toast.success("Eliminado con exito!");
                    this.modalClasificacion = false;
                    this.buscarClasificacionesAfiliado()
                    this.descripcionClasificacion = ''
                })
        }
    },
};

</script>
