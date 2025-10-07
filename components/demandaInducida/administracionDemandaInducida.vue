<template>
    <div>
        <v-row>
            <v-col col="12" md="6" sm="6">
                <v-text-field label="Buscar" v-model="buscar" hint="Busca por Documento" persistent-hint>
                </v-text-field>
            </v-col>
            <v-col col="12" md="6" sm="6">
                <v-btn color="info" small dark @click="listarDemandas()">Buscar
                    <!-- <v-icon>mdi-checkbox-marked-circle-plus-outline</v-icon> -->
                </v-btn>
                <v-btn color="error" small dark @click="buscar = '', listarDemandas()">Limpiar
                    <!-- <v-icon>mdi-checkbox-marked-circle-plus-outline</v-icon> -->
                </v-btn>
            </v-col>
        </v-row>

        <v-data-table :headers="headersDemandas" :items="demandas" class="elevation-1" :loading="loading"
            disable-pagination :disable="loading" loading-text="Cargando..." hide-default-footer
            no-data-text="Sin datos para mostrar" dense :items-per-page="opcionActual">
            <template v-slot:[`item.demanda_inducida_efectiva`]="{ item }">
                <v-chip small :color="item.demanda_inducida_efectiva === true ? 'green' : 'red'" dark>
                    {{ item.demanda_inducida_efectiva === true ? 'Si' : 'No' }}
                </v-chip>
            </template>
            <template v-slot:[`item.afiliado`]="{ item }">
                {{ item.afiliado?.primer_nombre }} {{ item.afiliado?.segundo_nombre }} {{ item.afiliado?.primer_apellido
                }} {{ item.afiliado?.segundo_apellido }}
            </template>
            <template v-slot:[`item.estado1`]="{ item }">
                <td class="text-xs-center">
                    <div
                        v-if="item.demanda_inducida_efectiva == true && !tipoDemandaInducidaNoAsistidas.find(demanda => demanda === item.programa_remitido)">
                        <v-chip small v-if="!item.consulta_1_id && !item.estado1">Sin Asignar
                        </v-chip>
                        <v-chip small v-else-if="item.consulta_1_id && parseInt(item.estado1) === 13" color="warning"
                            text-color="white">Por
                            Confirmar</v-chip>
                        <v-chip small v-else-if="item.consulta_1_id && parseInt(item.estado1) === 14" color="success"
                            text-color="white">Confirmada</v-chip>
                        <v-chip small
                            v-else-if="item.consulta_1_id && (parseInt(item.estado1) === 7 || parseInt(item.estado1) === 9)"
                            color="info" text-color="white">Atendida</v-chip>
                        <v-chip small v-else-if="item.consulta_1_id && parseInt(item.estado1) === 30" color="error"
                            text-color="white">
                            Cancelada</v-chip>
                        <v-chip small v-else-if="item.consulta_1_id && parseInt(item.estado1) === 8" color="error"
                            text-color="white">
                            Inasistencia</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.estado2`]="{ item }">
                <td class="text-xs-center">
                    <div
                        v-if="item.demanda_inducida_efectiva == true && !tipoDemandaInducidaNoAsistidas.find(demanda => demanda === item.programa_remitido)">
                        <v-chip small v-if="!item.consulta_2_id && !item.estado2">Sin Asignar
                        </v-chip>
                        <v-chip small v-else-if="item.consulta_2_id && parseInt(item.estado2) === 13" color="warning"
                            text-color="white">Por Confirmar</v-chip>
                        <v-chip small v-else-if="item.consulta_1_id && parseInt(item.estado1) === 14" color="success"
                            text-color="white">Confirmada</v-chip>
                        <v-chip small
                            v-else-if="item.consulta_2_id && (parseInt(item.estado2) === 7 || parseInt(item.estado2) === 9)"
                            color="info" text-color="white">Atendida</v-chip>
                        <v-chip small v-else-if="item.consulta_2_id && parseInt(item.estado2) === 30" color="error"
                            text-color="white">Cancelada</v-chip>
                        <v-chip small v-else-if="item.consulta_2_id && parseInt(item.estado2) === 8" color="error"
                            text-color="white">Inasistencia</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.estado3`]="{ item }">
                <td class="text-xs-center">
                    <div
                        v-if="item.demanda_inducida_efectiva == true && !tipoDemandaInducidaNoAsistidas.find(demanda => demanda === item.programa_remitido)">
                        <v-chip small v-if="!item.consulta_3_id && !item.estado3">Sin Asignar
                        </v-chip>
                        <v-chip small v-else-if="item.consulta_1_id && parseInt(item.estado1) === 14" color="success"
                            text-color="white">Confirmada</v-chip>
                        <v-chip small v-else-if="item.consulta_3_id && parseInt(item.estado3) === 13" color="warning"
                            text-color="white">Por Confirmar</v-chip>
                        <v-chip small
                            v-else-if="item.consulta_3_id && (parseInt(item.estado3) === 7 || parseInt(item.estado3) === 9)"
                            color="info" text-color="white">Atendida</v-chip>
                        <v-chip small v-else-if="item.consulta_3_id && parseInt(item.estado3) === 30" color="error"
                            text-color="white">Cancelada</v-chip>
                        <v-chip small v-else-if="item.consulta_3_id && parseInt(item.estado3) === 8" color="error"
                            text-color="white">Inasistencia</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-if="habilitarAgenda(item)" color="info" fab outlined small dark
                            @click="abrirAgenda(item)" v-on="on">
                            <v-icon>mdi-checkbox-marked-circle-plus-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Agendar cita</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" v-if="!habilitarAgenda(item)">
                            <v-icon small color="error" @click="eliminarDemandaInducida(item)">
                                mdi-delete
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>Eliminar</span>
                </v-tooltip>
            </template>

        </v-data-table>

        <v-row no-gutters style="background-color: white;">
            <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                    @input="listarDemandas()">
                </v-pagination>
            </v-col>
            <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                    @change="listarDemandas()">
                </v-select>
            </v-col>
        </v-row>

        <!-- Dialogo para agendar -->
        <v-dialog v-model="dialogDemanda" max-width="1000px">
            <v-card>
                <v-alert text dense color="info" class="text-center">
                    <b>Datos del afiliado</b>
                </v-alert>
                <v-row>
                    <v-col cols="12" sm="4" md="4">
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title><b>Tipo de documento</b></v-list-item-title>
                                <v-list-item-subtitle>
                                    <b>{{ datosAfiliado.tipo_documento ? datosAfiliado.tipo_documento : '' }}</b>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title><b>Número de documento:</b></v-list-item-title>
                                <v-list-item-subtitle>
                                    <b>{{ datosAfiliado.numero_documento ? datosAfiliado.numero_documento : '' }}</b>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title><b>Nombre completo:</b></v-list-item-title>
                                <v-list-item-subtitle>
                                    <b>
                                        {{ [
                                            datosAfiliado.primer_nombre,
                                            datosAfiliado.segundo_nombre,
                                            datosAfiliado.primer_apellido,
                                            datosAfiliado.segundo_apellido
                                        ].filter(Boolean).join(' ')
                                        }}
                                    </b>
                                </v-list-item-subtitle>

                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title><b>Edad afiliado:</b></v-list-item-title>
                                <v-list-item-subtitle>
                                    <b>{{ datosAfiliado.edad_cumplida ? datosAfiliado.edad_cumplida : '' }}</b>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title><b>IPS:</b></v-list-item-title>
                                <v-list-item-subtitle>
                                    <b>{{ datosAfiliado.ips ? datosAfiliado.ips : '' }}</b>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>

                </v-row>
                <v-card-text>
                    <AgendamientoDemanda modulo="demandaInducida" ref="AgendamientoDemanda" :demanda="demandaInducida"
                        :afiliado="datosAfiliado" @listarDemandas="cerrarYrecargarDatos" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small @click=cerrarDialogoAsignacion()>Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import AgendamientoDemanda from '~/components/demandaInducida/agendamientoDinamicoDemanda.vue'
export default {
    props: {
        ejecutar: Boolean
    },
    components: {
        AgendamientoDemanda
    },
    data() {
        return {
            demandas: [],
            buscar: '',
            loading: false,
            pagina: 1,
            total: 0,
            opcionActual: 20,
            opciones: [5, 10, 20, 50, 100],
            datosAfiliado: {
                numero_documento: '',
                tipo_documento: null,
                nombre_completo: '',
                ips: '',
                edad_cumplida: ''
            },
            tipoDemandaInducidaNoAsistidas: ['VACUNACION', 'SALUD ORAL', 'TALLERES EDUCATIVOS', 'CITOLOGIA',
                'MAMOGRAFIA', 'TAMIZAJE PROSTATA'
            ],
            headersDemandas: [{
                text: 'Tipo Doc',
                value: 'Documento',
            },
            {
                text: 'Documento',
                value: 'numero_documento',
            },
            {
                text: 'IPS',
                value: 'afiliado.ips.nombre',
            },
            {
                text: 'Tipo demanda inducida',
                value: 'tipo_demanda_inducida'
            },
            {
                text: 'Programa remitido',
                value: 'programa_remitido',
            },
            {
                text: 'Afiliado',
                value: 'afiliado'
            },
            {
                text: 'Registrado por',
                value: 'nombre_completo'
            },
            {
                text: 'Efectiva',
                value: 'demanda_inducida_efectiva'
            },
            {
                text: 'Consulta 1',
                value: 'estado1'
            },
            {
                text: 'Consulta 2',
                value: 'estado2'
            },
            {
                text: 'Consulta 3',
                value: 'estado3'
            },
            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
            ],
            dialogDemanda: false,
            demandaInducida: null,
            paciente: null
        }
    },
    watch: {
        ejecutar: {
            handler(valor) {
                if (valor) {
                    this.buscar = "";
                    this.datosAfiliado = {
                        numero_documento: '',
                        tipo_documento: null,
                        nombre_completo: '',
                        ips: '',
                        edad_cumplida: ''
                    }
                    this.listarDemandas();
                }
            }
        },
        immediate: true

    },
    mounted() {
        this.listarDemandas()
    },
    methods: {
        listarDemandas() {
            this.loading = true
            this.$axios.post('/demanda-inducidas/listar?page=' + this.pagina + '&cantidad=' + this.opcionActual, {
                cedula: this.buscar
            }).then(
                res => {
                    this.demandas = res.data.data;
                    this.total = res.data.last_page
                    this.loading = false
                }).catch(e => {
                    console.log(e);
                    this.loading = false
                })
        },

        habilitarAgenda(item) {
            const filtroDemandaInducida = this.tipoDemandaInducidaNoAsistidas.find(demanda => demanda === item
                .programa_remitido)
            if (!filtroDemandaInducida) {
                if (item.demanda_inducida_efectiva === true) {
                    if (!item.consulta_1_id && !item.estado1) {
                        return true;
                    } else {
                        if (item.consulta_1_id && (parseInt(item.estado1) === 6 || parseInt(item.estado1) ===
                            12)) {
                            if (!item.consulta_2_id && !item.estado2) {
                                return true;
                            } else {
                                if (item.consulta_2_id && (parseInt(item.estado2) === 6 || parseInt(item
                                    .estado2) === 12)) {
                                    if (!item.consulta_3_id && !item.estado3) {
                                        return true;
                                    } else {
                                        false
                                    }

                                } else {
                                    return false;
                                }
                            }
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        cerrarYrecargarDatos() {
            this.cerrarDialogoAsignacion()
        },

        cerrarDialogoAsignacion() {
            this.$refs.AgendamientoDemanda.limpiarCita();
            this.dialogDemanda = false;
            this.listarDemandas();
        },

        abrirAgenda(item) {
            const afiliado = item.afiliado;

            this.datosAfiliado = {
                id: afiliado.id,
                numero_documento: afiliado.numero_documento,
                tipo_documento: afiliado.tipo_documento?.nombre || '',
                nombre_completo: `${afiliado.primer_nombre || ''} ${afiliado.segundo_nombre || ''} ${afiliado.primer_apellido || ''} ${afiliado.segundo_apellido || ''}`.trim(),
                ips: afiliado.ips?.nombre || '',
                edad_cumplida: afiliado.edad_cumplida,
            };

            this.demandaInducida = item;
            this.dialogDemanda = true;
        },

        eliminarDemandaInducida(item) {
            this.$axios.post('/demanda-inducidas/eliminarDemandaInducida/', {
                id: item.id
            })
                .then(res => {
                    this.listarDemandas()
                    return this.$toast.error('Se ha eliminado la demanda inducida correctamente!.')
                }).catch(e => {
                    console.log(e);
                })
        },
    }
}

</script>
