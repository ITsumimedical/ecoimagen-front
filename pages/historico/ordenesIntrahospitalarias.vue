<template>
    <div>
        <v-card elevaion="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Histórico - Órdenes Intrahospitalarias</span>
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
                            <v-btn small dark color="primary" :loading="loading.ordenesIntraHospitalarias"
                                @click="buscarOrdenesIntrahospitalarias">Buscar</v-btn>
                            <v-btn small dark color="warning" :loading="loading.ordenesIntraHospitalarias"
                                @click="limpiarBusqueda">Limpiar</v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" class="my-2">
                            <v-divider />
                        </v-col>
                    </v-row>
                </v-form>
                <v-row dense v-if="ordenesIntrahospitalarias.length > 0">
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table hide-default-footer dense disable-pagination :items="ordenesIntrahospitalarias"
                            :loading="loading.ordenesIntraHospitalarias" :items-per-page="paginacion.cantidadRegistros"
                            loading-text="Cargando... Por favor espere." no-data-text="Sin datos para mostrar."
                            :headers="headersOrdenesIntrahospitalarias">
                            <template v-slot:[`item.fecha_creacion`]="{ item }">
                                {{ $moment(item.created_at).format('YYYY-MM-DD') }}
                            </template>
                            <template v-slot:[`item.via`]="{ item }">
                                {{ item.via_administracion?.nombre.toUpperCase() ?? ' - ' }}
                            </template>
                            <template v-slot:[`item.finalizacion`]="{ item }">
                                <v-chip small dark label
                                    :color="item.finalizacion === 'DEFINIDO' ? 'success' : 'primary'">
                                    <b> {{ item.finalizacion === 'DEFINIDO' ? 'DEFINIDO' : 'DOSIS ÚNICA' }} </b>
                                </v-chip>
                            </template>
                            <template v-slot:[`item.dosis`]="{ item }">
                                {{ parseInt(item.dosis) }}
                            </template>
                            <template v-slot:[`item.frecuencia`]="{ item }">
                                {{ item.finalizacion === 'DEFINIDO' ? `${parseInt(item.frecuencia)}
                                ${item.unidad_tiempo}` : ` - `
                                }}
                            </template>
                            <template v-slot:[`item.horas_vigencia`]="{ item }">
                                {{ `${parseInt(item.horas_vigencia)} HORAS` }}
                            </template>
                            <template v-slot:[`item.cantidad`]="{ item }">
                                {{ parseInt(item.cantidad) }}
                            </template>
                            <template v-slot:[`item.estado`]="{ item }">
                                <v-chip small dark label :color="obtenerColorEstado(item.estado?.id)">
                                    <b>
                                        {{ item.estado?.nombre.toUpperCase() }}
                                    </b>
                                </v-chip>
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
                            @input="buscarOrdenesIntrahospitalarias()" :total-visible="9" />
                    </v-col>
                    <v-col cols="12" sm="1" md="1">
                        <v-select v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50]" dense outlined
                            label="Cantidad por Página" @change="buscarOrdenesIntrahospitalarias()" />
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
        if (!$can('historico.ordenesIntrahospitalarias')) {
            return redirect('/')
        }
    },
    data() {
        return {
            loading: {
                opcionesTiposDocumento: false,
                ordenesIntraHospitalarias: false
            },
            formBusqueda: {
                tipo_documento: null,
                numero_documento: null
            },
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.'
            },
            opcionesTiposDocumento: [],
            ordenesIntrahospitalarias: [],
            headersOrdenesIntrahospitalarias: [
                { text: 'Consecutivo', value: 'id', align: 'center' },
                { text: 'N° Orden', value: 'orden_id', align: 'center' },
                { text: 'Fecha de Creación', value: 'fecha_creacion', align: 'center' },
                { text: 'Artículo', value: 'codesumi.nombre', align: 'center' },
                { text: 'Vía de Administración', value: 'via', align: 'center' },
                { text: 'Finalización', value: 'finalizacion', align: 'center' },
                { text: 'Dosis', value: 'dosis', align: 'center' },
                { text: 'Frecuencia', value: 'frecuencia', align: 'center' },
                { text: 'Horas Vigencia', value: 'horas_vigencia', align: 'center' },
                { text: 'Cantidad', value: 'cantidad', align: 'center' },
                { text: 'Indicación Médica', value: 'observacion', align: 'center' },
                { text: 'Funcionario Ordenó', value: 'user_crea.operador.nombre_completo', align: 'center' },
                { text: 'Estado', value: 'estado', align: 'center' },
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
            this.ordenesIntrahospitalarias = []
        },

        async buscarOrdenesIntrahospitalarias() {
            if (!this.$refs.formBusquedaOrdenes.validate()) return;
            try {
                this.loading.ordenesIntraHospitalarias = true;

                const { pagina, cantidadRegistros } = this.paginacion;

                const { data } = await this.$axios.get(`/ordenamiento/listar-historico-ordenes-intrahospitalarias/${this.formBusqueda.tipo_documento}/${this.formBusqueda.numero_documento}`, {
                    params: {
                        pagina,
                        cantidadRegistros
                    }
                });

                const { data: historico = [], last_page = 1 } = data;

                this.ordenesIntrahospitalarias = historico;
                this.paginacion.total = last_page;

                if (this.ordenesIntrahospitalarias.length === 0) {
                    this.$toast.info('No se encontraron órdenes para el afiliado.');
                }
            } catch (error) {
                this.$toast.error('Ocurrió un error al cargar el histórico de órdenes del afiliado.')
            } finally {
                this.loading.ordenesIntraHospitalarias = false;
            }
        },

        obtenerColorEstado(estadoId) {
            switch (parseInt(estadoId)) {
                case 1:
                    return 'primary'
                default:
                    return 'grey'
            }
        },

        async imprimirOrden(item) {
            try {
                const payload = {
                    tipo: 'medicamentoIntrahospitalario',
                    orden_articulo_intrahospitalario_id: item.id,
                    orden_id: item.orden_id
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