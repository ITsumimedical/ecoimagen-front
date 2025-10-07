<template>
    <v-row dense>
        <v-col cols="12" sm="12" md="12">
            <v-alert dense text color="blue-grey" border="left" class="text-center"
                icon="mdi-file-document-check-outline">
                <b>
                    Artículos Ordenados
                </b>
            </v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-data-table dense :items="articulosOrdenados" :loading="loading.articulosOrdenados"
                :headers="headersArticulosOrdenados" no-data-text="No hay ordenes para mostrar."
                loading-text="Cargando... Por favor espere.">
                <template v-slot:[`item.via`]="{ item }">
                    {{ item.via_administracion?.nombre.toUpperCase() ?? ' - ' }}
                </template>
                <template v-slot:[`item.finalizacion`]="{ item }">
                    <v-chip small dark label :color="item.finalizacion === 'DEFINIDO' ? 'success' : 'primary'">
                        <b> {{ item.finalizacion === 'DEFINIDO' ? 'DEFINIDO' : 'DOSIS ÚNICA' }} </b>
                    </v-chip>
                </template>
                <template v-slot:[`item.dosis`]="{ item }">
                    {{ parseInt(item.dosis) }}
                </template>
                <template v-slot:[`item.frecuencia`]="{ item }">
                    {{ item.finalizacion === 'DEFINIDO' ? `${parseInt(item.frecuencia)} ${item.unidad_tiempo}` : ` - `
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
                                <v-icon color="primary" v-bind="attrs" v-on="on" @click="imprimirOrden(item)">
                                    mdi-file-download-outline
                                </v-icon>
                            </template>
                            <span>Imprimir</span>
                        </v-tooltip>
                    </div>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    props: {
        consultaId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            loading: {
                articulosOrdenados: false
            },
            headersArticulosOrdenados: [
                { text: 'Consecutivo', value: 'id', align: 'center' },
                { text: 'Artículo', value: 'codesumi.nombre', align: 'center' },
                { text: 'Vía de Administración', value: 'via', align: 'center' },
                { text: 'Finalización', value: 'finalizacion', align: 'center' },
                { text: 'Dosis', value: 'dosis', align: 'center' },
                { text: 'Frecuencia', value: 'frecuencia', align: 'center' },
                { text: 'Horas Vigencia', value: 'horas_vigencia', align: 'center' },
                { text: 'Cantidad', value: 'cantidad', align: 'center' },
                { text: 'Indicación Médica', value: 'observacion', align: 'center' },
                { text: 'Estado', value: 'estado', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: false },
            ],
            articulosOrdenados: [],
        }
    },
    mounted() {
        this.listarArticulosOrdenadosConsulta()
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async listarArticulosOrdenadosConsulta() {
            try {
                this.loading.articulosOrdenados = true;

                const { data } = await this.$axios.get(`/ordenamiento/listar-articulos-intrahospitalarios-ordenados-consulta/${this.consultaId}`);

                this.articulosOrdenados = data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las ordenes')
            } finally {
                this.loading.articulosOrdenados = false;
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