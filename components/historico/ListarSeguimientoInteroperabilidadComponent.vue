<template>
    <v-data-table :headers="headers" :items="logs" class="text-no-wrap" hide-default-footer :loading="loading.logs">

        <template v-slot:[`item.user.operador`]="{ item }">
            {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() || 'Sin nombre' }}
        </template>

        <template v-slot:[`item.afiliado`]="{ item }">
            {{ `${item.afiliado?.primer_nombre || ''} ${item.afiliado?.primer_apellido || ''}`.trim() || 'Sin nombre' }}
        </template>

        <template v-slot:top>
            <v-row>
                <v-col cols="12" md="3">
                    <v-select v-model="estado" outlined dense :items="estados" item-text="text" item-value="value"
                        label="Estado" @change="listarLogs(1)"></v-select>
                </v-col>
                <v-col cols="12" md="9">
                    <v-text-field v-model="search" outlined dense placeholder="Buscar ..." append-icon="mdi-magnify"
                        @keyup.enter="listarLogs"></v-text-field>
                </v-col>
            </v-row>

            <!-- modal para asignar cie10 -->
            <v-dialog v-model="dialog" max-width="40%">
                <v-card>
                    <v-card-title>
                        Asignar CIE10
                        <v-spacer></v-spacer>
                        Número de orden #{{ ordenSeleccionada?.orden_id }}
                    </v-card-title>

                    <v-card-text>
                        <v-autocomplete v-model="cie10" :items="cie10s" outlined dense item-text="nombre"
                            item-value="id" label="cie10" required></v-autocomplete>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn small color="primary" @click="setCie10">Aceptar</v-btn>
                        <v-btn small plain color="error" @click="dialog = false">cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- modal para ver detalles -->
            <v-dialog v-model="detalles" max-width="40%">
                <v-card>
                    <v-card-title>
                        Detalles
                        <v-spacer></v-spacer>
                        Número de orden #{{ ordenSeleccionada?.orden_id }}
                    </v-card-title>

                    <v-data-table :headers="headersDetalles" :items="ordenSeleccionada?.detalles">
                        <template v-slot:item.estado="{ item }">
                            <v-chip small dark label :color="item.estado ? 'green' : 'red'">
                                <b>{{ item.estado ? 'Enviado' : 'No enviado' }}</b>
                            </v-chip>
                        </template>
                    </v-data-table>

                    <v-card-actions>
                        <v-btn small plain color="error" @click="detalles = false">cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </template>

        <template v-slot:[`item.acciones`]="{ item }">

            <v-tooltip bottom v-if="item.detalles?.length > 0">
                <template v-slot:activator="{ on }">
                    <v-btn icon color="warning" v-on="on" @click="verDetalles(item)">
                        <v-icon>mdi-text-box</v-icon>
                    </v-btn>
                </template>
                <span>Ver detalles</span>
            </v-tooltip>

            <v-tooltip bottom v-if="item.code === 404 && $can('ordenamiento.enviarFomag')">
                <template v-slot:activator="{ on }">
                    <v-btn icon color="warning" v-on="on" @click="cambiarCie10(item)">
                        <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </template>
                <span>Asignar cie10</span>
            </v-tooltip>

            <v-tooltip bottom v-if="$can('ordenamiento.enviarFomag')">
                <template v-slot:activator="{ on }">
                    <v-btn icon color="warning" v-on="on" @click="enviarFomag(item)">
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </template>
                <span>Enviar a fomag</span>
            </v-tooltip>

            <!-- <span v-else>{{ 'Sin acciones' }}</span> -->

        </template>

        <template v-slot:[`item.user.operador.nombre_completo`]="{ item }">
            <TemplateUsuarioComponent :nombre="item.user.operador.nombre_completo" />
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
            {{ $moment(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template v-slot:[`item.code`]="{ item }">
            <v-chip small dark label :color="getColor(item.code)">
                <b> {{ item.code }}</b>
            </v-chip>
        </template>

        <template v-slot:footer="{ item }">
            <div class="text-center mt-8">
                <v-pagination v-model="paginacion.current_page" :length="paginacion.last_page" @input="listarLogs"
                    :total-visible="6"></v-pagination>
            </div>
        </template>

    </v-data-table>
</template>
<script>
import { mapActions } from 'vuex'
import TemplateUsuarioComponent from '@/components/usuario/TemplateUsuarioComponent.vue'
export default {
    components: {
        TemplateUsuarioComponent
    },
    data() {
        return {
            loading: {
                logs: false
            },
            logs: [],
            search: '',
            estado: 0,
            dialog: false,
            detalles: false,
            cie10: null,
            ordenSeleccionada: null,
            cie10s: [],
            estados: [
                { text: 'Todos', value: 0 },
                { text: 'Enviado', value: 1 },
                { text: 'No Enviado', value: 2 },
            ],
            paginacion: {
                current_page: 1,
                last_page: 1,
            },
            headers: [
                {
                    text: 'N° Orden',
                    value: 'orden_id',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: 'N° Documento',
                    value: 'orden.consulta.afiliado.numero_documento',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: 'Afiliado',
                    value: 'orden.consulta.afiliado.nombre_completo',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: 'Código de Error',
                    value: 'code',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: 'Descripción',
                    value: 'descripcion',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: 'Fecha',
                    value: 'created_at',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: 'Usuario',
                    value: 'user.operador.nombre_completo',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: 'Identificador',
                    value: 'id',
                },
                {
                    text: 'Acciones',
                    value: 'acciones',
                    sortable: false,
                    align: 'center'
                },
            ],
            headersDetalles: [
                {
                    text: 'N° Procedimiento',
                    value: 'procedimiento_id',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: 'Codigo cup',
                    value: 'cup_codigo',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: 'Observacion',
                    value: 'observacion',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: 'Estado',
                    value: 'estado',
                    sortable: true,
                    align: 'left'
                }
            ]
        }
    },

    watch: {
        dialog: {
            handler: function (val) {
                if (!val) {
                    this.ordenSeleccionada = null;
                    this.cie10 = null;
                }
            },
        },
        detalles: {
            handler: function (val) {
                if (!val) {
                    this.ordenSeleccionada = null;
                }
            },
        }
    },

    mounted() {
        this.listarLogs()
        this.getCie10s()
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        async getCie10s() {
            try {
                const response = await fetch('/cie10s.json');
                const data = await response.json();
                this.cie10s = data.map(item => {
                    return {
                        id: item.id,
                        nombre: item.codigo_cie10 + ' - ' + item.nombre
                    };
                });
            } catch (error) {
                this.$toast.error('Error al obtener los cie10s')
            }
        },

        async listarLogs(page = 1) {
            try {
                this.loading.logs = true
                const response = await this.$axios.get('ordenamiento/logs/interoperabilidad',
                    {
                        params: {
                            page,
                            estado: this.estado,
                            filtro: this.search
                        }
                    }
                )
                this.paginacion = {
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                }
                this.logs = response.data.data
            } catch (error) {
                this.$toast.error('error al listar los logs')
            } finally {
                this.loading.logs = false
            }
        },

        async enviarFomag(item) {

            const confirmacion = confirm('seguro quieres enviar esta orden a fomag ?')
            if (!confirmacion) {
                return;
            }

            try {
                this.setPreload(true);

                const response = await this.$axios.post(`ordenamiento/enviar-a-fomag/${item.orden_id}`);
                this.$toast.success('la orden se ha enviado a fomag');
            } catch (error) {
                this.$toast.error(error.response.data.error || 'Error al enviar la orden a fomag');
            } finally {
                this.setPreload(false);
            }
        },

        async setCie10() {

            if (!this.ordenSeleccionada || !this.cie10) {
                return;
            }

            try {
                this.setPreload(true);
                const response = await this.$axios.post('ordenamiento/logs/asignar-cie10', {
                    cie10_id: this.cie10,
                    consulta_id: this.ordenSeleccionada.orden.consulta.id,
                })
                this.$toast.success('cie10 asignado correctamente');
                //await this.$axios.post('ordenamiento/enviar-a-fomag/' + this.ordenSeleccionada.orden_id)
            } catch (error) {
                this.$toast.error('Error al asignar el cie10')
            } finally {
                this.setPreload(false);
                this.dialog = false;
            }
        },

        cambiarCie10(item) {
            this.ordenSeleccionada = item;
            this.dialog = true;
            this.cie10 = null;
        },

        verDetalles(item) {
            this.ordenSeleccionada = item;
            this.detalles = true;
        },

        getColor(code) {
            if (code < 200) {
                return 'gray'
            }
            if (code >= 200 && code < 300) {
                return 'green'
            }
            if (code >= 400 && code < 500) {
                return 'orange'
            }
            return 'red'
            // color: log.code >= 200 && log.code < 300 ? 'green' :
            // 				log.code >= 400 && log.code < 500 ? 'orange' :
            // 					log.code >= 500 ? 'red' : 'gray'
        }

    }

}

</script>
