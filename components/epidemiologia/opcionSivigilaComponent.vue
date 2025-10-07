<template>
    <v-card elevation="0">
        <v-card-text>
            <v-container class="ml-8">
                <v-row>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.evento" :items="eventos" item-text="nombre_evento"
                            item-value="nombre_evento" dense outlined label="Evento" :loading="loadings.eventos"
                            @focus="listarEventos()"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.cabecera" :items="todasCabeceras" item-text="nombre"
                            item-value="id" dense outlined label="Cabecera" :search-input.sync="buscarCabecera"
                            no-data-text="Escribe al menos 4 letras para buscar"
                            :loading="loadings.cabeceras"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.campo" dense outlined label="Campo" :items="todosCampos"
                            item-text="nombre" item-value="id" :search-input.sync="buscarCampo"
                            no-data-text="Escribe al menos 4 letras para buscar"
                            :loading="loadings.campos"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.opcion" :items="todadOpcione" item-text="nombre" item-value="id"
                            :search-input.sync="buscarOpcion" no-data-text="Escribe al menos 4 letras para buscar" dense
                            outlined label="Opcion" :loading="loadings.opciones"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-btn dark color="primary" @click="listarOpcion()">
                            BUSCAR
                            <v-icon right>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn dark color="error" @click="limpiarOpcion()">
                            LIMPIAR
                            <v-icon right>mdi-close</v-icon>
                        </v-btn>
                        <v-btn v-if="$can('parametrizacionEpidemiologia.crearFichas')" dark color="success"
                            @click="abrirFormularioOpciones">
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
                        :headers="headersFichas" :items="opcione" :loading="cargando"
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
                                        @click="abrirFormularioActualizarOpciones(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Editar opcion</span>
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
                                @input="listarOpcion()">
                            </v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="listarOpcion()">
                            </v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <ModalCrearOpcionSivigila :mostrarFormularioOpciones.sync="mostrarFormularioOpciones"
            @opcionListarCrear="listarOpcion">
        </ModalCrearOpcionSivigila>
        <ModalActualizarOpcionSivigila v-if="opcion"
            :mostrarFormularioActualizarOpciones.sync="mostrarFormularioActualizarOpciones" :opcion="opcion"
            @opcionListarActualizar="listarOpcion"></ModalActualizarOpcionSivigila>
    </v-card>
</template>
<script>
import { mapActions } from 'vuex';
import ModalCrearOpcionSivigila from '~/components/epidemiologia/ModalCrearOpcionSivigila.vue';
import ModalActualizarOpcionSivigila from './ModalActualizarOpcionSivigila.vue';

export default {
    components: {
        ModalCrearOpcionSivigila,
        ModalActualizarOpcionSivigila
    },
    data() {
        return {
            opcione: [],
            opcion: null,
            todadOpcione: [],
            pagina: 1,
            total: 0,
            opcionActual: 10,
            opciones: [5, 10, 20, 50, 100],
            eventos: [],
            todasCabeceras: [],
            todosCampos: [],
            buscarCabecera: null,
            buscarCampo: null,
            buscarOpcion: null,
            cargando: false,
            mostrarFormularioOpciones: false,
            mostrarFormularioActualizarOpciones: false,
            filtro: {
                evento: null,
                cabecera: null,
                campo: null,
                opcion: null
            },
            headersFichas: [
                {
                    text: 'N°',
                    value: 'id',
                    sorteble: true
                },
                {
                    text: 'Nombre opcion',
                    value: 'nombre_opcion',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Campo pertenece',
                    value: 'campo_sivigila.nombre_campo',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Cabecera pertenece',
                    value: 'campo_sivigila.cabecera_sivigila.nombre_cabecera',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Evento pertenece',
                    value: 'campo_sivigila.cabecera_sivigila.evento_sivigila.nombre_evento',
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
                cabeceras: false,
                campos: false,
                opciones: false
            }
        }
    },


    watch: {
        buscarCabecera(val) {
            if (val && val.length == 4) {
                this.listarTodasCabeceras();
            }
        },

        buscarCampo(val) {
            if (val && val.length == 4) {
                this.listarTodosCampos();
            }
        },

        buscarOpcion(val) {
            if (val && val.length == 4) {
                this.listarTodasOpcion();
            }
        }
    },

    mounted() {
        this.listarOpcion();
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        listarOpcion() {
            this.setPreload(true);
            this.cargando = true;
            const params = {
                evento: this.filtro.evento,
                cabecera_id: this.filtro.cabecera,
                campo_id: this.filtro.campo,
                opcion_id: this.filtro.opcion
            }
            this.$axios.post('/opciones-sivigila/listar-opciones?page=' + this.pagina + "&cant=" + this.opcionActual, params)
                .then(res => {
                    this.opcione = res.data.data;
                    this.total = res.data.last_page;
                })
                .catch(err => {
                    console.error('Error al listar las opciones campos sivigila:', err);
                    this.$toast.error('Error al listar los opciones sivigila.');
                })
                .finally(() => {
                    this.setPreload(false);
                    this.cargando = false;
                })
        },

        abrirFormularioOpciones() {
            this.mostrarFormularioOpciones = true;
        },

        abrirFormularioActualizarOpciones(item) {
            this.opcion = item;
            this.mostrarFormularioActualizarOpciones = true;
        },

        async cambiarEstado(item) {
            try {
                const response = await this.$swal({
                    title: "Desea cambiar el estado la opcion?",
                    text: "Al aceptar este mensaje, se cambiara el estado la opcion.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Aceptar",
                })
                if (response.value) {
                    this.setPreload(true);
                    await this.$axios.post(`/opciones-sivigila/cambiar-estado-opcion/${item.id}`)
                    await this.listarOpcion();
                }
            } catch (error) {
                this.$toast.error("Error al cambiar el estado la opcion");
            } finally {
                this.setPreload(false)
            }
        },

        listarEventos() {
            if (this.cargarEventos) return;
            this.loadings.eventos = true;
            this.$axios.post('/eventos-sivigila/listar-eventos')
                .then(res => {
                    this.eventos = res.data;
                })
                .catch(err => {
                    this.$toast.error('Error al listar los eventos sivigila.');
                })
                .finally(() => {
                    this.loadings.eventos = false;
                    this.cargarEventos = true;
                });
        },

        listarTodasCabeceras() {
            this.loadings.cabeceras = true;
            const data = {
                cabecera: this.buscarCabecera
            }
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


        listarTodosCampos() {
            const data = {
                campo: this.buscarCampo
            }
            this.$axios.post('/campos-sivigila/listar-campos', data)
                .then(res => {
                    this.todosCampos = res.data.map((campo) => {
                        return {
                            id: campo.id,
                            nombre_campo: campo.nombre_campo,
                            nombre: `${campo.nombre_campo} (${campo.cabecera_sivigila.nombre_cabecera} / ${campo.cabecera_sivigila.evento_sivigila.nombre_evento})`
                        }
                    });
                })
                .catch(err => {
                    this.$toast.error('Error al listar los campos sivigila.');
                })
        },

        listarTodasOpcion() {
            const data = {
                opcion: this.buscarOpcion
            }
            this.$axios.post('/opciones-sivigila/listar-opciones', data)
                .then(res => {
                    this.todadOpcione = res.data.map((opcion) => {
                        return {
                            id: opcion.id,
                            nombre_opcion: opcion.nombre_opcion,
                            nombre: `${opcion.nombre_opcion} (${opcion.campo_sivigila.nombre_campo} / ${opcion.campo_sivigila.cabecera_sivigila.nombre_cabecera} / ${opcion.campo_sivigila.cabecera_sivigila.evento_sivigila.nombre_evento})`
                        }
                    });
                })
                .catch(err => {
                    this.$toast.error('Error al listar los opciones sivigila.');
                })
        },

        limpiarOpcion() {
            this.filtro = {
                evento: null,
                cabecera: null,
                campo: null,
                opcion: null
            }
            this.listarOpcion();
        }

    }
}
</script>
