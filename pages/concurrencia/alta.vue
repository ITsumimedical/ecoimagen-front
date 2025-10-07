<template>
    <div>
        <!-- alta de concurrencia -->
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Alta</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
        </v-card>
        <v-card elevation="0">
            <div>
                <v-row class="mx-2">
                    <v-col md="5" lg="5" xl="5" sm="6" cols>
                        <v-text-field type="number" hide-spin-buttons dense v-model="filtro.numero_documento"
                            label="Documento del afiliado" @keyup.enter="listarConcurrencias()" single-line>
                        </v-text-field>
                    </v-col>

                    <v-col md="2" lg="2" xl="2" sm="6" cols>
                        <v-btn-toggle background-color="white" dark>
                            <v-btn small color="success" @click="listarConcurrencias()">Filtrar</v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
            </div>

            <!-- tabla -->
            <v-data-table :headers="headers" dense :items="listaConcurrencias" hide-default-footer disable-pagination
                no-data-text="Sin datos para mostrar">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on" @click="reabrir(item)">
                                mdi-open-in-app
                            </v-icon>
                        </template>
                        <span>Reabrir</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="info" class="mr-2" v-bind="attrs" v-on="on" @click="gestion(item)">
                                mdi-eye
                            </v-icon>
                        </template>
                        <span>Gestión</span>
                    </v-tooltip>
                </template>
            </v-data-table>
            <v-row no-gutters>
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="listarConcurrencias()">
                    </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="listarConcurrencias()">
                    </v-select>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog v-model="dialogoGestion" persistent v-if="datosAlta">
            <v-card>
                <v-container fluid>
                    <!-- afiliado -->
                    <v-row dense v-if="afiliado">
                        <v-col cols="12" md="12" sm="12">
                            <AfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                                :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
                        </v-col>
                    </v-row>
                    <!-- concurrencia -->
                    <v-row dense>
                        <v-col cols="12">
                            <v-alert text dense border="left" color="blue-grey"
                                icon="mdi-account-group">Concurrencia</v-alert>
                        </v-col>
                        <v-col cols="12" sm="2" md="2">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.fecha_ingreso"
                                label="Fecha de ingreso">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.cie10.Codigo_Nombre"
                                label="Diagnóstico de ingreso">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" md="2">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.tipo_hospitalizacion"
                                label="Tipo de hospitalización">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.unidad_funcional"
                                label="unidad funcional">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2" md="2">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.via_ingreso"
                                label="Vía de ingreso">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.reingreso_15_dias"
                                label="Reingreso hospitalización 15 días">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.reingreso_30_dias"
                                label="Reingreso hospitalización 30 días">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.rep.nombre"
                                label="Institución de atención">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.codigo_hospitalizacion"
                                label="Código de hospitalización">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.ingreso_concurrencia.especialidad.nombre"
                                label="Especialidad tratante">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.numero_factura" label="Número de factura">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.alto_costo" label="Alto costo">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.reporte_patologia_diagnostica"
                                label="Reporte de patología diagnóstica">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.hospitalizacion_evitable"
                                label="Hospitalización evitable">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.cie10.Codigo_Nombre"
                                label="Diagnóstico de concurrencia">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.fecha_egreso" label="Fecha de egreso">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.dx_egreso.Codigo_Nombre"
                                label="Diagnóstico de egreso primario">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field dense readonly :value="datosAlta.destino_egreso" label="Destino de egreso">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <!-- complementos y eventos -->
                    <v-row dense>
                        <v-col cols="12">
                            <v-alert text dense border="left" color="blue-grey"
                                icon="mdi-file-document-arrow-right">Eventos y
                                complementos
                            </v-alert>
                            <template>
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            Ordenamiento
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <template>
                                                <v-data-table dense :headers="headersOrdenamientos"
                                                    :items="datosAlta.ingreso_concurrencia.orden_concurrencias"
                                                    :items-per-page="5" class="elevation-0">
                                                </v-data-table>
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </template>
                            <template>
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            Eventos
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <template>
                                                <v-data-table dense :headers="headersEventos"
                                                    :items="datosAlta.ingreso_concurrencia.evento" :items-per-page="5"
                                                    class="elevation-0">
                                                </v-data-table>
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </template>
                            <template>
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            Costo evitado
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <template>
                                                <v-data-table dense :headers="headersCostoEvitado"
                                                    :items="datosAlta.ingreso_concurrencia.costo_evitado"
                                                    :items-per-page="5" class="elevation-0">
                                                </v-data-table>
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </template>
                            <template>
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            Costo evitable
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <template>
                                                <v-data-table dense :headers="headersCostoEvitable"
                                                    :items="datosAlta.ingreso_concurrencia.costo_evitable"
                                                    :items-per-page="5" class="elevation-0">
                                                </v-data-table>
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </template>
                        </v-col>
                    </v-row>
                    <!-- seguimientos -->
                    <v-row dense>
                        <v-col cols="12">
                            <v-alert text dense border="left" color="blue-grey"
                                icon="mdi-eye-arrow-right">Seguimientos</v-alert>
                        </v-col>
                        <v-item-group v-model="window" class="shrink mr-6" mandatory tag="v-flex">
                            <v-item v-for="n in this.datosAlta.seguimientos" :key="n.id" v-slot="{ active, toggle }">
                                <div>
                                    <v-btn :input-value="active" icon @click="toggle">
                                        <v-icon>mdi-record</v-icon>
                                    </v-btn>
                                </div>
                            </v-item>
                        </v-item-group>
                        <v-col>
                            <v-window v-model="window" vertical>
                                <v-window-item v-for="(n, index) in this.datosAlta.seguimientos"
                                    :key="n.id ? n.id + '-' + index : index">
                                    <v-card flat>
                                        <v-card-text>
                                            <v-row dense align="center">
                                                <v-icon color="info" class="mr-4">mdi-arrow-down-right</v-icon>
                                                <strong class="text-h6">Seguimiento #{{ n.id }}</strong>
                                                <v-spacer></v-spacer>
                                                {{ n.usuario_crea.operador.nombre_completo }}
                                                <v-btn icon>
                                                    <v-icon>mdi-account</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <p>{{ n.notas }}</p>
                                            <v-row dense>
                                                <v-col cols="6">
                                                    <v-alert text dense border="left" type="info"
                                                        icon="mdi-hospital-box-outline">
                                                        Nota dirección de servicios de salud
                                                    </v-alert>
                                                    <span>{{ n.nota_dss }}</span>
                                                    <v-text-field readonly dense
                                                        :value="n.usuario_dss.operador.nombre_completo"
                                                        hint="Usuario registra" persistent-hint></v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-alert text dense border="left" type="info"
                                                        icon="mdi-account-cash-outline">
                                                        Nota auditoría alto costo
                                                    </v-alert>
                                                    <span>{{ n.nota_aac }}</span>
                                                    <v-text-field readonly dense
                                                        :value="n.usuario_aac.operador.nombre_completo"
                                                        hint="Usuario registra" persistent-hint></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-window-item>
                            </v-window>
                        </v-col>
                    </v-row>
                    <!-- panel fijo con estancias -->
                    <template>
                        <v-container>
                            <v-card class="pa-4" style="position: fixed; bottom: 90px; right: 50px; z-index: 100;">
                                <small>Estancia Hospitalizacion: <b> {{ datosAlta.dias_estancia_basicos }} </b></small>
                                <v-spacer></v-spacer>
                                <small>Estancia UCE: <b>{{ datosAlta.dias_estancia_intermedio }}</b></small>
                                <v-spacer></v-spacer>
                                <small>Estancia UCI: <b>{{ datosAlta.dias_estancia_intensivo }}</b></small>
                                <v-spacer></v-spacer>
                                <small> Estancia Total: <b>{{ estanciaTotal }}</b></small>
                                <v-spacer></v-spacer>
                            </v-card>
                        </v-container>
                    </template>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="listarConcurrencias()">Cerrar</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import AfiliadoComponente from '~/components/afiliado/FormularioAfiliadoComponente.vue';
export default {
    components: {
        AfiliadoComponente
    },
    name: 'WorkspaceJsonAlta',

    data() {
        return {
            pagina: 1,
            total: 0,
            listaConcurrencias: [],
            opciones: [5, 10, 20, 50, 100],
            opcionActual: 5,
            filtro: {
                numero_documento: null
            },
            dialogoGestion: false,
            afiliado: null,
            datosAlta: null,
            window: 0,
            headers: [{
                text: 'id',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Afiliado',
                sortable: false,
                value: 'ingreso_concurrencia.afiliado.nombre_completo',
            },
            {
                text: 'Número documento afiliado',
                sortable: false,
                value: 'ingreso_concurrencia.afiliado.numero_documento',
            },
            {
                text: 'Especialidad',
                sortable: false,
                value: 'ingreso_concurrencia.especialidad.nombre',
            },
            {
                text: 'Atendido en',
                sortable: false,
                value: 'ingreso_concurrencia.rep.nombre',
            },
            {
                text: 'Fecha ingreso',
                sortable: false,
                value: 'ingreso_concurrencia.fecha_ingreso',
            },
            {
                text: 'Fecha egreso',
                sortable: false,
                value: 'fecha_egreso',
            },
            {
                text: 'Días estancia',
                sortable: false,
                value: 'ingreso_concurrencia.estancia_total',
            },
            {
                text: 'Acciones',
                value: 'actions',
                sortable: false,
                align: 'center',
            },
            ],
            headersOrdenamientos: [{
                text: 'id',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Codigo CUP',
                sortable: false,
                value: 'cup_id',
            },
            {
                text: 'CUP',
                sortable: false,
                value: 'cup.nombre',
            },
            {
                text: 'Costo',
                sortable: false,
                value: 'costo',
            },
            {
                text: 'Cantidad',
                sortable: false,
                value: 'cantidad',
            },
            {
                text: 'Usuario registra',
                sortable: false,
                value: 'user.operador.nombre_completo',
            },
            ],
            headersEventos: [{
                text: 'id',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Evento',
                sortable: false,
                value: 'evento',
            },
            {
                text: 'Observaciones',
                sortable: false,
                value: 'observaciones',
            }
            ],
            headersEventos: [{
                text: 'id',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Tipo de evento',
                sortable: false,
                value: 'tipo_evento',
            },
            {
                text: 'Evento',
                sortable: false,
                value: 'evento',
            },
            {
                text: 'Observaciones',
                sortable: false,
                value: 'observaciones',
            },
            {
                text: 'Usuario realiza',
                sortable: false,
                value: 'user.operador.nombre_completo',
            }
            ],
            headersCostoEvitado: [{
                text: 'id',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Costo',
                sortable: false,
                value: 'costo',
            },
            {
                text: 'Descripción',
                sortable: false,
                value: 'descripcion',
            },
            {
                text: 'Tipo de alta',
                sortable: false,
                value: 'tipo_alta',
            },
            {
                text: 'Valor',
                sortable: false,
                value: 'valor',
            }
            ],
            headersCostoEvitable: [{
                text: 'id',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Costo',
                sortable: false,
                value: 'costo',
            },
            {
                text: 'Descripción',
                sortable: false,
                value: 'descripcion',
            },
            {
                text: 'Objeción',
                sortable: false,
                value: 'objecion',
            },
            {
                text: 'Valor',
                sortable: false,
                value: 'valor',
            }
            ],
        };
    },

    computed: {
        estanciaTotal() {
            return (
                (this.datosAlta.dias_estancia_basicos || 0) +
                (this.datosAlta.dias_estancia_intermedio || 0) +
                (this.datosAlta.dias_estancia_intensivo || 0)
            );
        },
    },

    methods: {
        listarConcurrencias() {
            this.dialogoGestion = false
            this.$axios.post('/concurrencia/listarAlta?page=' + this.pagina + '&cant=' + this.opcionActual, this.filtro)
                .then(res => {
                    this.listaConcurrencias = res.data.data;
                    this.total = res.data.last_page;
                }).catch(e => { })
        },

        reabrir(item) {
            this.$axios.post('/concurrencia/reabrir', {
                id: item.id
            }).then(
                res => {
                    this.$toast.success('Se ha abierto la concurrrencia exitosamente')
                    this.listarConcurrencias()
                }).catch(e => { })
        },

        gestion(item) {
            this.dialogoGestion = true
            this.afiliado = item.ingreso_concurrencia.afiliado
            this.datosAlta = item
        },

    },
};

</script>
