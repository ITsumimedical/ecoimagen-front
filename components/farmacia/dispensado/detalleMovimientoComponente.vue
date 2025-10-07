<template>
    <v-dialog max-width="1200px" v-model="mostrarDetalles">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-file-document-check-outline"
                class="text-center">
                <b>DETALLES DE MOVIMIENTOS</b>
            </v-alert>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-data-table disable-pagination hide-default-footer dense :headers="headers"
                            :items="detallesMovimiento" :loading="loading" loading-text="Cargando... Espere por favor" no-data-text="Sin datos para mostrar">
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarModal">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    data() {
        return {
            loading: false,
            detallesMovimiento: [],
            headers: [{
                text: 'ID',
                value: 'id',
                align: 'center',
                sortable: false
            },
            {
                text: 'Cantidad anterior',
                value: 'cantidad_anterior',
                align: 'center',
                sortable: false
            },
            {
                text: 'Cantidad final',
                value: 'cantidad_final',
                align: 'center',
                sortable: false
            },
            {
                text: 'Cantidad solicitarda',
                value: 'cantidad_solicitada',
                align: 'center',
                sortable: false
            },
            {
                text: 'Lote',
                value: 'lote.codigo',
                align: 'center',
                sortable: false
            },
            {
                text: 'Cum',
                value: 'lote.bodega_medicamento.medicamento.cum',
                align: 'center',
                sortable: false
            },
            {
                text: 'Fecha venciomiento',
                value: 'lote.fecha_vencimiento',
                align: 'center',
                sortable: false
            },
            ],
        };
    },
    props: {
        mostrarDetalles: {
            type: Boolean,
            default: false
        },
        movimientoId: Number,
    },
    methods: {

        detallesMovimientos(){
            const params = {
                movimientoId: this.movimientoId,
            }
            this.loading = true;
            this.$axios.post('bodegas/historicoDispensadoDetalleMovimientos', params).then(res => {
                    this.detallesMovimiento = res.data
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                })
        },

        cerrarModal(){
            this.$emit('update:mostrarDetalles', false);
        }
    }
}
</script>
