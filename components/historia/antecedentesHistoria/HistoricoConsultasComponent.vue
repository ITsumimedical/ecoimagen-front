<template>
    <div>


        <v-card :loading="preload">
            <v-alert class="text-center" dense text border="left" type="info"
                icon="mdi-book-open-page-variant">HISTORICO DE
                CONSULTAS
            </v-alert>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="3" sm="3">
                        <v-text-field label="Ingresar fecha inicial" type="date" v-model="filtro.fecha_inicio" dense
                            outlined>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="3">
                        <v-text-field label="Ingresar fecha final" type="date" v-model="filtro.fecha_final" dense
                            outlined>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn outlined fab small color="success" v-bind="attrs" v-on="on"
                                    @click="buscarAtenciones">
                                    <v-icon>mdi-magnify</v-icon>
                                </v-btn>
                            </template>
                            <span>Buscar</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn outlined fab small color="red" v-bind="attrs" v-on="on" @click="limpiarFiltros">
                                    <v-icon>mdi-close-circle</v-icon>
                                </v-btn>
                            </template>
                            <span>Limpiar</span>
                        </v-tooltip>
                    </v-col>
                </v-row>

            </v-card-text>
            <v-data-table :headers="headers" :items="historicoConsultas" :loading="loadingTable" disable-pagination
                v-if="historicoConsultas" loading-text="Cargando... por favor espere" hide-default-footer>
                <template v-slot:[`item.afiliado`]="{ item }">
                    {{ `${item.afiliado.primer_nombre || ''} ${item.afiliado.primer_apellido || ''}`.trim() || 'Sin nombre' }}
                </template>

                <template v-slot:[`item.medico`]="{ item }">
                    <td>
                        {{ `${item.medico_ordena?.operador?.nombre || ''} ${item.medico_ordena?.operador?.apellido ||
                            ''}`.trim() || 'Sin nombre' }}
                    </td>
                </template>
                <template v-slot:[`item.nEspecialidad`]="{ item }">
                    <td v-if="item.finalidad == 'Cargue historia contingencia'">
                        {{ item.finalidad }}
                    </td>
                    <td v-else>
                        {{ item.especialidad.nombre }}
                    </td>
                </template>
                <template v-slot:[`item.tipo`]="{ item }">
                    <td>
                        {{ item.tipo_consulta.nombre }}
                    </td>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                    <div class="text-center">
                        <v-tooltip bottom v-if="item.finalidad != 'Cargue historia contingencia'">
                            <template v-slot:activator="{ on }">

                                <v-btn class="mx-2" fab dark x-small color="blue" v-on="on"
                                    @click="imprimir(item.id, 'historia')">
                                    <v-icon dark>
                                        mdi-download
                                    </v-icon>
                                </v-btn>

                            </template>
                            <span>Descargar Historia</span>
                        </v-tooltip>
                        <v-tooltip bottom v-else>
                            <template v-slot:activator="{ on }">

                                <v-btn class="mx-2" fab dark x-small color="success" v-on="on"
                                    @click="imprimirAdjunto(item.cargue_historia_contingencia.ruta)">
                                    <v-icon dark>
                                        mdi-download
                                    </v-icon>
                                </v-btn>

                            </template>
                            <span>Descargar Historia</span>
                        </v-tooltip>

                    </div>
                </template>
                <template v-slot:no-data>
                </template>
            </v-data-table>
            <v-row no-gutters v-if="historicoConsultas">
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                    <v-pagination v-model="paginaOrden" class="my-4" :length="totalOrden" :total-visible="9"
                        @input="buscarAtenciones">
                    </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActualOrden" :items="opcionesOrden" dense solo small
                        @change="buscarAtenciones">
                    </v-select>
                </v-col>
            </v-row>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" small dark @click="$emit('respuestaComponente')">Cerrar</v-btn>
            </v-card-actions>
        </v-card>

    </div>
</template>
<script>
import moment from "moment";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('historico.atenciones.consultas')) {
            return redirect('/');
        }
    },
    name: "historicoConsultas",
    props: {
        datosCita: Object
    },
    data: () => ({

        preload: false,
        loadingTable: false,
        documento: null,
        historicoConsultas: null,
        filtro: {
            fecha_inicio: '',
            fecha_final: ''
        },
        headers: [{
            text: 'F.Atención',
            align: 'center',
            sortable: false,
            value: 'fecha_hora_inicio',
        },
        {
            text: 'Afiliado',
            align: 'center',
            sortable: false,
            value: 'afiliado',
        },
        {
            text: 'Atendido Por',
            align: 'center',
            sortable: false,
            value: 'medico',
        },
        {
            text: 'Especialidad',
            align: 'center',
            sortable: false,
            value: 'nEspecialidad',
        },
        {
            text: 'Tipo',
            align: 'center',
            sortable: false,
            value: 'tipo',
        },
        {
            text: 'Acciones',
            align: 'center',
            sortable: false,
            value: 'acciones',
        }
        ],
        paginaOrden: 1,
        totalOrden: 0,
        opcionesOrden: [5, 10, 20, 50, 100],
        opcionActualOrden: 5,
        tipoArchivo: [],
        datosPaciente: null,
    }),

    mounted() {
        this.buscarAtenciones();
    },
    methods: {
        validarErrores() {
            return [];
        },
        buscarAtenciones() {
            if (this.filtro.fecha_inicio && !this.filtro.fecha_final) {
                this.$toast.error("Debe ingresar una fecha final si ha ingresado una fecha inicial.");
                return;
            }
            this.loadingTable = true;
            this.preload = true;
            this.$axios.post('/historia/consultas?page=' + this.paginaOrden + '&cant=' + this.opcionActualOrden, {
                documento: this.datosCita.afiliado.numero_documento,
                fecha_inicio: this.filtro.fecha_inicio,
                fecha_final: this.filtro.fecha_final
            }).then(res => {
                this.historicoConsultas = res.data.data;
                this.totalOrden = res.data.last_page;
                this.loadingTable = false;
                this.preload = false;
            }).catch(e => {
                this.preload = false;
                this.loadingTable = false;
            });
        },
        limpiarFiltros() {
            this.filtro.fecha_inicio = null;
            this.filtro.fecha_final = null;
            this.buscarAtenciones();
        },
        imprimir(id, tipo) {
            const data = {
                tipo: tipo,
                consulta: id
            }
            this.$axios.post('pdf', data, {
                responseType: "arraybuffer"
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/pdf"
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            });
        },

        async imprimirAdjunto(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error('El adjunto de la factura no existe!')
                console.log(error.response);
            }
        },
    }
}

</script>
