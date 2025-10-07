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
                            item-value="id" dense outlined label="Cabecera" :search-input.sync="buscarCabecera" :loading="loadings.cabeceras"
                            no-data-text="Escribe al menos 4 letras para buscar"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.campo" dense outlined label="Campo" :items="todosCampos"
                            item-text="nombre" item-value="id" :search-input.sync="buscarCampo" :loading="loadings.campos"
                            no-data-text="Escribe al menos 4 letras para buscar"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.tipo" dense outlined label="Tipo" :items="tipoCampo"
                            item-text="text" item-value="value"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-btn dark color="primary" @click="listarCampos()">
                            BUSCAR
                            <v-icon right>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn dark color="error" @click="limpiarCampo()">
                            LIMPIAR
                            <v-icon right>mdi-close</v-icon>
                        </v-btn>
                        <v-btn v-if="$can('parametrizacionEpidemiologia.crearFichas')" dark color="success"
                            @click="abrirFormularioCampo">
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
                        :headers="headersFichas" :items="campos" :loading="cargando"
                        loading-text="Cargando... Espere por favor">
                        <template v-slot:item.tipo_campo="{ item }">
                            {{ item?.tipo_campo === 'texto' ? 'Texto' : item?.tipo_campo === 'numero'
                                ? 'Numero' : item?.tipo_campo === 'seleccion_simple' ? 'Seleccion simple/unica' :
                                    item?.tipo_campo === 'seleccion_multiple' ? 'Seleccion multiple' : item?.tipo_campo ===
                                        'fecha' ? 'Fecha' : item?.tipo_campo === 'hora' ? 'Hora' : 'SIN TIPO'
                            }}
                        </template>
                        <template v-slot:item.condicion="{ item }">
                            <p>{{ item?.condicion !== null ? item?.condicion : 'SIN CONDICIÓN' }}</p>
                        </template>
                        <template v-slot:item.comparacion="{ item }">
                            <p>{{ item?.comparacion !== null ? item?.campo_sivigila?.nombre_campo : 'SIN COMPARACIÓN' }}
                            </p>
                        </template>
                        <template v-slot:item.obligatorio="{ item }">
                            <v-chip label small dark :color="item?.obligatorio === true ? 'red' : 'blue darken-1'">
                                <b>{{ item?.obligatorio == true ? 'OBLIGATORIO' : 'NO OBLIGATORIO' }}</b>
                            </v-chip>
                        </template>
                        <template v-slot:item.max="{ item }">
                            <v-chip label small dark
                                :color="item?.tipo_campo === 'fecha' && item?.max === true ? 'red' : 'blue darken-1'">
                                <b v-if="item?.tipo_campo === 'fecha'">
                                    {{ item?.max === true ? 'SI' : 'NO' }}
                                </b>
                                <b v-else>NO APLICA</b>
                            </v-chip>
                        </template>
                        <template v-slot:item.estado="{ item }">
                            <v-chip label dark small :color="item?.estado_id == 1 ? 'green' : 'red'">
                                <b>{{ item?.estado_id == true ? 'ACTIVO' : 'INACTIVO' }}</b>
                            </v-chip>
                        </template>
                        <template v-slot:item.created_at="{ item }">
                            {{ $moment(item?.created_at).format("DD-MM-YYYY") }}
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="warning" small v-bind="attrs" v-on="on"
                                        @click="abrirFormularioCampoActualizar(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Editar campo</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" small v-bind="attrs" v-on="on"
                                        @click="abrirFormularioCondicionarCampo(item)">
                                        mdi-note-check-outline
                                    </v-icon>
                                </template>
                                <span>Condicionar campo</span>
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
                                @input="listarCampos()">
                            </v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="listarCampos()">
                            </v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <ModalCrearCampoSivigila :mostrarFormularioCampos.sync="mostrarFormularioCampos"
            @campoListarCrear="listarCampos">
        </ModalCrearCampoSivigila>

        <ModalActualizarCampoSivigila v-if="campo"
            :mostrarFormularioCamposActualizar.sync="mostrarFormularioCamposActualizar" :campo="campo"
            @campoListarActualizar="listarCampos" ref="listarActualizar">
        </ModalActualizarCampoSivigila>

        <ModalCrearCondicionCampo v-if="campoCondicion"
            :mostrarFormularioCondicionarCampo.sync="mostrarFormularioCondicionarCampo" :campoCondicion="campoCondicion"
            ref="listar" @camposlistar="listarCampos">
        </ModalCrearCondicionCampo>
    </v-card>
</template>
<script>
import { mapActions } from 'vuex';
import ModalCrearCampoSivigila from '~/components/epidemiologia/ModalCrearCampoSivigila.vue';
import ModalActualizarCampoSivigila from '~/components/epidemiologia/ModalActualizarCampoSivigila.vue';
import ModalCrearCondicionCampo from '~/components/epidemiologia/ModalCrearCondicionCampo.vue';


export default {
    components: {
        ModalCrearCampoSivigila,
        ModalActualizarCampoSivigila,
        ModalCrearCondicionCampo
    },

    data() {
        return {
            campos: [],
            campo: null,
            eventos: [],
            cargarEventos: false,
            todasCabeceras: [],
            buscarCabecera: null,
            todosCampos: [],
            buscarCampo: null,
            campoCondicion: null,
            pagina: 1,
            total: 0,
            opcionActual: 10,
            opciones: [5, 10, 20, 50, 100],
            cargando: false,
            mostrarFormularioCampos: false,
            mostrarFormularioCamposActualizar: false,
            mostrarFormularioCondicionarCampo: false,
            filtro: {
                evento: null,
                cabecera: null,
                campo: null,
                tipo: null
            },
            headersFichas: [
                {
                    text: 'N°',
                    value: 'id',
                    sorteble: true
                },
                {
                    text: 'Nombre campo',
                    value: 'nombre_campo',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Tipo campo',
                    value: 'tipo_campo',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Cabecera pertenece',
                    value: 'cabecera_sivigila.nombre_cabecera',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Evento pertenece',
                    value: 'cabecera_sivigila.evento_sivigila.nombre_evento',
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
                    text: 'Condición',
                    value: 'condicion',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Campo comparación',
                    value: 'comparacion',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Es obligatorio',
                    value: 'obligatorio',
                    align: 'center',
                    sorteble: false
                },
                {
                    text: 'Condicion fecha',
                    value: 'max',
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
            tipoCampo: [
                { text: 'Texto', value: 'texto' },
                { text: 'Numero', value: 'numero' },
                { text: 'Seleccion simple/unica', value: 'seleccion_simple' },
                { text: 'Seleccion multiple', value: 'seleccion_multiple' },
                { text: 'Fecha', value: 'fecha' },
                { text: 'Hora', value: 'hora' },
            ],
            loadings: {
                eventos: false,
                cabeceras: false,
                campos: false
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
        }
    },

    mounted() {
        this.listarCampos();
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        listarCampos() {
            this.setPreload(true);
            this.cargando = true;
            const params = {
                evento: this.filtro.evento,
                cabecera_id: this.filtro.cabecera,
                campo_id: this.filtro.campo,
                tipo: this.filtro.tipo,
            }
            this.$axios.post('/campos-sivigila/listar-campos?page=' + this.pagina + "&cant=" + this.opcionActual, params)
                .then(res => {
                    this.campos = res.data.data;
                    this.total = res.data.last_page;
                })
                .catch(err => {
                    console.error('Error al listar los campos sivigila:', err);
                    this.$toast.error('Error al listar los campos sivigila.');
                })
                .finally(() => {
                    this.setPreload(false);
                    this.cargando = false;
                })
        },

        abrirFormularioCampo() {
            this.mostrarFormularioCampos = true;
        },

        abrirFormularioCampoActualizar(item) {
            this.campo = item;
            this.mostrarFormularioCamposActualizar = true;
        },

        async abrirFormularioCondicionarCampo(item) {
            const response = await this.$swal({
                title: "Recuerda!!",
                text: "Para poder aplicar una condición a un campo, primero debes crear tanto sus opciones, como el campo con el que se relacionará.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
            })
            if (response.value) {
                this.campoCondicion = item;
                this.mostrarFormularioCondicionarCampo = true;
                this.$nextTick(() => {
                    this.$refs.listar.listarCampos();
                    this.$refs.listar.listarOpcion();
                });
            }
        },

        async cambiarEstado(item) {
            try {
                const response = await this.$swal({
                    title: "Desea cambiar el estado del campo?",
                    text: "Al aceptar este mensaje, se cambiara el estado del campo.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Aceptar",
                })
                if (response.value) {
                    this.setPreload(true);
                    await this.$axios.post(`/campos-sivigila/cambiar-estado-campo/${item.id}`)
                    await this.listarCampos();
                }
            } catch (error) {
                this.$toast.error("Error al cambiar el estado del campo");
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
                    console.error('Error al listar los eventos sivigila:', err);
                    this.$toast.error('Error al listar los eventos sivigila.');
                })
                .finally(() => {
                    this.cargarEventos = true;
                    this.loadings.eventos = false;
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
            this.loadings.campos = true;
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
                .finally(() => {
                    this.loadings.campos = false;
                });
        },

        limpiarCampo() {
            this.filtro = {
                evento: null,
                cabecera: null,
                campo: null,
                tipo: null
            }
            this.listarCampos();
        }

    }
}
</script>
