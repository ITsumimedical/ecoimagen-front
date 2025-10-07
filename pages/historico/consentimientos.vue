<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Consentimientos</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-row class="mt-3">
                    <v-col cols="12" sm="12" md="3">
                    <v-autocomplete dense outlined v-model="filtroPacientes.tipo_consentimientos" :items="tipoConsentimientos" no-data-text="No existen datos" label="Tipo Consentimiento">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                    <v-text-field dense outlined v-model="filtroPacientes.documento" @keyup.enter="listarConsentimientosFirmados()" label="No. Documento">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-btn color="primary" @click="listarConsentimientosFirmados()">Buscar</v-btn>
                        <v-btn color="error" @click="limpiarPacientes()">Limpiar</v-btn>
                    </v-col>
                </v-row>
            </v-toolbar>
        </v-card-title>

        <v-row>
            <v-col cols="12" md="12" sm="12">
                <v-divider></v-divider>
            </v-col>
            <v-col cols="6" sm="6" md="6" class="ml-4">
                    <v-text-field v-model="buscar" label="Busca por nombre, documento, cup o fecha"
                        prepend-inner-icon="mdi-magnify">
                    </v-text-field>
                </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-data-table v-if="filtroPacientes.tipo_consentimientos !== 'consentimientos_manuales'"
                    disable-pagination hide-default-footer dense
                    :headers="seleccionarHeader(filtroPacientes.tipo_consentimientos)"
                    :items="consentimientos" :loading="cargando" :items-per-page="opcionActual" :search="buscar"
                    loading-text="Cargando... Espere por favor" no-data-text="Sin datos para mostrar">
                    <template v-slot:[`item.tipoCita`]="{ item }">
                        <td>{{ item?.orden?.consulta?.cita?.nombre ?? '-' }}</td>
                    </template>
                    <template v-slot:[`item.aceptacionConsentimiento`]="{ item }">
                        <td>{{ item?.aceptacion_consentimiento ?? '-' }}</td>
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="success" v-bind="attrs" v-on="on"
                                    @click="abrirModalFirmaDiscentimiento(item)">
                                    mdi-draw-pen
                                </v-icon>
                            </template>
                            <span>Firmar disentimiento</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon  color="primary" v-bind="attrs" v-on="on" @click="imprimirConsentimiento(item)">
                                    mdi-file-download-outline
                                </v-icon>
                            </template>
                            <span>Descargar consentimiento informado</span>
                        </v-tooltip>
                    </template>

                    <template v-slot:[`item.accion`]="{ item }">
                        <!-- <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon color="success" v-bind="attrs" v-on="on" @click="abrirModalFirmaDiscentimiento(item)">
                                    mdi-draw-pen
                                </v-icon>
                            </template>
                            <span>Firmar disentimiento</span>
                        </v-tooltip> -->
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="primary" v-bind="attrs" v-on="on"
                                    @click="imprimirConsentimientoTelemdicina(item)">
                                    mdi-file-download-outline
                                </v-icon>
                            </template>
                            <span>Descargar consentimiento informado</span>
                        </v-tooltip>
                    </template>
                    <!-- <template v-slot:[`item.fecha_firma`]="{ item }">
                        {{ $moment(item.fecha_firma || item.fecha_firma_discentimiento).format('DD/MM/YYYY H:mm') }}
                    </template> -->
                </v-data-table>
                
                <v-data-table v-if="filtroPacientes.tipo_consentimientos == 'consentimientos_manuales'"
                    disable-pagination hide-default-footer dense :headers="headersConsentimientoManual"
                    :items="consentimientos" :loading="cargando" :items-per-page="opcionActual"
                    loading-text="Cargando... Espere por favor" no-data-text="Sin datos para mostrar" :search="buscar">

                    <template v-slot:[`item.accion`]="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="primary" v-bind="attrs" v-on="on"
                                    @click="imprimirConsentimientoManual(item.cargue_historia_contingencia.ruta)">
                                    mdi-file-download-outline
                                </v-icon>
                            </template>
                            <span>Descargar consentimiento informado</span>
                        </v-tooltip>
                    </template>
                    <!-- <template v-slot:[`item.fecha_hora_inicio`]="{ item }">
                        {{ $moment(item.fecha_hora_inicio).format('DD/MM/YYYY') }}
                    </template> -->
                </v-data-table>
            </v-col>
        </v-row>

        <v-row no-gutters style="background-color: white;">
            <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
            <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarConsentimientosFirmados">
                </v-pagination>
            </v-col>
            <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense outlined small @change="listarConsentimientosFirmados()">
                </v-select>
            </v-col>
        </v-row>
    <ModalFirmaDiscentimiento :mostrarModalFirmaDiscentimiento.sync="mostrarModalFirmaDiscentimiento" :ordenProcedimientoSeleccionado="ordenProcedimientoSeleccionado"></ModalFirmaDiscentimiento>

    </v-card>
</template>

<script>
import {
    mapActions
} from 'vuex';
import ModalFirmaDiscentimiento from '~/components/historico/ModalFirmaDiscentimiento.vue';

export default {
    components: {
        ModalFirmaDiscentimiento
    },
    data() {
        return {
            consentimientos: [],
            mostrarModalFirmaDiscentimiento: false,
            ordenProcedimientoSeleccionado: null,
            pagina: 1,
            total: 0,
            opcionActual: 10,
            opciones: [5, 10, 20, 50, 100],
            cargando: false,
            filtroPacientes: {
                documento: "",
                tipo_consentimientos: null
            },
            tipoConsentimientos: [
                { text: 'Telemedicina', value: 'telemedicina' },
                { text: 'Consentimientos de consulta', value: 'consentimiento_de_consulta' },
                { text: 'Consentimientos de laboratorio', value: 'consentimientos_de_laboratorio' },
                { text: 'Consentimientos manuales contingencia', value: 'consentimientos_manuales' },
                { text: 'Consentimientos anestesia', value: 'consentimientos_anestesia' },
            ],
            pacientes: [],
            headers: [{
                text: 'ID',
                align: 'center',
                pagina: 1,
                total: 0,
                opcionActual: 5,
                sortable: false,
                value: 'id',
            },
            {
                text: 'Nombre paciente',
                align: 'center',
                sortable: false,
                value: 'orden.consulta.afiliado.nombre_completo',
            },
            {
                text: 'N. Documento',
                align: 'center',
                sortable: false,
                value: 'orden.consulta.afiliado.numero_documento',
            },
            {
                text: 'Cup',
                align: 'center',
                sortable: false,
                value: 'cup.codigo_nombre',
            },
            {
                text: 'Acepta consentimiento',
                align: 'center',
                sortable: false,
                value: 'aceptacionConsentimiento',
            },
            {
                text: 'Fecha firma',
                align: 'center',
                sortable: false,
                value: 'fecha_firma',
            },
            {
                text: 'Tipo cita',
                align: 'center',
                sortable: false,
                value: 'tipoCita',
            },
            {
                text: 'Profesional',
                align: 'center',
                sortable: false,
                value: 'orden.consulta.medico_ordena.operador.nombre_completo',
            },
            {
                text: 'Acciones',
                align: 'center',
                sortable: false,
                value: 'acciones',
            },
            ],
            headersTeleconsulta: [{
                text: 'ID',
                align: 'center',
                pagina: 1,
                total: 0,
                opcionActual: 5,
                sortable: false,
                value: 'id',
            },
            {
                text: 'Nombre paciente',
                align: 'center',
                sortable: false,
                value: 'afiliado.nombre_completo',
            },
            {
                text: 'N. Documento',
                align: 'center',
                sortable: false,
                value: 'afiliado.numero_documento',
            },
            {
                text: 'Fecha Consentimiento',
                align: 'center',
                sortable: false,
                value: 'firma_consentimiento_time',
            },
            {
                text: 'Nombre medico',
                align: 'center',
                sortable: false,
                value: 'medico_ordena.operador.nombre_completo',
            },
            {
                text: 'Acciones',
                align: 'center',
                sortable: false,
                value: 'accion',
            },
            ],
            headersConsentimientoManual: [{
                text: 'ID',
                align: 'center',
                pagina: 1,
                total: 0,
                opcionActual: 10,
                sortable: false,
                value: 'id',
            },
            {
                text: 'Nombre paciente',
                align: 'center',
                sortable: false,
                value: 'afiliado.nombre_completo',
            },
            {
                text: 'N. Documento',
                align: 'center',
                sortable: false,
                value: 'afiliado.numero_documento',
            },
            {
                text: 'Fecha cargue',
                align: 'center',
                sortable: false,
                value: 'fecha_firma',
            },
            {
                text: 'Nombre profesional carga',
                align: 'center',
                sortable: false,
                value: 'cargue_historia_contingencia.funcionario_carga.operador.nombre_completo',
            },
            {
                text: 'Acciones',
                align: 'center',
                sortable: false,
                value: 'accion',
            },
            ],
            buscar: ''
        }
    },
    mounted() { },
    methods: {
        ...mapActions('app', ['setPreload']),

        async listarConsentimientosFirmados() {
            this.consentimientos = [];
            try {
                this.cargando = true;
                const params = {
                    page: this.pagina,
                    cantidad: this.opcionActual,
                    tipo_consentimiento: this.filtroPacientes.tipo_consentimientos,
                    documento: this.filtroPacientes.documento,
                }
                const response = await this.$axios.get('consentimientos-informados/listar-consentimientos', {
                    params
                });

                this.consentimientos = response.data.data.map(item=>{
                    //se mapea la fecha de firma y la fecha de telemedicina segun sea el caso para mostrarla en el formato correcto en el header al que corresponde. 
                    const fecha_telemedicina = this.tipoConsentimientos === 'telemedicina' ?? item.firma_consentimiento_time 
                    const fecha = this.tipoConsentimientos !== 'telemedicina' ? (item.fecha_firma || item.fecha_hora_inicio || item.fecha_firma_discentimiento): null;

                    //se formatea desde la recepcion de la data para que que se muestre en los formatos correctos tipo string y pueda aplicarse la busqueda en la barra incluyendo la fecha
                    return {
                        ...item,
                        fecha_firma: this.$moment(fecha).isValid() ? this.$moment(fecha).format('DD/MM/YYYY H:mm'): '-',
                        fecha_telemedicina : this.$moment(fecha_telemedicina).isValid() ? this.$moment(fecha_telemedicina).format('DD/MM/YYYY H:mm') : '-',
                    }
                });
                this.total = response.data.last_page;
            } catch (error) {
                console.log(error)
                this.$toast.error('Error al listar los consentimientos');
            } finally {
                this.cargando = false;
            }
        },

        async imprimirConsentimiento(item) {
            const tipo = this.tipoConsentimientoPDF(this.filtroPacientes.tipo_consentimientos)
            this.setPreload(true)
            await this.$axios.post('pdf', {
                tipo: tipo,
                orden_id: item.id,
                id: item.cup.id
            }, {
                responseType: "arraybuffer"
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/pdf"
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
                this.setPreload(false)
            }).catch(err => {
                this.setPreload(false);
            })
        },

		imprimirConsentimientoTelemdicina(item){

            const tipo = this.tipoConsentimientoPDF(this.filtroPacientes.tipo_consentimientos)
            this.setPreload(true)
            this.$axios.post('pdf', {
                tipo: tipo,
                consulta_id: item.id,
            }, {
                responseType: "arraybuffer"
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/pdf"
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
                this.setPreload(false)
            }).catch(err => {
                this.setPreload(false);
            })
        },
        async imprimirConsentimientoManual(ruta) {
            try {
                this.setPreload(true)
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
                this.setPreload(false)
            } catch (error) {
                this.setPreload(false)
                this.$toast.error('El adjunto de consentimiento no existe!');
                console.log(error.response);
            }
        },

        abrirModalFirmaDiscentimiento(item) {
            this.ordenProcedimientoSeleccionado = item;
            this.mostrarModalFirmaDiscentimiento = true;
        },

        limpiarPacientes() {
            this.filtroPacientes = {
                documento: "",
                tipo_consentimientos: null

            };
            this.pacientes = [];
            this.consentimientos = [];
        },

        seleccionarHeader(tipoConsentimiento){
            switch(tipoConsentimiento){
                case 'telemedicina':
                    return this.headersTeleconsulta;
                case 'consentimientos_manuales':
                    return this.headersConsentimientoManual;
                case 'consentimientos_anestesia':
                    return this.headersTeleconsulta;
                default:
                    return this.headers;
            }
        },

        tipoConsentimientoPDF(tipoConsentimiento){
            switch(tipoConsentimiento){
                case 'telemedicina':
                    return 'consentimientoInformadoTelemedicina';
                case 'consentimientos_anestesia':
                    return 'consentimientoInformadoAnestesia';
                case 'consentimiento_de_consulta':
                    return 'consentimientoInformado';
                case 'consentimientos_de_laboratorio':
                    return 'consentimientoInformadoLaboratorio';
                default:
                    return null;

            }
        }

    }
}
</script>
