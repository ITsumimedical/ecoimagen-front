<template>
    <div>
        <v-card elevaion="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Histórico - Recibos de Caja</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formBusquedaOrdenes">
                    <v-row dense>
                        <v-col cols="12" sm="6" md="6">
                            <v-autocomplete dense outlined label="Tipo de Documento *" :items="opcionesTiposDocumento"
                                item-text="nombre" item-value="id" v-model="formBusqueda.tipo_documento"
                                :loading="loading.opcionesTiposDocumento" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field dense outlined label="Número de Documento *"
                                v-model="formBusqueda.numero_documento" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12" align="right">
                            <v-btn small dark color="primary"
                                @click="buscarRecibosCaja">Buscar</v-btn>
                            <v-btn small dark color="warning"
                                @click="limpiarBusqueda">Limpiar</v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" class="my-2">
                            <v-divider />
                        </v-col>
                    </v-row>
                </v-form>
                <v-row dense v-if="recibosCaja.length > 0">
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table hide-default-footer dense disable-pagination :items="recibosCaja"
                            :items-per-page="paginacion.cantidadRegistros" loading-text="Cargando... Por favor espere."
                            no-data-text="Sin datos para mostrar." :headers="headersRecibosCaja">
                            <template v-slot:[`item.fecha_cobro`]="{ item }">
                                {{ $moment(item.created_at).format('YYYY-MM-DD') }}
                            </template>
                            <template v-slot:[`item.afiliados`]="{ item }">
                                {{item.afiliado.primer_nombre}} {{ item.afiliado.segundo_nombre }}
                                {{ item.afiliado.primer_apellido }} {{ item.afiliado.segundo_apellido }}
                            </template>
                            <template v-slot:[`item.user_crea`]="{ item }">
                                {{item.operador_nombre}} {{ item.operador_apellido }}
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <div style="display: flex; justify-content: center; gap: 0.2rem">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="primary" v-bind="attrs" v-on="on"
                                                @click="imprimirOrden(item)">
                                                mdi-file-download-outline
                                            </v-icon>
                                        </template>
                                        <span>Imprimir</span>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" class="mb-4">
                        <v-divider />
                    </v-col>
                    <v-col cols="12" sm="11" md="11">
                        <v-pagination v-model="paginacion.pagina" :length="paginacion.total"
                            @input="buscarRecibosCaja()" :total-visible="9" />
                    </v-col>
                    <v-col cols="12" sm="1" md="1">
                        <v-select v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50]" dense outlined
                            label="Cantidad por Página" @change="buscarRecibosCaja()" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    middleware({ $can, redirect }) {
        if (!$can('admisiones.vista')) {
            return redirect('/')
        }
    },
    data() {
        return {
            loading: {
                opcionesTiposDocumento: false,
            },
            formBusqueda: {
                tipo_documento: null,
                numero_documento: null
            },
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.'
            },
            opcionesTiposDocumento: [],
            recibosCaja: [],
            headersRecibosCaja: [
                { text: 'Consecutivo', value: 'id', align: 'center' },
                { text: 'Afiliado', value: 'afiliados', align: 'center' },
                { text: 'Fecha de Cobro', value: 'fecha_cobro', align: 'center' },
                { text: 'Valor', value: 'valor', align: 'center' },
                { text: 'Funcionario Ordenó', value: 'user_crea', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ],
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
        }
    },
    mounted() {
        this.listarOpcionesTiposDocumento()
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async listarOpcionesTiposDocumento() {
            try {
                this.loading.opcionesTiposDocumento = true;

                const { data } = await this.$axios.get('/tipo-documento/listar');

                this.opcionesTiposDocumento = data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los tipos de documentos.')
            } finally {
                this.loading.opcionesTiposDocumento = false;
            }
        },

        limpiarBusqueda() {
            this.$refs.formBusquedaOrdenes.reset();
            this.recibosCaja = []
        },

        async buscarRecibosCaja() {
            if (!this.$refs.formBusquedaOrdenes.validate()) return;
            try {
                this.setPreload(true);
                const { pagina, cantidadRegistros } = this.paginacion;

                const { data } = await this.$axios.get(`/ordenamiento/historico-recibos-caja/${this.formBusqueda.tipo_documento}/${this.formBusqueda.numero_documento}`, {
                    params: {
                        pagina,
                        cantidadRegistros
                    }
                });

                const { data: historico = [], last_page = 1 } = data;

                this.recibosCaja = historico;
                this.paginacion.total = last_page;

                if (this.recibosCaja.length === 0) {
                    this.$toast.info('No se encontraron Recibos de caja para el afiliado.');
                }
            } catch (error) {
                this.$toast.error('Ocurrió un error al cargar el histórico del afiliado.')
            } finally {
                this.setPreload(false);
            }
        },

        async imprimirOrden(item) {
            try {
                const payload = {
                    tipo: "reciboCaja",
					cobro_factura_id: item.id,
                };

                this.setPreload(true);

                const { data } = await this.$axios.post('/pdf', payload, {
                    responseType: "arraybuffer",
                });

                let blob = new Blob([data], {
                    type: 'application/pdf'
                });

                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");


            } catch (error) {
                this.$toast.error("Ocurrió un error al descargar la orden");
            } finally {
                this.setPreload(false)
            }
        }
    }
}
</script>