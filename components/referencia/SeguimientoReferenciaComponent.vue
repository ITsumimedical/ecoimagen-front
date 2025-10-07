<template>
    <div>
        <v-card class="pa-3" flat>
            <v-row>
                <v-col v-for="count in countReferenciaPendientes" :key="count.id" cols="12" sm="3" md="3">
                    <v-alert style="cursor: pointer" text dense :color="count.color" :icon="count.icon" border="left"
                        @click="listarPendientesAnexo(count.anexo, 1, 1)">
                        <v-badge color="orange" :content="count.title" bordered> <b>{{ count.subTitle }}</b>
                            Pendientes</v-badge>
                    </v-alert>
                </v-col>
                <v-col v-for="count in countReferenciaSeguimiento" :key="count.id" cols="12" sm="3" md="3">
                    <v-alert style="cursor: pointer" text dense :color="count.color" :icon="count.icon" border="left"
                        @click="listarSeguimientoAnexo(count.anexo, 1, 1)">
                        <v-badge color="orange" :content="count.title" bordered> <b>{{ count.subTitle }}</b> en
                            Seguimiento
                        </v-badge>
                    </v-alert>
                </v-col>
            </v-row>
            <!-- <v-col cols="12" sm="12" md="12">
        <v-text-field v-model="search" hint="Puedes buscar por cualquier campo de la tabla" label="Buscar">
        </v-text-field>
      </v-col> -->

            <v-row class="mx-2">
                <v-col md="1" lg="1" xl="1" sm="1s" cols>
                    <v-text-field dense v-model="id" label="Id" outlined></v-text-field>
                </v-col>
                <v-col md="2" lg="2" xl="2" sm="2s" cols>
                    <v-text-field dense v-model="documento" label="N° Documento" outlined></v-text-field>
                </v-col>
                <v-col md="3" lg="3" xl="3" sm="3s" cols>
                    <v-text-field dense v-model="departamento" label="Departamento" outlined></v-text-field>
                </v-col>
                <v-col md="2" lg="2" xl="2" sm="2s" cols>
                    <v-text-field dense type="date" v-model="fechaInicio" label="Fecha inicial" outlined></v-text-field>
                </v-col>
                <v-col md="2" lg="2" xl="2" sm="2s" cols>
                    <v-text-field dense type="date" v-model="fechaFin" label="Fecha final" outlined></v-text-field>
                </v-col>
                <v-col md="2" lg="2" xl="2" sm="2" cols>
                    <v-btn-toggle background-color="white" dark>
                        <v-btn small color="success" @click="listarPendientesAnexo(datos[0]?.tipo_anexo || 10, 1, 0)"
                            v-if="datos[0]?.estado == 'Pendiente'">Filtrar</v-btn>
                        <v-btn small color="success" @click="listarSeguimientoAnexo(datos[0]?.tipo_anexo || 10, 1, 0)"
                            v-if="datos[0]?.estado == 'En seguimiento'">Filtrar</v-btn>
                        <v-btn small class="ml-2" color="error" @click="limpiar()">Limpiar</v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
            <v-data-table :search="search" :headers="headers" :items="datos" loading-text="Cargando..."
                disable-pagination hide-default-footer no-data-text="Sin datos para mostrar" dense>

                <template v-slot:[`item.nombreCompleto`]="{ item }">
                    {{ [item.afiliados.primer_nombre, item.afiliados.segundo_nombre, item.afiliados.primer_apellido,
                    item.afiliados.segundo_apellido].filter(Boolean).join(' ') }}
                </template>

                <template v-slot:[`item.estado`]="{ item }">
                    <v-chip small :color="getColor(item.estado)" dark>
                        {{ item.estado }}
                    </v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex">
                        <BotonAbrirChatCoponent :item="item" @click="abrirModalAnexo(item)" />
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="warning" v-if="$can('referencia.exportarchat')"
                                    @click="exportarChat(item)" v-on="on">
                                    mdi-download
                                </v-icon>
                            </template>
                            <span>Exportar chat</span>
                        </v-tooltip>
                    </div>
                </template>
            </v-data-table>
            <v-row no-gutters v-if="datos.length > 0">
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2" v-if="datos[0].estado == 'Pendiente'">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="listarPendientesAnexo(datos[0].tipo_anexo, 0, 1)"></v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px"
                    v-if="datos[0].estado == 'Pendiente'">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="listarPendientesAnexo(datos[0].tipo_anexo, 0, 1)"></v-select>
                </v-col>
            </v-row>
            <v-row no-gutters v-if="datos.length > 0">
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2" v-if="datos[0].estado == 'En seguimiento'">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="listarSeguimientoAnexo(datos[0].tipo_anexo, 0, 1)"></v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px"
                    v-if="datos[0].estado == 'En seguimiento'">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="listarSeguimientoAnexo(datos[0].tipo_anexo, 0, 1)"></v-select>
                </v-col>
            </v-row>
        </v-card>
        <!-- Dialogo para llamar el detalle del anexo -->
        <v-dialog v-model="modalAnexo" persistent fullscreen hide-overlay transition="dialog-bottom-transition"
            scrollable v-if="modalAnexo">
            <v-card>
                <chatComponent :tipo="1" :datosReferencia="datoReferencia" :formAfiliado="datoReferencia.afiliados"
                    @respuestaComponente="cerrarModalAnexo()" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Widget from "@/components/widget/Widget.vue";
import chatComponent from "@/components/chat/LayoutChat.vue"
import BotonAbrirChatCoponent from "@/components/referencia/BotonAbrirChatComponent.vue"
import { mapActions, mapMutations } from "vuex";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("referencia.seguimiento.todo")) {
            return redirect("/");
        }
    },
    components: {
        chatComponent,
        Widget,
        BotonAbrirChatCoponent
    },
    data: () => ({
        fechaFin: '',
        fechaInicio: '',
        documento: '',
        departamento: '',
        id: '',
        opciones: [5, 10, 15, 20, 50, 100],
        opcionActual: 10,
        pagina: 1,
        total: 0,
        search: '',
        value: 1,
        active: true,
        datos: [],
        tab: null,
        datoReferencia: [],
        modalAnexo: false,
        countReferenciaPendientes: [{
            id: 1,
            color: "#00b297",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Contrarreferencia",
            anexo: 10
        },
        {
            id: 2,
            color: "orange darken-1",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Informe de atención de urgencias",
            anexo: 2
        },
        {
            id: 3,
            color: "blue darken-1",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Solicitud de autorización de servicios y tecnologías en salud",
            anexo: 3
        },
        {
            id: 4,
            color: "green darken-2",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Referencia",
            anexo: 9
        },
        ],
        countReferenciaSeguimiento: [{
            id: 5,
            color: "#00b297",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Contrarreferencia",
            anexo: 10
        },
        {
            id: 6,
            color: "orange darken-1",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Informe de atención de urgencias",
            anexo: 2
        },
        {
            id: 7,
            color: "blue darken-1",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Solicitud de autorización de servicios y tecnologías en salud",
            anexo: 3
        },
        {
            id: 8,
            color: "green darken-2",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Referencia",
            anexo: 9
        },
        ],
        headers: [{
            text: "Id",
            value: "id",
            align: "start"
        },
        {
            text: "Anexo",
            value: "tipo_anexo",
            align: 'center'
        },
        {
            text: "Identificación",
            value: "afiliados.numero_documento",
            align: 'left'
        },
        {
            text: "Nombre",
            value: "nombreCompleto",
            align: "left"
        }
            ,
        {
            text: "Departamento",
            value: 'afiliados.departamento_afiliacion.nombre',
            align: 'left'
        },
        {
            text: "Registro",
            value: "created_at",
            align: 'left'
        },
        {
            text: "IPS",
            value: "rep_nombre",
            align: "center"
        },
        {
            text: "Diagnósticos",
            value: "cie10s[0].Codigo_Nombre",
            align: 'center'
        },
        {
            text: "Tipo Solicitud",
            value: "tipo_solicitud",
            align: 'center'
        },
        {
            text: "Estado",
            value: "estado",
            align: 'center'
        },
        {
            text: "Gestión",
            value: "actions",
            align: 'start'
        },
        ],
    }),

    mounted() {
        this.contarPendientes();
        this.contarSeguimiento();
        this.listarPendientesAnexo(2, 1);
    },

    // watch: {
    //     modalAnexo(val) {
    //         this.setChat(val);
    //     }
    // },

    methods: {
        ...mapActions('app',['setPreload']),
        // ...mapMutations('chat', ['setChat']),

        /*
        ! litar al pendientes anexo
        * @param anexo
        * @return object datos
        * @author Kobatime
        */

        listarPendientesAnexo(anexo, paginas, buscador) {
            if (paginas == 1) {
                this.pagina = 1

            }
            if (buscador == 1) {
                this.documento = '',
                    this.departamento = '',
                    this.id = '',
                    this.fechaFin = '',
                    this.fechaInicio = ''
            }
            this.setPreload(true);
            this.$axios
                .post("referencias/listarPedientes?page=" + this.pagina + "&cant=" + this.opcionActual, {
                    anexo: anexo,
                    documento: this.documento,
                    id: this.id,
                    departamento: this.departamento,
                    fechaInicio: this.fechaInicio,
                    fechaFin: this.fechaFin
                })
                .then((res) => {
                    this.datos = res.data.data;
                    this.total = res.data.last_page;
                    this.setPreload(false)
                })
                .catch((e) => {
                    this.setPreload(false)
                    this.$toast.error(e.response.data.error);
                });
        },

        listarSeguimientoAnexo(anexo, paginas, buscador = null) {
            if (paginas == 1) {
                this.pagina = 1

            }
            if (buscador == 1) {
                this.documento = '',
                    this.departamento = '',
                    this.id = '',
                    this.fechaFin = '',
                    this.fechaInicio = ''
            }
            this.setPreload(true)
            this.$axios
                .post("referencias/listarSeguimiento?page=" + this.pagina + "&cant=" + this.opcionActual, {
                    anexo: anexo,
                    documento: this.documento,
                    id: this.id,
                    departamento: this.departamento,
                    fechaInicio: this.fechaInicio,
                    fechaFin: this.fechaFin
                })
                .then((res) => {
                    this.datos = res.data.data;
                    this.total = res.data.last_page;
                    this.setPreload(false)
                })
                .catch((e) => {
                    this.setPreload(false)
                });
        },

        contarPendientes() {
            this.$axios.get('referencias/contadorReferenciasPendientes').then(res => {
                this.countReferenciaPendientes[0].title = `${res.data[3]}`;
                this.countReferenciaPendientes[1].title = `${res.data[0]}`;
                this.countReferenciaPendientes[2].title = `${res.data[1]}`;
                this.countReferenciaPendientes[3].title = `${res.data[2]}`;
            });
        },

        contarSeguimiento() {
            this.$axios.get('referencias/contadorReferenciasSeguimiento').then(res => {
                this.countReferenciaSeguimiento[0].title = `${res.data[3]}`;
                this.countReferenciaSeguimiento[1].title = `${res.data[0]}`;
                this.countReferenciaSeguimiento[2].title = `${res.data[1]}`;
                this.countReferenciaSeguimiento[3].title = `${res.data[2]}`;
            });
        },



        abrirModalAnexo(items) {
            this.modalAnexo = true;
            this.datoReferencia = items;

        },
        cerrarModalAnexo() {
            this.modalAnexo = false;
            this.contarPendientes();
            this.contarSeguimiento();
            this.datoReferencia = {}
        },

        getColor(estado) {
            if (estado == "Pendiente") return "red";
            else return "green";
        },

        limpiar() {
            this.documento = '';
            this.departamento = '';
            this.id = '';
            this.fechaFin = '';
            this.fechaInicio = '';
            if (this.datos.length > 0) {
                const estado = this.datos[0].estado;
                const tipoAnexo = this.datos[0].tipo_anexo;
                if (estado === 'Pendiente') {
                    this.listarPendientesAnexo(tipoAnexo, 1, 1);
                } else if (estado === 'En seguimiento') {
                    this.listarSeguimientoAnexo(tipoAnexo, 1, 1);
                }
            } else {
                this.listarPendientesAnexo(3, 2);
            }
        },
        exportarChat(item) {
            this.$axios({
                url: '/pdf',
                method: 'POST',
                responseType: 'blob',
                data: {
                    tipo: 'ChatsCentroRegulador',
                    canal_id: item.canal.id
                }
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/pdf"
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            }).catch(error => {
                console.error('Error downloading the PDF:', error);
            });
        }




    },
};

</script>

<style lang="scss" scoped>
.buttom-nav-anexo {
    width: 30% !important;
    margin: 0 35% !important;
    border-radius: 40px;
    /* border-radius: 25px 25px 0 0; */
}
</style>
