<template>
    <v-row dense>
        <v-col cols="12" sm="12" md="12">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header class="text-center text-h6">
                        <b>Histórico de Ordenamiento Intrahospitalario</b>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table hide-default-footer dense disable-pagination
                                    :headers="headersHistoricoOrdenamiento"
                                    :items-per-page="paginacion.cantidadRegistros" :items="historicoOrdenamiento"
                                    :loading="loading.historicoOrdenamiento"
                                    loading-text="Cargando... Por favor espere." no-data-text="Sin datos para mostrar.">
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
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="success" v-bind="attrs" v-on="on"
                                                    @click="reformularArticulo(item)">
                                                    mdi-autorenew</v-icon>
                                            </template>
                                            <span>Reformular</span>
                                        </v-tooltip>
                                    </template>
                                </v-data-table>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" class="mb-4">
                                <v-divider />
                            </v-col>
                            <v-col cols="12" sm="11" md="11">
                                <v-pagination v-model="paginacion.pagina" :length="paginacion.total"
                                    @input="listarHistoricoOrdenamiento()" :total-visible="9" />
                            </v-col>
                            <v-col cols="12" sm="1" md="1">
                                <v-select v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50]" dense outlined
                                    label="Cantidad por Página" @change="listarHistoricoOrdenamiento()" />
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        afiliado: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            loading: {
                historicoOrdenamiento: false
            },
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            headersHistoricoOrdenamiento: [
                { text: "Consecutivo", value: 'id', align: 'center' },
                { text: "Artículo", value: 'codesumi.nombre', align: 'center' },
                { text: "Vía de Administración", value: 'via', align: 'center' },
                { text: "Finalización", value: 'finalizacion', align: 'center' },
                { text: "Dosis", value: 'dosis', align: 'center' },
                { text: "Frecuencia", value: 'frecuencia', align: 'center' },
                { text: "Horas Vigencia", value: 'horas_vigencia', align: 'center' },
                { text: "Cantidad", value: 'cantidad', align: 'center' },
                { text: "Indicación Médica", value: 'observacion', align: 'center' },
                { text: "Estado", value: 'estado', align: 'center' },
                { text: "Acciones", value: 'acciones', align: 'center', sortable: false },
            ],
            historicoOrdenamiento: [],
        }
    },
    mounted() {
        this.listarHistoricoOrdenamiento();
    },
    methods: {
        async listarHistoricoOrdenamiento() {
            try {
                this.loading.historicoOrdenamiento = true;

                const { pagina, cantidadRegistros } = this.paginacion;

                const { data } = await this.$axios.get(`/ordenamiento/listar-historico-ordenes-intrahospitalarias-afiliado/${this.afiliado?.id}`, {
                    params: {
                        pagina,
                        cantidadRegistros
                    }
                });

                const { data: historico = [], last_page = 1 } = data;

                this.historicoOrdenamiento = historico;
                this.paginacion.total = last_page;


            } catch (error) {
                this.$toast.error('Ocurrió un error al cargar el histórico de órdenes del afiliado.')
            } finally {
                this.loading.historicoOrdenamiento = false;
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

        reformularArticulo(articulo) {
            this.$emit('reformular-articulo', articulo);
        }
    }
}
</script>
