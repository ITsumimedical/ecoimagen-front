<template>
    <div>
        <template>
            <div class="text-center">
                <v-dialog v-model="preload" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>
        <v-dialog v-model="dialogDetalle" fullscreen persistent v-if="afiliado">

            <v-card>
                <v-col cols="12" sm="12" md="12">
                    <v-alert border="left" text outlined dense class="text-center" color="blue-grey">
                        <h4>Datos afiliado</h4>
                    </v-alert>
                    <AfiliadoComponent :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
                </v-col>
                <v-alert border="left" text outlined dense type="success" icon="mdi-pill">
                    <h4>Medicamentos</h4>
                </v-alert>
                <v-data-table dense v-model="selectedArticulos" :headers="headersArticuloDetalle" :items="articulos"
                    :single-select="false" item-key="codesumi_id" show-select class="elevation-1" hide-default-footer>
                </v-data-table>
                <v-divider></v-divider>
                <v-col cols="12" sm="12" md="12">
                    <v-form>
                        <v-alert outlined class="text-center" dense text color="blue-grey">
                            <h4><b>PROCESO DE AUTORIZACIÓN</b></h4>
                        </v-alert>
                        <v-row>
                            <v-col cols="12" sm="6" md="3">
                                <v-select dense v-model="formAuditoria.estado" label="Seleccionar acción*"
                                    :items="estados" item-text="nombre" item-value="id"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="9">
                                <v-textarea dense auto-grow v-model="formAuditoria.observacion" label="Observaciones*"
                                    rows="2">
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>


                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarDialog()">Cerrar</v-btn>
                    <v-btn v-if="selectedArticulos.length > 0" small color="success"
                        @click="enviarEstado">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-card>
            <v-alert dense text icon="mdi-magnify" type="info"><b>Filtros de búsqueda</b></v-alert>
            <v-container>
                <v-row>
                    <v-col cols="12" md="4" class="pb-0">
                        <v-select dense v-model="formFilter.anio" :items="anios" label="Año" outlined></v-select>
                    </v-col>
                    <v-col cols="12" md="4" class="pb-0">
                        <v-select dense v-model="formFilter.mes" :items="meses" label="Mes" item-value="id"
                            item-text="nombre" outlined>
                        </v-select>
                    </v-col>
                    <v-col cols="12" md="4" class="pb-0">
                        <v-text-field dense v-model="formFilter.documento" outlined label="Número de identificación"
                            required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="12" align="right" class="pt-0">
                        <v-btn color="primary" small @click="buscarOrdenes">Buscar</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <br>
        <v-data-table dense :headers="headerMedicamentos" :items="ordenes" class="elevation-1" hide-default-footer>
            <template v-slot:[`item.acciones`]="{ item }">
                <td class="text-center">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon color="blue" v-on="on" v-bind="attrs" @click="cargarDetalles(item)">
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                        </template>
                        <span>Detalles</span>
                    </v-tooltip>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('autorizacion.oncologia')) {
            return redirect('/');
        }
    },
    name: 'autorizacionMedicamentos',
    components: {
        AfiliadoComponent,
    },
    data() {
        return {
            componenteAfiliado: false,
            preload: false,
            detalleSeleccionado: null,
            afiliado: {},
            articulos: [],
            servicios: [],
            selectedArticulos: [],
            dialogDetalle: false,
            formFilter: {
                anio: null,
                mes: null,
                documento: null
            },
            formAuditoria: {
                estado: null,
                observacion: null,
                fecha_vigencia: null
            },
            ordenes: [],
            anios: [],
            estados: [{
                id: 4,
                nombre: "Autorizado"
            },
            {
                id: 20,
                nombre: "Inadecuado"
            },
            {
                id: 21,
                nombre: "Negado"
            },
            {
                id: 5,
                nombre: "Anulado"
            },
            ],
            meses: [{
                id: '01',
                nombre: 'Enero'
            },
            {
                id: '02',
                nombre: 'Febrero'
            },
            {
                id: '03',
                nombre: 'Marzo'
            },
            {
                id: '04',
                nombre: 'Abril'
            },
            {
                id: '05',
                nombre: 'Mayo'
            },
            {
                id: '06',
                nombre: 'Junio'
            },
            {
                id: '07',
                nombre: 'Julio'
            },
            {
                id: '08',
                nombre: 'Agosto'
            },
            {
                id: '09',
                nombre: 'Septiembre'
            },
            {
                id: '10',
                nombre: 'Octubre'
            },
            {
                id: '11',
                nombre: 'Noviembre'
            },
            {
                id: '12',
                nombre: 'Diciembre'
            },
            ],
            headerMedicamentos: [{
                text: 'Fecha Creación',
                align: 'center',
                sortable: false,
                value: 'fecha_creacion',
            },
            {
                text: 'Cédula',
                align: 'center',
                sortable: false,
                value: 'consulta.afiliado.numero_documento',
            },
            {
                text: 'Afiliado',
                align: 'center',
                sortable: false,
                value: 'consulta.afiliado.nombre_completo',
            },
            {
                text: 'IPS Primaria',
                align: 'center',
                sortable: false,
                value: 'consulta.afiliado.ips.nombre',
            },
            {
                text: 'Diagnóstico',
                align: 'center',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Funcionario ordena',
                align: 'center',
                sortable: false,
                value: 'funcionario.empleado.nombre_completo',
            },
            {
                text: 'Acciones',
                align: 'center',
                sortable: false,
                value: 'acciones',
            },
            ],
            headersArticuloDetalle: [{
                text: 'Código',
                align: 'center',
                sortable: false,
                value: 'codesumi.codigo',
            },
            {
                text: 'Nombre',
                align: 'center',
                sortable: false,
                value: 'codesumi.nombre',
            },
            {
                text: 'Vía administración',
                align: 'center',
                sortable: false,
                value: 'codesumi.via',
            },
            {
                text: 'Dosificación',
                align: 'start',
                sortable: false,
                value: 'dosificacion',
            },
            {
                text: 'Observación',
                align: 'start',
                sortable: false,
                value: 'observacion',
            },
            {
                text: 'Cantidad médico',
                align: 'center',
                sortable: false,
                value: 'cantidad_medico',
            },

            ],
        };
    },

    created() {
        let primerAnio = 2023;
        const date = new Date();
        while (primerAnio <= date.getFullYear()) {
            this.anios.push(primerAnio);
            primerAnio++
        }
        this.formFilter.anio = date.getFullYear();
        this.formFilter.mes = String(date.getMonth()).length === 1 ? '0' + (date.getMonth() + 1) : String(date
            .getMonth() + 1);
    },
    methods: {
        buscarAfiliado(item) {
            this.preload = true
            this.$axios.get("afiliados/" + item.consulta.afiliado.numero_documento).then((res) => {
                // this.componente = "AfiliadoComponent";
                // this.componenteAfiliado = true;
                this.afiliado = res.data;
                this.preload = false;
            })
                .catch((e) => {
                    this.preload = false
                    this.$toast.error(e.response.data.error);
                });
        },
        buscarOrdenes() {
            this.$axios.$post('/auditoria/oncologia', this.formFilter).then(res => {
                this.ordenes = res;
            })
        },
        cargarDetalles(item) {
            this.preload = true
            this.detalleSeleccionado = item;
            this.$axios.$get('/auditoria/detalle-auditoria/' + item.consulta_id).then(res => {
                this.buscarAfiliado(item)
                this.articulos = res.articulos;
                this.dialogDetalle = true;
                this.preload = false;
            })
        },
        enviarEstado() {
            let data = this.formAuditoria
            data.consulta = this.detalleSeleccionado.consulta_id;
            data.articulos = this.selectedArticulos;
            if (data.observacion === null || data.estado === null) {
                return this.$swal.fire({
                    title: "¡No puede ser!",
                    text: "Debe determinar un estado e ingresar una observación",
                    type: "error",
                    footer: '<p>Por favor valide la información ingresada</p>'
                });
            }
            this.$axios.$post('/auditoria/auditoria-estado', data).then(res => {
                this.$toast.success(res);
                this.buscarOrdenes();
                this.cerrarDialog();
            })
        },
        cerrarDialog() {
            this.detalleSeleccionado = null;
            this.articulos = [];
            this.dialogDetalle = false;
            this.selectedArticulos = [];
            for (const prop of Object.getOwnPropertyNames(this.formAuditoria)) {
                this.formAuditoria[prop] = null;
            }
        }
    },
    mounted() {
        this.buscarOrdenes();
    }
};

</script>
