<template>
    <div>

        <v-row>
            <v-col cols="12" sm="12" md="12">
                <v-card>
                    <v-dialog v-model="preload" persistent width="300">
                        <v-card color="primary" dark>
                            <v-card-text>
                                Procesando Información
                                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-alert color="info" text dense icon="mdi-human-male-board">
                        <b>Junta Aseguramiento</b>
                    </v-alert>
                    <v-col>
                        <v-text-field label="Buscar" v-model="buscar"></v-text-field>
                    </v-col>
                    <v-data-table :loading="loading" :disable="loading" :search="buscar" :headers="headers"
                        :items="girs" dense loading-text="Cargando... por favor espere" hide-default-footer>
                        <!-- <template v-slot:[`item.girs`]="{ item }">
              <v-chip small label class="ma-2" color="green" text-color="white" v-if="item.girs == 1">GIRS</v-chip>
            </template> -->
                        <template v-slot:[`item.actions`]="{ item }">

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="gestionarTeleapoyo(item)">
                                        mdi-file-document
                                    </v-icon>
                                </template>
                                <span>Gestionar</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                    <v-row no-gutters>
                        <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                            <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                @input="listarTeleapoyosGirs()">
                            </v-pagination>
                        </v-col>
                        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                @change="listarTeleapoyosGirs()">
                            </v-select>
                        </v-col>
                    </v-row>
                </v-card>

            </v-col>

            <v-dialog v-model="dialog" max-width="1000px">
                <v-card>
                    <form>
                        <v-card-text>
                            <v-alert dense text outlined color="info" class="text-center">Datos paciente
                            </v-alert>
                            <v-row>
                                <PacienteComponent :afiliado="datosPaciente" :modoDetalle="true" :modoEdicion="true"
                                    :mostrarClasificaciones="true" />
                            </v-row>
                        </v-card-text>
                    </form>
                    <form>
                        <v-card-text>
                            <v-alert dense text outlined color="info" class="text-center">Detalles junta aseguramiento
                            </v-alert>
                            <v-container fluid>
                                <v-row>
                                    <v-col cols="12" sm="12" md="4">
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Especialidad</strong></v-list-item-title>
                                                <v-list-item-subtitle>{{ gestionGirs.especialidad }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="12">
                                        <v-divider></v-divider>
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Tipo solicitud</strong></v-list-item-title>
                                                <v-list-item-subtitle>{{ gestionGirs.tipo }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="12">
                                        <v-divider></v-divider>
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Motivo teleapoyo</strong></v-list-item-title>
                                                <v-list-item-subtitle>{{ gestionGirs.motivo_teleorientacion }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="12">
                                        <v-divider></v-divider>
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Resumen historia</strong></v-list-item-title>
                                                <v-list-item-subtitle>{{ gestionGirs.resumen_historia_clinica }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="12">
                                        <v-divider></v-divider>
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Diagnosticos</strong></v-list-item-title>
                                            </v-list-item-content>
                                        </v-list>
                                        <ul>
                                            <li v-for="(cie10, index) in gestionGirs.cie10s" :key="index">
                                                {{ cie10.codigo_cie10 }}-{{ cie10.nombre }}
                                            </li>
                                        </ul>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="12">
                                        <v-divider></v-divider>
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Archivos
                                                        adjuntos</strong></v-list-item-title>
                                            </v-list-item-content>
                                        </v-list>
                                        <v-btn style="margin-right:7px" small
                                            v-for="(adjuntoR, index) in gestionGirs.adjuntos" :key="index">
                                            <a @click="consultarAdjunto(adjuntoR.ruta)">
                                                Adjunto
                                                {{ index + 1 }}
                                            </a>
                                            <v-icon small color="info">mdi-file-find</v-icon>
                                        </v-btn>

                                    </v-col>
                                    <v-col cols="12" sm="6" md="12">
                                        <v-divider></v-divider>
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Observación especialista resignación
                                                        junta</strong>
                                                </v-list-item-title>
                                                <v-list-item-subtitle>{{ gestionGirs.observacion_reasignacion_girs }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="12">
                                        <v-divider></v-divider>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Prioridad del
                                                        teleapoyo</strong></v-list-item-title>
                                                <v-list-item-subtitle>{{ gestionGirs.pertinencia_prioridad }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-list lines="two">
                                            <v-list-item-content>
                                                <v-list-item-title><strong>Evaluación pertinencia de solicitud del
                                                        teleapoyo</strong>
                                                </v-list-item-title>
                                                <v-list-item-subtitle>{{ gestionGirs.pertinencia_evaluacion }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </form>
                    <v-card-text v-if="gestionGirs.consulta_id">
                        <v-alert dense text outlined color="info" class="text-center">Ordenamiento
                        </v-alert>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <ordenamientoComponet :consulta="parseInt(gestionGirs.consulta_id)" :habilitarBoton="true"
                                :dialog="false" @respuestaComponente="handleClose" />
                        </v-card-actions>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-data-table dense :headers="headersOrdenamiento" show-select
                                        :items="gestionGirs.medicamentos" item-key="id" v-model="seleccion">
                                    </v-data-table>
                                </v-col>
                                <v-col cols="12" sm="12" md="12"
                                    v-if="seleccion.length > 0 && seleccion[0].estado_id == 3">
                                    <v-select v-model="accion" label="Seleccionar acción" :items="acciones"
                                        item-text="accion" item-value="value" hide-details>
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="12"
                                    v-if="seleccion.length > 0 && seleccion[0].estado_id == 3">
                                    <v-textarea outlined v-model="observaciones" rows="3" label="Observacion Auditor"
                                        row-height="12">
                                    </v-textarea>
                                </v-col>
                                <v-col cols="12" sm="12" md="12"
                                    v-if="seleccion.length > 0 && seleccion[0].estado_id == 3">
                                    <v-btn dark color="success" @click="auditar()" small>enviar</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-text>
                        <v-alert dense text outlined color="info" class="text-center">Respuesta especialista
                        </v-alert>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea outlined v-model="gestionGirs.respuesta" rows="3" readonly
                                        label="Observación reasignación GIRS" row-height="12"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-text>
                        <v-alert dense text outlined color="info" class="text-center">Junta Aseguramiento
                        </v-alert>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete v-model="integrantes" label="Integrantes" :items="empleados"
                                        item-value="id" item-text="nombre" chips deletable-chips multiple>
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="6" md="5">
                                    <v-text-field v-model="junta.institucion_prestadora" label="Institución prestadora">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="7">
                                    <v-text-field v-model="junta.eapb"
                                        label="Entidades administradoras de planes de beneficio (EAPB)">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea outlined v-model="junta.evaluacion_junta" rows="3"
                                        label="evaluación junta" row-height="12"></v-textarea>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-label>La junta de profesionales de salud aprueba</v-label>
                                    <v-radio-group v-model="junta.junta_aprueba">
                                        <v-radio v-for="n in ['Si', 'No', 'No requiere junta']" :key="n" :label="n"
                                            :value="n" color="primary"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-autocomplete label="Clasificación de prioridad de servicio ambulatorio"
                                        v-model="junta.tipo_solicitudes_id" :items="tipoSolicitudes" item-text="nombre"
                                        item-value="id">
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn dark color="error" small @click="dialog = false">Cerrar</v-btn>
                        <v-btn dark color="primary" small @click="finalizarteleapoyo()">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogoCorreo" v-if="dialogoCorreo" max-width="1000px" persistent>
                <v-card>
                    <v-alert dense text outlined color="info" class="text-center">Enviar orden por correo
                    </v-alert>
                    <v-card-text>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense v-model="correo" label="Correo"></v-text-field>
                        </v-col>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn dark color="success" small @click="enviarCorreo(seleccion[0], true)">Enviar

                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import ordenamientoComponet from '~/components/ordenamiento/ordenamiento.vue'
import PacienteComponent from '@/components/afiliado/FormularioAfiliadoComponente.vue'
import {
    listarAfiliadoActivo
} from '@/api/afiliados/afiliados'
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('teleapoyo.vista')) {
            return redirect('/');
        }
    },
    name: "WorkspaceJson",
    components: {
        ordenamientoComponet,
        PacienteComponent
    },
    data() {
        return {
            dialogoCorreo: false,
            correo: '',
            girs: [],
            preload: false,
            gestionGirs: [],
            empleados: [],
            buscar: '',
            tipoSolicitudes: [],
            loading: false,
            junta: {
                institucion_prestadora: '',
                evaluacion_junta: '',
                eapb: '',
                junta_aprueba: '',
                tipo_solicitudes_id: ''
            },
            integrantes: [],
            dialog: false,
            paginate: {
                total: 0,
                page: 1
            },
            headers: [{
                text: 'Identificacion',
                value: 'numero_documento'
            },
            {
                text: 'Especialidad',
                value: 'especialidad'
            },
            {
                text: 'Nombre',
                align: 'center',
                value: 'nombre_afiliado'
            },
            {
                text: 'Registro',
                align: 'center',
                value: 'created_at'
            },
            {
                text: 'Tipo solicitud',
                value: 'tipo'
            },
            {
                text: 'Medico solicitante',
                align: 'center',
                value: 'nombre_medico'
            },
            {
                text: 'Sede',
                align: 'center',
                value: 'sede'
            },
            {
                text: 'Gestión',
                align: 'center',
                value: 'actions'
            },
                // {
                //   text: 'GIRS',
                //   align: 'center',
                //   value: 'girs'
                // }
            ],
            pagina: 1,
            total: 0,
            opcionActual: 5,
            opciones: [5, 10, 20, 50, 100],
            seleccion: [],
            accion: null,
            observaciones: null,
            headersOrdenamiento: [, {
                text: "Tipo",
                align: 'center',
                value: "tipo"
            }, {
                    text: "Codigo",
                    align: 'center',
                    value: "codigo"
                }, {
                    text: "Nombre",
                    align: 'center',
                    value: "nombreCodigo"
                }, {
                    text: "Cantidad",
                    align: 'center',
                    sortable: false,
                    value: "cantidad"
                }, {
                    text: "Paginacion",
                    align: 'center',
                    sortable: false,
                    value: "paginacion"
                }, {
                    text: "Observaciones",
                    align: 'center',
                    sortable: false,
                    value: 'observacion'
                }, {
                    text: "Imprimir",
                    align: 'center',
                    sortable: false,
                    value: 'acciones'
                }],
            singleSelect: false,
            acciones: [{
                accion: "APROBADO",
                value: 1
            },
            {
                accion: "INADECUADO",
                value: 20
            },
            {
                accion: "NEGADO",
                value: 21
            },
            {
                accion: "ANULADO",
                value: 5
            }
            ],
            datosPaciente: null
        };
    },

    created() {
        this.listarTeleapoyosGirs();
        this.listarEmpleados();
        this.listarSolicitudes();
    },

    methods: {

        listarTeleapoyosGirs() {
            this.loading = true;
            this.$axios.get('teleapoyo/teleconceptosGirs?page=' + this.pagina + '&cantidad=' + this.opcionActual).then(
                res => {
                    console.log('prueba', res.data.data);
                    this.girs = res.data.data
                    this.total = res.data.last_page
                    this.loading = false;
                }).catch(e => {
                    this.loading = false;
                    console.log(e);
                })
        },

        gestionarTeleapoyo(item) {
            this.preload = true;
            this.gestionGirs = item
            this.junta.tipo_solicitudes_id = parseInt(item.tipo_solicitudes_id)
            if (item.consulta_id) {
                this.medicamentosOrdenados(item.consulta_id)
            } else {
                this.gestionGirs.medicamentos = []
            }
            this.$axios.get(listarAfiliadoActivo(item.numero_documento, item.tipo_documento)).then(res => {
                this.dialog = true
                this.datosPaciente = res.data
                this.preload = false;
            }).catch(e => {
                this.preload = false;
                console.log(e);

            })
        },


        medicamentosOrdenados(id) {
            this.seleccion = []
            this.accion = null
            this.observaciones = null
            this.$axios.get('ordenamiento/detalleOrdenamientoPorConsulta/' + id).then(res => {
                this.gestion.medicamentos = res.data.map(ts => {
                    if (ts.tipo === 'medicamento') {
                        return {
                            tipo: ts.tipo,
                            codigo: ts.codesumi.codigo,
                            nombreCodigo: ts.codesumi.nombre,
                            cantidad: ts.dosificacion,
                            paginacion: ts.paginacion,
                            observacion: ts.observacion,
                            estado_id: ts.estado_id,
                            codesumi_id: ts.codesumi_id,
                            id: ts.id,
                            orden_id: ts.orden_id,
                            tipoOrden: ts.tipoOrden
                        }
                    } else if (ts.tipo === 'servicio') {
                        return {
                            tipo: ts.tipo,
                            codigo: ts.cup.codigo,
                            nombreCodigo: ts.cup.nombre,
                            cantidad: ts.cantidad,
                            paginacion: ts.paginacion,
                            observacion: ts.observacion,
                            estado_id: ts.estado_id,
                            cup_id: ts.cup_id,
                            id: ts.id,
                            orden_id: ts.orden_id,
                            tipoOrden: ts.tipoOrden
                        }
                    }
                })
            }).catch(e => {
                console.log(e);
            })
        },

        listarEmpleados() {
            this.$axios.get('empleados/listar?page=0').then(res => {
                this.empleados = res.data.data.map((empleado) => {
                    return {
                        id: empleado.id,
                        nombre: `${empleado.documento} - ${empleado.nombre_completo}`,
                        estado: empleado.estado_id
                    }
                })

            }).catch(e => {
                console.log(e);
            })
        },
        listarSolicitudes() {
            this.$axios.get('tipo-solicitud/listar?page=0').then(res => {
                this.tipoSolicitudes = res.data
            }).catch(e => {
                console.log(e);
            })
        },

        finalizarteleapoyo() {
            if (this.integrantes) {
                this.guardarIntegrantes()
            }
            const data = {
                'tipo_solicitudes_id': this.junta.tipo_solicitudes_id,
                'institucion_prestadora': this.junta.institucion_prestadora,
                'eapb': this.junta.eapb,
                'evaluacion_junta': this.junta.evaluacion_junta,
                'junta_aprueba': this.junta.junta_aprueba,
                'estado_id': 9
            };
            this.$axios.put('teleapoyo/actualizar/' + this.gestionGirs.id, data).then(res => {
                this.$toast.success('Teleapoyo actualizado')
                this.listarTeleapoyosGirs()
                this.limpiarData()
            }).catch(e => {
                console.log(e);
            })
        },

        guardarIntegrantes() {
            this.$axios.post('integrantes-junta-girs/crear/' + this.gestionGirs.id, this.integrantes).then(res => {
                this.$toast.success('Integrantes guardados')
                this.integrantes = []
            }).catch(e => {
                console.log(e);
            })
        },

        limpiarData() {
            this.junta.institucion_prestadora = '',
                this.junta.evaluacion_junta = '',
                this.junta.eapb = '',
                this.junta.junta_aprueba = '',
                this.junta.tipo_solicitudes_id = '',
                this.dialog = false
        },
        async consultarAdjunto(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error.Response);
            }
        },

        auditar() {
            let ordenes = [{
                datos: [],
                tipo: 'Medicamentos'
            }, {
                datos: [],
                tipo: 'Servicios'
            }]
            this.seleccion.forEach(s => {
                if (s.tipo === 'medicamento') {
                    ordenes[0].datos.push({
                        codesumi_id: s.codesumi_id,
                        Nombre: s.nombreCodigo,
                        id: s.id,
                        Tiporden_id: s.tipoOrden,
                        orden: s.orden_id
                    });
                }
                if (s.tipo === 'servicio') {
                    ordenes[1].datos.push({
                        orden_id: s.orden_id,
                        cup_id: s.cup_id,
                        id: s.id,
                        posFechar: false
                    });
                }
            })
            ordenes.forEach(s => {
                if (s.datos.length > 0) {
                    const dataSend = {
                        observaciones: this.observaciones,
                        autorizaciones: s.datos,
                        type: s.tipo,
                        id: s.datos[0].orden,
                        Tiporden_id: s.datos[0].Tiporden_id,
                    }
                    if (dataSend.type === "Medicamentos") {
                        const datos = {
                            articulos: dataSend.autorizaciones,
                            consulta: this.gestionGirs.consulta_id,
                            observacion: dataSend.observaciones,
                            estado: this.accion
                        }
                        this.$axios.post('auditoria/auditoria-estado', datos).then(res => {
                            // this.medicamentosOrdenados(this.gestionGirs.consulta_id)
                            if (this.accion === 1) {
                                this.dialogoCorreo = true
                                this.correo = this.datosPaciente.correo1
                            }
                            this.$toast.success('Autorización exitosa')
                        }).catch(e => {
                            console.log(e);
                        })
                    } else if (dataSend.type === "Servicios") {
                        const datos = {
                            procedimientos: dataSend.autorizaciones,
                            consulta: this.gestionGirs.consulta_id,
                            observacion: dataSend.observaciones,
                            estado: this.accion
                        }
                        this.$axios.post('auditoria/auditoria-estado', datos).then(res => {
                            this.medicamentosOrdenados(this.gestionGirs.consulta_id)
                            this.$toast.success('Autorización exitosa')
                        }).catch(e => {
                            console.log(e);
                        })
                    }
                }
            })
        },


        handleClose() {
            this.medicamentosOrdenados(this.gestionGirs.consulta_id);
        },

        enviarCorreo(item, enviar) {
            console.log('xd', item);
            const data = {
                id: item.orden_id,
                orden: item.orden_id,
                tipo: item.tipo,
                correo: this.correo,
                enviar: enviar,
                servicios: [{
                    identificador: item.id
                }]
            }
            this.$axios.post('pdf', data, {
                responseType: "arraybuffer"
            }).then(res => {
                this.dialogoCorreo = false
                this.dialog = false
            });
        }
    },

}

</script>

<style></style>
