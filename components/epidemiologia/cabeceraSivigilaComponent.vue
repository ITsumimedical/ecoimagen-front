<template>
    <v-card elevation="0">
        <v-card-text>
            <v-container class="ml-8">
                <v-row>
                    <v-col cols="12" sm="12" md="3">
                        <v-autocomplete v-model="filtro.evento" :items="eventos" item-text="nombre_evento"
                        item-value="nombre_evento" dense outlined label="Evento" :loading="loadings.eventos" @focus="listarEventos()"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-autocomplete v-model="filtro.cabecera" :items="todasCabeceras" item-text="nombre" item-value="id" dense outlined label="Cabecera" :loading="loadings.cabeceras" :search-input.sync="buscarCabecera" no-data-text="Escribe al menos 4 letras para buscar"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="5">
                        <v-btn dark color="primary" @click="listarCabeceras()">
                            BUSCAR
                            <v-icon right>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn dark color="error" @click="limpiarCabeceras()">
                            LIMPIAR
                            <v-icon right>mdi-close</v-icon>
                        </v-btn>
                        <v-btn v-if="$can('parametrizacionEpidemiologia.crearFichas')" dark color="success" @click="abrirFormularioCabecera">
                            CREAR
                            <v-icon right>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-row dense>
                <v-col cols="12" md="12" ms="12" class="mt-2">
                </v-col>
                <v-col cols="12" md="12" ms="6">
                    <v-data-table dense hide-default-footer disable-pagination no-data-text="Sin datos para mostar"
                        :headers="headersFichas" :items="cabeceras" :loading="cargando" :items-per-page="opcionActual"
                        loading-text="Cargando... Espere por favor">
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
                                    <v-icon color="warning" small v-bind="attrs" v-on="on"
                                        @click="abrirFormularioActualizarCabecera(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Editar cabecera</span>
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
                                @input="listarCabeceras()">
                            </v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="listarCabeceras()">
                            </v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <ModalCrearCabeceraSivigila :mostrarFormularioCabecera.sync="mostrarFormularioCabecera"
            @cabeceraListarCrear="listarCabeceras"></ModalCrearCabeceraSivigila>
        <ModalActualizarCabeceraSivigila v-if="cabecera"
            :mostrarFormularioActualizarCabecera.sync="mostrarFormularioActualizarCabecera" :cabecera="cabecera"
            @cabeceraListarActualizar="listarCabeceras"></ModalActualizarCabeceraSivigila>
    </v-card>
</template>
<script>
import { mapActions } from 'vuex';
import ModalCrearCabeceraSivigila from '~/components/epidemiologia/ModalCrearCabeceraSivigila.vue'
import ModalActualizarCabeceraSivigila from './ModalActualizarCabeceraSivigila.vue';

export default {
    components: {
        ModalCrearCabeceraSivigila,
        ModalActualizarCabeceraSivigila
    },
    data() {
        return {
            cabeceras: [],
            cabecera: null,
            todasCabeceras: [],
            eventos: [],
            pagina: 1,
            total: 0,
            opcionActual: 10,
            opciones: [5, 10, 20, 50, 100],
            cargando: false,
            cargarEventos: false,
            mostrarFormularioCabecera: false,
            mostrarFormularioActualizarCabecera: false,
            buscarCabecera: null,
            filtro: {
                evento: null,
                cabecera: null,
            },
            headersFichas: [
                {
                    text: 'N°',
                    value: 'id',
                    sorteble: true
                },
                {
                    text: 'Nombre cabecera',
                    value: 'nombre_cabecera',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Evento pertenece',
                    value: 'evento_sivigila.nombre_evento',
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
            ],
            loadings: {
                eventos: false,
                cabeceras: false
            }
        }
    },

    watch: {
        buscarCabecera(val){
            if(val && val.length == 4){
                this.listarTodasCabeceras();
            }
        }
    },

    mounted() {
        this.listarCabeceras();
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        listarCabeceras() {
            this.setPreload(true);
            this.cargando = true;
            const params = {
                evento: this.filtro.evento,
                cabecera_id: this.filtro.cabecera,
            }
            this.$axios.post('/cabeceras-sivigila/listar-cabeceras?page=' + this.pagina + "&cant=" + this.opcionActual, params)
                .then(res => {
                    this.cabeceras = res.data.data;
                    this.total = res.data.last_page;
                })
                .catch(err => {
                    console.error('Error al listar las cabeceras sivigila:', err);
                    this.$toast.error('Error al listar las cabeceras sivigila.');
                })
                .finally(() => {
                    this.setPreload(false);
                    this.cargando = false;
                })
        },

        abrirFormularioCabecera() {
            this.mostrarFormularioCabecera = true;
        },

        abrirFormularioActualizarCabecera(item) {
            this.cabecera = item;
            this.mostrarFormularioActualizarCabecera = true;
        },

        listarEventos() {
            if (this.cargarEventos) return;
            this.loadings.eventos = true;
            this.$axios.post('/eventos-sivigila/listar-eventos')
                .then(res => {
                    this.eventos = res.data;
                    this.cargarEventos = true;
                })
                .catch(err => {
                    console.error('Error al listar los eventos sivigila:', err);
                    this.$toast.error('Error al listar los eventos sivigila.');
                })
                .finally(() => {
                    this.loadings.eventos = false;
                });
        },

        listarTodasCabeceras() {
            const data = {
                cabecera: this.buscarCabecera
            }
            this.loadings.cabeceras = true;
            this.$axios.post('/cabeceras-sivigila/listar-cabeceras', data)
                .then(res => {
                    this.todasCabeceras = res.data.map((cabecera) => {
                        return {
                            id: cabecera.id,
                            nombre_cabecera: cabecera.nombre_cabecera,
                            nombre: `${cabecera.nombre_cabecera} (${cabecera.evento_sivigila.nombre_evento})`,
                        }
                    });
                })
                .catch(err => {
                    this.$toast.error('Error al listar las cabeceras sivigila.');
                })
                .finally(() => {
                    this.loadings.cabeceras = false;
                });
        },

        async cambiarEstado(item) {
            try {
				const response = await this.$swal({
					title: "Desea cambiar el estado de la cabecera?",
					text: "Al aceptar este mensaje, se cambiara el estado de la cabecera.",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#28a745",
					cancelButtonColor: "#d33",
                    cancelButtonText: "Cancelar",
					confirmButtonText: "Aceptar",
				})
				if (response.value) {
					this.setPreload(true);
					await this.$axios.post(`/cabeceras-sivigila/cambiar-estado-cabecera/${item.id}`)
					await this.listarCabeceras();
				}
			} catch (error) {
				this.$toast.error("Error al cambiar el estado de la cabecera");
			} finally {
				this.setPreload(false)
			}
        },

        limpiarCabeceras() {
            this.filtro = {
                evento: null,
                cabecera: null,
            }
            this.listarCabeceras();
        }

    }
}
</script>
