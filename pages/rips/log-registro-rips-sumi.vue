<template>
    <v-card>

        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="60px" width="60px">
                        <span>Logs Registros Rips</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-3" inset vertical></v-divider>
                <v-spacer></v-spacer>

            </v-toolbar>
        </v-card-title>

        <v-card-text class="mt-10">
            <v-row>
                <v-col cols="12" sm="12" md="12">
                    <v-data-table :items="logs" :headers="headersLogs" hide-default-footer :loading="loading.logs" dense
                        disable-pagination :items-per-page="paginacion.cantidadRegistros"
                        loading-text="Cargando ... Porfavor espere ." no-data-text="Sin datos para Mostrar">

                        <template v-slot:[`item.codigo_http_respuesta`]="{ item }">
                            <v-chip small :color="getColor(Number(item.codigo_http_respuesta))" dark>
                                {{ item.codigo_http_respuesta }}
                            </v-chip>
                        </template>

                    </v-data-table>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="11" md="11">
                    <v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
                        @input="listarLogs()">
                    </v-pagination>
                </v-col>

                <v-col cols="12" sm="1" md="1">
                    <v-select dense outlined v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50, 100]"
                        label="Registros por Página" @change="listarLogs()"></v-select>
                </v-col>
                <v-actions> </v-actions>
            </v-row>
        </v-card-text>

    </v-card>


</template>
<script>
export default {

    data() {
        return {
            loading: {
                logs: false
            },
            logs: [],
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
            headersLogs: [
                {
                    text: 'consecutivo',
                    align: 'center',
                    value: 'id'
                },
                {
                    text: 'Codigo Http Respuesta',
                    align: 'center',
                    value: 'codigo_http_respuesta'
                },
                {
                    text: 'Mensaje Http Respuesta',
                    align: 'center',
                    value: 'mensaje_http_respuesta'
                },
                {
                    text: 'id usuario',
                    align: 'center',
                    value: 'user_id'
                },
                {
                    text: 'payload',
                    align: 'center',
                    value: 'payload'
                },
            ]
        }
    },

    mounted() {
        this.listarLogs();
    },

    methods: {
        async listarLogs() {
            try {
                this.loading.logs = true;
                const data = {
                    paginacion: this.paginacion,
                };
                const res = await this.$axios.post(`logs-registros-rips-sumi/listar`, data);
                this.logs = res.data.data;
                this.paginacion.total = res.data.last_page; 
                this.paginacion.pagina = res.data.current_page; 
            } catch (error) {
                this.$toast.error(error.response?.data?.mensaje || 'Error al listar logs');
            } finally {
                this.loading.logs = false;
            }
        },

        getColor(estado) {
            switch (estado) {
                case 200:
                    return 'success'
                case 500:
                    return 'error'
                case 400:
                    return 'red darken-1'
                default:
                    return 'warning'
            }
        },
    }
}
</script>