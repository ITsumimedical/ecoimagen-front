<template>
    <v-dialog v-model="mostrarModalNovedadesContrato" persistent max-width="900px" scrollable>
        <v-card>
            <v-alert dense text border="left" color="primary" icon="mdi-history" class="text-center">
                <b>Histórico de Novedades {{ ` - Contrato N° ${contratoSeleccionado?.id}` }}</b>
            </v-alert>
            <v-card-text>
                <v-row dense class="mt-2">
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table dense :headers="headersNovedadesContrato" :loading="loading.novedadesContrato"
                            :items="novedadesContrato" no-data-text="Sin datos para mostrar"
                            loading-text="Cargando... Por favor espere." @item-expanded="listarAdjuntosNovedad"
                            hide-default-footer disable-pagination show-expand single-expand>
                            <template v-slot:[`item.user`]="{ item }">
                                {{
                                    `${item.user?.operador?.nombre || ''} ${item.user?.operador?.apellido || ''}`.trim() ||
                                'Sin nombre'
                                }}
                            </template>
                            <template v-slot:[`item.fechaRadicacion`]="{ item }">
                                <td>{{ $moment(item.created_at).format("DD/MM/YYYY") }}</td>
                            </template>
                            <!-- Adjuntos de la Novedad -->
                            <template v-slot:expanded-item>
                                <td class="pa-2 elevation-0" colspan="12">
                                    <v-data-table dense :items="adjuntosNovedad" :loading="loading.adjuntosNovedad"
                                        :headers="headersAdjuntos" no-data-text="Sin datos para mostrar"
                                        class="elevation-1">
                                        <template v-slot:[`item.acciones`]="{ item }">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                        @click="descargarAdjunto(item)">
                                                        mdi-file-download
                                                    </v-icon>
                                                </template>
                                                <span>Descargar Adjunto</span>
                                            </v-tooltip>
                                        </template>
                                    </v-data-table>
                                </td>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
    props: {
        mostrarModalNovedadesContrato: {
            type: Boolean,
            default: false
        },
        contratoSeleccionado: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            loading: {
                novedadesContrato: false,
                adjuntosNovedad: false
            },
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            novedadesContrato: [],
            headersNovedadesContrato: [
                { text: "N°", value: "id", align: "center" },
                { text: "Fecha", value: "fechaRadicacion", align: "center" },
                { text: "Tipo", value: "tipo.nombre", align: "center" },
                { text: "Registrado Por", value: "user", align: "center" },
                { text: "Observaciones", value: "observaciones", align: "center" },
            ],
            adjuntosNovedad: [],
            headersAdjuntos: [
                { text: "N°", value: "id", align: "center" },
                { text: "Adjunto", value: "nombre", align: "center" },
                { text: "Acciones", value: "acciones", align: "center", sortable: false },
            ]
        }
    },
    watch: {
        mostrarModalNovedadesContrato(newValue) {
            if (newValue) {
                this.listarNovedadesContrato();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.novedadesContrato = [];
            this.$emit('update:mostrarModalNovedadesContrato', false);
        },

        async listarNovedadesContrato() {
            try {
                this.loading.novedadesContrato = true;

                // Construir la URL con los parámetros
                const url = `/novedades-contratos-medicamentos/listar-novedades-contrato?` +
                    `pagina=${this.paginacion.pagina}` +
                    `&cantidadRegistros=${this.paginacion.cantidadRegistros}` +
                    `&contrato=${this.contratoSeleccionado.id || ''}`;

                // Realizar la solicitud
                const response = await this.$axios.get(url);

                // Procesar la respuesta
                this.novedadesContrato = response.data.data;
                this.paginacion.total = response.data.last_page;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las novedades del contrato');
            } finally {
                this.loading.novedadesContrato = false;
            }
        },

        async listarAdjuntosNovedad({ item, value }) {
            // Si está colapsado no hacer nada
            if (!value) return;

            // Reiniciar el array de tarifas
            this.adjuntosNovedad = [];

            try {
                this.loading.adjuntosNovedad = true;

                const response = await this.$axios.get(`/novedades-contratos-medicamentos/listar-adjuntos-novedad/${item.id}`);

                this.adjuntosNovedad = response.data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los adjuntos de la novedad');
            } finally {
                this.loading.adjuntosNovedad = false;
            }
        },

        async descargarAdjunto(item) {
            try {
                const data = {
                    nombre_archivo: `${item.id}_${item.nombre}`,
                    nombre_carpeta: `adjuntosContratosMedicamentos`,
                    disco: 'server37',
                    tiempo: 5
                };

                this.setPreload(true);

                const urlDescarga = await this.$axios.post('/adjuntos/generar-url-descarga-s3', data);

                window.open(urlDescarga.data, "_blank");

            } catch (error) {
                this.$toast.error('Ocurrió un error al descargar el adjunto');
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>
