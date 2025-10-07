<template>
    <v-card elevation="0">
        <v-card-text>
            <v-row dense>
                <v-col cols="12" md="12" ms="12" align="right">
                    <v-btn v-if="$can('parametrizacionEpidemiologia.crearFichas')" small dark color="success" @click="abrirFormularioEvento">
                        CREAR
                        <v-icon right>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="12" md="12" ms="12" class="mt-2">
                </v-col>
                <v-col cols="12" md="12" ms="6">
                    <v-data-table dense hide-default-footer disable-pagination no-data-text="Sin datos para mostar"
                        :headers="headersFichas" :items="eventos" :loading="cargando"
                        loading-text="Cargando... Espere por favor">
                        <template v-slot:item.gestante="{ item }">
                            <v-chip label dark small :color="item?.gestante == true ? 'green' : 'red'">
                                <b>{{ item?.gestante == true ? 'SI' : 'NO' }}</b>
                            </v-chip>
                        </template>
                        <template v-slot:item.created_at="{ item }">
                            {{ $moment(item?.created_at).format("DD-MM-YYYY") }}
                        </template>
                        <template v-slot:item.estado="{ item }">
                            <v-chip label dark small :color="item?.estado_id == 1 ? 'green' : 'red'">
                                <b>{{ item?.estado_id == true ? 'ACTIVO' : 'INACTIVO' }}</b>
                            </v-chip>
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="warning" small v-bind="attrs" v-on="on" @click="abrirModalEditarEvento(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Editar evento</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon small
                                        :color="item.estado_id == 1 ? 'success' : item.estado_id == 2 ? 'error' : 'error'"
                                        v-bind="attrs" v-on="on" @click="cambiarEstado(item)">
                                        {{ item.estado_id == 1 ? 'mdi-toggle-switch-off' : item.estado_id == 2 ?
                                            'mdi-toggle-switch' : 'mdi-toggle-switch' }}
                                    </v-icon>
                                </template>
                                <span>Cambiar estado</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                    <v-row no-gutters>
                        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                            <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                @input="listarEventos()">
                            </v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="listarEventos()">
                            </v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <ModalCrearEnventoSivigila :mostrarFormularioEvento.sync="mostrarFormularioEvento"
            @eventoListarCrear="listarEventos">
        </ModalCrearEnventoSivigila>
        <ModalActualizarEventoSivigila v-if="evento" :mostrarFormularioActualizarEvento.sync="mostrarFormularioActualizarEvento" :evento="evento"
            @eventoListarActualizar="listarEventos"></ModalActualizarEventoSivigila>
    </v-card>
</template>
<script>
import { mapActions } from 'vuex';
import ModalCrearEnventoSivigila from '~/components/epidemiologia/ModalCrearEnventoSivigila.vue';
import ModalActualizarEventoSivigila from './ModalActualizarEventoSivigila.vue';

export default {
    components: {
        ModalCrearEnventoSivigila,
        ModalActualizarEventoSivigila,
    },
    data() {
        return {
            eventos: [],
            evento: null,
            pagina: 1,
            total: 0,
            opcionActual: 10,
            opciones: [5, 10, 20, 50, 100],
            cargando: false,
            mostrarFormularioEvento: false,
            mostrarFormularioActualizarEvento: false,
            headersFichas: [
                {
                    text: 'N°',
                    value: 'id',
                    align: 'center',
                    sorteble: true
                },
                {
                    text: 'Nombre evento',
                    value: 'nombre_evento',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Edad minima',
                    value: 'rango_edad_inicio',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Edad maxima',
                    value: 'rango_edad_final',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Fecha Creacion',
                    value: 'created_at',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Evento para gestantes',
                    value: 'gestante',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Estado',
                    value: 'estado',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Acciones',
                    value: 'acciones',
                    align: 'center',
                    sorteble: false
                }
            ]
        }
    },
    mounted() {
        this.listarEventos();
    },
    methods: {
        ...mapActions('app', ['setPreload']),
        listarEventos() {
            this.setPreload(true);
            this.cargando = true;
            this.$axios.post('/eventos-sivigila/listar-eventos?page=' + this.pagina + "&cant=" + this.opcionActual)
                .then(res => {
                    this.eventos = res.data.data;
                    this.total = res.data.last_page;
                })
                .catch(err => {
                    console.error('Error al listar los eventos sivigila:', err);
                    this.$toast.error('Error al listar los eventos sivigila.');
                })
                .finally(() => {
                    this.setPreload(false);
                    this.cargando = false;
                })
        },

        abrirFormularioEvento() {
            this.mostrarFormularioEvento = true
        },

        abrirModalEditarEvento(item) {
            this.evento = item;
            this.mostrarFormularioActualizarEvento = true;
        },

        async cambiarEstado(item) {
            try {
				const response = await this.$swal({
					title: "Desea cambiar el estado del evento?",
					text: "Al aceptar este mensaje, se cambiara el estado del evento.",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#28a745",
					cancelButtonColor: "#d33",
					cancelButtonText: "Cancelar",
					confirmButtonText: "Aceptar",
				})
				if (response.value) {
					this.setPreload(true);
					await this.$axios.post(`/eventos-sivigila/cambiar-estado-evento/${item.id}`)
					await this.listarEventos();
				}
			} catch (error) {
				this.$toast.error("Error al cambiar el estado del evento");
			} finally {
				this.setPreload(false)
			}
        }

    }
}
</script>
