<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Registro de Fichas Epidemiológicas</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>

        <template v-if="$can('epidemiologia.verFichasPorCapa')">
            <v-container class="ml-8">
                <v-row>
                    <v-col cols="12" sm="12" md="1">
                        <v-text-field v-model="filtros.fichaId" dense outlined label="Id. Registro"
                            hint="Ingrese el ID del registro"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-text-field v-model="filtros.documento" dense outlined label="No. Documento"
                            hint="Ingrese el numero de documento del paciente"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtros.evento_sivigila" :items="eventos" dense outlined label="Evento"
                            item-text="nombre_evento" item-value="nombre_evento" @click="listarEstados()" />
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtros.estado_registro" :items="estados" dense outlined label="Estado"
                            item-text="text" item-value="value" @click="listarEstados()" />
                    </v-col>
                    <v-col cols="12" sm="12" md="5">
                        <v-btn color="primary" @click="listarConsultaDiagnosticoEpidemiologia()">Buscar<v-icon
                                right>mdi-magnify</v-icon></v-btn>
                        <v-btn color="error" @click="limpiarFiltros()">Limpiar<v-icon right>mdi-close</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-row>
                <v-col cols="12" md="12" sm="12">

                    <v-data-table disable-pagination hide-default-footer dense :headers="headers"
                        :items="epidemiologias" :loading="cargandoCapa" :items-per-page="opcionActual"
                        loading-text="Cargando... Espere por favor" no-data-text="Sin datos para mostrar">
                        <template v-slot:item.created_at="{ item }">
                            {{ $moment(item.created_at).format("DD-MM-YYYY") }}
                        </template>

                        <template v-slot:[`item.estado_id`]="{ item }">
                            <v-chip small label
                                :color="item.estado_id == 10 ? 'warning' : item.estado_id == 5 ? 'error' : 'success'"
                                dark>
                                {{ item.estado_id == 10 ? 'Pendiente'
                                    : item.estado_id == 5 ? 'Devuelto' : 'Revisado' }}
                            </v-chip>
                        </template>

                        <template v-slot:[`item.acciones`]="{ item }">

                            <v-tooltip top v-if="item.estado_id == 10 || item.estado_id == 5">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        :color="item.estado_id == 10 ? 'success' : item.estado_id == 5 ? 'success' : 'error'"
                                        v-bind="attrs" v-on="on" @click="estadoFormularioDiagnostico(item)">
                                        {{ item.estado_id == 10 ? 'mdi-toggle-switch-off' : item.estado_id == 5 ?
                                        'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
                                    </v-icon>
                                </template>
                                <span>Marcar Como revisado</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="warning" v-bind="attrs" v-on="on"
                                        @click="abrirFormularioEpidemiologia(item)">
                                        mdi-text-box-edit-outline
                                    </v-icon>
                                </template>
                                <span>Editar ficha</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="error" v-bind="attrs" v-on="on" @click="abrirModalDevolucion(item)">
                                        mdi-clipboard-text-off-outline
                                    </v-icon>
                                </template>
                                <span>Devolver ficha</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" v-bind="attrs" v-on="on"
                                        @click="descargarDiagnosticoSivigila(item)">
                                        mdi-file-download-outline
                                    </v-icon>
                                </template>
                                <span>Descargar ficha</span>
                            </v-tooltip>

                        </template>

                    </v-data-table>
                </v-col>
            </v-row>

            <v-row no-gutters style="background-color: white;">
                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                    <v-pagination v-model="paginaCapa" class="my-4" :length="totalCapa" :total-visible="9"
                        @input="listarConsultaDiagnosticoEpidemiologia">
                    </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActualCapa" :items="opcionesCapa" dense outlined small
                        @change="listarConsultaDiagnosticoEpidemiologia()">
                    </v-select>
                </v-col>
            </v-row>
        </template>
        <template v-if="$can('epidemiologia.verTodasLasFichasEpidemiologicas')">
            <v-container class="ml-8">
                <v-row>
                    <v-col cols="12" sm="12" md="1">
                        <v-text-field v-model="filtro.fichaId" dense outlined label="Id. Registro"
                            hint="Ingrese el ID del registro"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="1">
                        <v-text-field v-model="filtro.documento" dense outlined label="No. Documento"
                            hint="Ingrese el numero de documento del paciente"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.evento_sivigila" :items="eventos" dense outlined label="Evento"
                            item-text="nombre_evento" item-value="nombre_evento" @click="listarEstados()" />
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.estado_registro" :items="estados" dense outlined label="Estado"
                            item-text="text" item-value="value" @click="listarEstados()" />
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete v-model="filtro.ips" :items="ips" dense outlined label="IPS" item-text="nombre"
                            item-value="id" :search-input.sync="buscarRep" :loading="cargarRep"/>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-btn color="primary" @click="listarTodasConsultaDiagnosticoEpidemiologia()">Buscar<v-icon
                                right>mdi-magnify</v-icon></v-btn>
                        <v-btn color="error" @click="limpiarFiltroTodo()">Limpiar<v-icon
                                right>mdi-close</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-row>
                <v-col cols="12" md="12" sm="12">

                    <v-data-table disable-pagination hide-default-footer dense :headers="headersTodasLasCapas"
                        :items="epidemiologiaTodas" :loading="cargando" :items-per-page="opcionActual"
                        loading-text="Cargando... Espere por favor" no-data-text="Sin datos para mostrar">
                        <template v-slot:item.created_at="{ item }">
                            {{ $moment(item.created_at).format("DD-MM-YYYY") }}
                        </template>

                        <template v-slot:[`item.estado_id`]="{ item }">
                            <v-chip small label
                                :color="item.estado_id == 10 ? 'warning' : item.estado_id == 5 ? 'error' : 'success'"
                                dark>
                                {{ item.estado_id == 10 ? 'Pendiente'
                                    : item.estado_id == 5 ? 'Devuelto' : 'Revisado' }}
                            </v-chip>
                        </template>

                        <template v-slot:[`item.acciones`]="{ item }">

                            <v-tooltip top v-if="item.estado_id == 10 || item.estado_id == 5">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        :color="item.estado_id == 10 ? 'success' : item.estado_id == 5 ? 'success' : 'error'"
                                        v-bind="attrs" v-on="on" @click="estadoFormularioDiagnostico(item)">
                                        {{ item.estado_id == 10 ? 'mdi-toggle-switch-off' : item.estado_id == 5 ?
                                        'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
                                    </v-icon>
                                </template>
                                <span>Marcar Como revisado</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="warning" v-bind="attrs" v-on="on"
                                        @click="abrirFormularioEpidemiologia(item)">
                                        mdi-text-box-edit-outline
                                    </v-icon>
                                </template>
                                <span>Editar ficha</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="error" v-bind="attrs" v-on="on" @click="abrirModalDevolucion(item)">
                                        mdi-clipboard-text-off-outline
                                    </v-icon>
                                </template>
                                <span>Devolver ficha</span>
                            </v-tooltip>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" v-bind="attrs" v-on="on"
                                        @click="descargarDiagnosticoSivigila(item)">
                                        mdi-file-download-outline
                                    </v-icon>
                                </template>
                                <span>Descargar ficha</span>
                            </v-tooltip>

                        </template>

                    </v-data-table>
                </v-col>
            </v-row>

            <v-row no-gutters style="background-color: white;">
                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="listarTodasConsultaDiagnosticoEpidemiologia">
                    </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense outlined small
                        @change="listarTodasConsultaDiagnosticoEpidemiologia()">
                    </v-select>
                </v-col>
            </v-row>
        </template>
        <FichaEpidemiologiaEditar :mostrarFormularioEpidemiologia.sync="mostrarFormularioEpidemiologia"
            :diagnosticoSeleccionadoEdit="diagnosticoSeleccionadoEdit" ref="respuestas" />

        <ModalDevolucionFichaEpidemiologica :mostarModalDevolucion.sync="mostarModalDevolucion"
            :infoAfiliadoRegistroFicha="infoAfiliadoRegistroFicha"
            @actualizarListado="listarConsultaDiagnosticoEpidemiologia"
            @actualizarListadoTodas="listarTodasConsultaDiagnosticoEpidemiologia" ref="listarObservaciones" />

    </v-card>

</template>

<script>
import { mapActions } from 'vuex';
import FichaEpidemiologiaEditar from '~/components/historia/formularios/FichaEpidemiologiaEditar.vue';
import ModalDevolucionFichaEpidemiologica from '~/components/epidemiologia/ModalDevolucionFichaEpidemiologica.vue';

export default {
    components: {
        FichaEpidemiologiaEditar,
        ModalDevolucionFichaEpidemiologica,
    },
    data() {
        return {
            filtros: {
                documento: null,
                estado_registro: null,
                evento_sivigila: null,
                fichaId: null,
            },
            filtro: {
                documento: null,
                estado_registro: null,
                ips: null,
                evento_sivigila: null,
                fichaId: null,
            },
            estados: [],
            ips: [],
            expanded: [],
            epidemiologias: [],
            epidemiologiaTodas: [],
            paginaCapa: 1,
            totalCapa: 0,
            opcionActualCapa: 5,
            opcionesCapa: [5, 10, 20, 50, 100],
            pagina: 1,
            total: 0,
            opcionActual: 5,
            opciones: [5, 10, 20, 50, 100],
            cargando: false,
            cargandoCapa: false,
            headers: [
                {
                    text: 'ID',
                    align: 'center',
                    paginaCapa: 1,
                    totalCapa: 0,
                    opcionActualCapa: 5,
                    sortable: false,
                    value: 'id',
                },
                {
                    text: 'N. Documento',
                    align: 'center',
                    sortable: false,
                    value: 'consulta.afiliado.numero_documento',
                },
                {
                    text: 'Nombre del paciente',
                    align: 'center',
                    sortable: false,
                    value: 'consulta.afiliado.nombre_completo',
                },
                {
                    text: 'Evento',
                    align: 'center',
                    sortable: false,
                    value: 'evento_sivigila.nombre_evento',
                },
                {
                    text: 'Diagnóstico',
                    align: 'center',
                    sortable: false,
                    value: 'cie10.codigo_cie10',
                },
                {
                    text: 'IPS Reporta',
                    align: 'center',
                    sortable: false,
                    value: 'consulta.afiliado.ips.nombre',
                },
                {
                    text: 'Medico registra',
                    align: 'center',
                    sortable: false,
                    value: 'consulta.medico_ordena.operador.nombre_completo',
                },
                {
                    text: 'Fecha creacion',
                    align: 'center',
                    sortable: false,
                    value: 'created_at',
                },
                {
                    text: 'Estado',
                    align: 'center',
                    sortable: false,
                    value: 'estado_id',
                },
                {
                    text: 'Acciones',
                    align: 'center',
                    sortable: false,
                    value: 'acciones',
                },
            ],
            headersTodasLasCapas: [
                {
                    text: 'ID',
                    align: 'center',
                    pagina: 1,
                    total: 0,
                    opcionActual: 5,
                    sortable: false,
                    value: 'id',
                },
                {
                    text: 'N. Documento',
                    align: 'center',
                    sortable: false,
                    value: 'consulta.afiliado.numero_documento',
                },
                {
                    text: 'Nombre del paciente',
                    align: 'center',
                    sortable: false,
                    value: 'consulta.afiliado.nombre_completo',
                },
                {
                    text: 'Evento',
                    align: 'center',
                    sortable: false,
                    value: 'evento_sivigila.nombre_evento',
                },
                {
                    text: 'Diagnóstico',
                    align: 'center',
                    sortable: false,
                    value: 'cie10.codigo_cie10',
                },
                {
                    text: 'IPS Reporta',
                    align: 'center',
                    sortable: false,
                    value: 'consulta.afiliado.ips.nombre',
                },
                {
                    text: 'Medico registra',
                    align: 'center',
                    sortable: false,
                    value: 'consulta.medico_ordena.operador.nombre_completo',
                },
                {
                    text: 'Fecha creacion',
                    align: 'center',
                    sortable: false,
                    value: 'created_at',
                },
                {
                    text: 'Estado',
                    align: 'center',
                    sortable: false,
                    value: 'estado_id',
                },
                {
                    text: 'Acciones',
                    align: 'center',
                    sortable: false,
                    value: 'acciones',
                },
            ],
            eventos: [],
            mostrarFormularioEpidemiologia: false,
            diagnosticoSeleccionadoEdit: null,
            mostarModalDevolucion: false,
            infoAfiliadoRegistroFicha: null,
            buscarRep: null,
            cargarRep: false,
        }
    },
    mounted() {
        if (this.$can('epidemiologia.verTodasLasFichasEpidemiologicas')) {
            this.listarTodasConsultaDiagnosticoEpidemiologia();
        }

        if (this.$can('epidemiologia.verFichasPorCapa')) {
            this.listarConsultaDiagnosticoEpidemiologia();
        }
        this.listarEventos();
    },
    watch: {
        buscarRep(newValue) {
            if(newValue && newValue.length === 4) {
                this.listasIps();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),
        async listarConsultaDiagnosticoEpidemiologia() {
            try {
                this.cargandoCapa = true;
                const params = {
                    page: this.paginaCapa,
                    cantidad: this.opcionActualCapa,
                    documento: this.filtros.documento,
                    estado: this.filtros.estado_registro,
                    evento: this.filtros.evento_sivigila,
                    fichaId: this.filtros.fichaId,
                }

                this.cargandoCapa = true;
                const response = await this.$axios.get('/epidemiologia/listar-consultas-diagnostico-epidemiologia', { params });

                this.epidemiologias = response.data.data;
                this.totalCapa = response.data.last_page;
            } catch (error) {

                this.$toast.error('Error al listar los diagnósticos');
            } finally {
                this.cargandoCapa = false;
            }
        },

        async listarTodasConsultaDiagnosticoEpidemiologia() {
            try {
                this.cargando = true;
                const params = {
                    page: this.pagina,
                    cantidad: this.opcionActual,
                    documento: this.filtro.documento,
                    estado: this.filtro.estado_registro,
                    ips: this.filtro.ips,
                    evento: this.filtro.evento_sivigila,
                    fichaId: this.filtro.fichaId,
                }

                this.cargando = true;
                const response = await this.$axios.get('/epidemiologia/listar-todas-consultas-diagnostico-epidemiologia', { params });

                this.epidemiologiaTodas = response.data.data;
                this.total = response.data.last_page;
            } catch (error) {

                this.$toast.error('Error al listar los diagnósticos');
            } finally {
                this.cargando = false;
            }
        },

        async estadoFormularioDiagnostico(item) {
            try {
                const data = {
                    estado_id: 1,
                }
                const response = await this.$swal({
                    title: "Desea cambiar el estado de formulario?",
                    text: "Al aceptar este mensaje, se marcará como revisado el formulario del diagnóstico.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Aceptar",
                })
                if (response.value) {
                    this.setPreload(true);
                    await this.$axios.post(`/epidemiologia/cambiar-estado-activo-ficha/${item.id}`, data)
                    if (this.$can('epidemiologia.verFichasPorCapa')) {
                        await this.listarConsultaDiagnosticoEpidemiologia()
                    }
                    if (this.$can('epidemiologia.verTodasLasFichasEpidemiologicas')) {
                        await this.listarTodasConsultaDiagnosticoEpidemiologia()
                    }
                }
            } catch (error) {
                this.$toast.error("Error al cambiar el estado del formulario");
            } finally {
                this.setPreload(false)
            }
        },

        async descargarDiagnosticoSivigila(item) {
            try {
                const data = {
                    id: item.id
                }

                this.setPreload(true);

                const response = await this.$axios.post(
                    '/epidemiologia/descargar-pdf-epidemiologia-sivigila', data,
                    { responseType: 'arraybuffer' }
                );

                const blob = new Blob([response.data], { type: "application/pdf" });

                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.target = "_blank";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                this.$toast.error('Error al abrir el diagnóstico');
            } finally {
                this.setPreload(false);
            }
        },

        listasIps() {
            this.cargarRep = true;
            this.$axios.get(`reps/buscarRep/${this.buscarRep}`
            ).then(res => {
                this.ips = res.data;
            }).catch(e => {
                console.error('Error al listar las ips:', e);
                this.$toast.error('Error al listar las ips.');
            })
            .finally(() => {
                this.cargarRep = false;
            });
        },


        listarEstados() {
            this.estados = [
                { text: 'Revisado', value: 1 },
                { text: 'Pendiente', value: 10 },
                { text: 'Devuelto', value: 5 }
            ];
        },

        limpiarFiltros() {
            this.filtros = {
                documento: null,
                estado: null,
                evento_sivigila: null,
                fichaId: null,
            };
            this.listarConsultaDiagnosticoEpidemiologia();
        },

        limpiarFiltroTodo() {
            this.filtro = {
                documento: null,
                estado: null,
                ips: null,
                evento_sivigila: null,
                fichaId: null,
            };
            this.listarTodasConsultaDiagnosticoEpidemiologia();
        },

        listarEventos() {
            this.$axios.post('/eventos-sivigila/listar-eventos')
                .then(res => {
                    this.eventos = res.data;
                })
                .catch(err => {
                    console.error('Error al listar los eventos sivigila:', err);
                    this.$toast.error('Error al listar los eventos sivigila.');
                });
        },

        abrirFormularioEpidemiologia(item) {
            const datosModal = {
                eventoSivigila: item.evento_sivigila,
                consultaId: item.consulta_id,
                eventoId: item.evento_sivigila?.id,
                afiliadoId: item.consulta?.afiliado?.id,
                cie10Id: item.cie10?.id,
                dx: item.cie10?.codigo_cie10,
            }
            this.diagnosticoSeleccionadoEdit = datosModal;
            this.mostrarFormularioEpidemiologia = true;
            // this.$nextTick(() => {
            //     this.$refs.respuestas.consultarRegistroCie10Consulta();
            // });
        },

        abrirModalDevolucion(item) {
            const datosModal = {
                registroId: item.id,
                eventoSivigila: item.evento_sivigila,
                afiliado: item.consulta?.afiliado,
                emailMedico: item.consulta?.medico_ordena?.email,
                cie10Id: item.cie10?.id,
                dx: item.cie10?.codigo_cie10,
            }
            this.infoAfiliadoRegistroFicha = datosModal;
            this.mostarModalDevolucion = true;
            this.$nextTick(() => {
                this.$refs.listarObservaciones.listarObservacionsAnulacion();
            });
        },

    }

}
</script>
