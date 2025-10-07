<template>
    <div>
        <v-card class="pa-3" flat>
            <v-row>
                <v-col v-for="count in countReferenciaPendientes" :key="count.id" cols="12" sm="3" md="3">
                    <v-alert style="cursor: pointer" text dense :color="count.color" :icon="count.icon" border="left"
                        @click="listarProcesadoPrestador(count.anexo)">
                        <v-badge color="orange" :content="count.title" bordered> <b>{{ count.subTitle }}</b>
                            Procesados</v-badge>
                    </v-alert>
                </v-col>
            </v-row>

            <v-row class="mx-2">
                <v-col md="9" lg="9" xl="9" sm="9s" cols>
                    <v-text-field dense v-model="filtro.documento" label=" N° Documento" outlined>
                    </v-text-field>
                </v-col>

                <v-col md="2" lg="2" xl="2" sm="6" cols>
                    <v-btn-toggle background-color="white" dark>
                        <v-btn small color="success" @click="listarProcesadoPrestador(tipoAnexo)">Filtrar</v-btn>
                        <v-btn small class="ml-2" color="error" @click="limpiar()">Limpiar</v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>

            <v-data-table :headers="headers" :items="datos" loading-text="cargando..." hide-default-footer
                disable-pagination no-data-text="Sin datos para mostrar" dense>
                <template v-slot:[`item.nombreCompleto`]="{ item }">
                    {{ [item.afiliados.primer_nombre, item.afiliados.segundo_nombre, item.afiliados.primer_apellido,
                    item.afiliados.segundo_apellido].filter(Boolean).join(' ') }}
                </template>

                <!-- Colores del estado -->
                <template v-slot:[`item.estado`]="{ item }">
                    <v-chip small :color="getColor(item.estado)" dark>
                        {{ item.estado }}
                    </v-chip>
                </template>

                <!-- acciones -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="info" center="mr-2" @click="abrirModalAnexo(item)">
                        mdi-clipboard-text
                    </v-icon>
                </template>
            </v-data-table>
            <v-row no-gutters>
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="listarProcesadoPrestador(tipoAnexo)"></v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="listarProcesadoPrestador(tipoAnexo)"></v-select>
                </v-col>
            </v-row>
        </v-card>

        <!-- Dialogo para llamar el detalle del anexo -->
        <v-dialog v-if="modalAnexo" v-model="modalAnexo" persistent fullscreen hide-overlay
            transition="dialog-bottom-transition" scrollable>
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
import { mapActions } from "vuex";

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
    },
    data: () => ({
        value: 1,
        active: true,
        datos: [],
        tab: null,
        datoReferencia: [],
        opciones: [5, 10, 15, 20, 50, 100],
        opcionActual: 10,
        pagina: 1,
        total: 0,
        modalAnexo: false,
        filtro: {
            anexo: null,
            documento: null,
        },
        tipoAnexo: null,
        countReferenciaPendientes: [{
            id: 1,
            color: "#00b297",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Contrareferencia",
            anexo: 10
        },
        {
            id: 2,
            color: "orange darken-1",
            icon: "mdi-clipboard-text",
            title: "0",
            subTitle: "Informe de la atención de urgencias",
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
            align: 'center'
        },
        ],
    }),

    mounted() {
        this.contarProcesadosPrestador();
        this.listarProcesadoPrestador(2);
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        /*
        ! litar al pendientes anexo
        * @param anexo
        * @return object datos
        * @author Kobatime
        */

        listarProcesadoPrestador(anexo) {
            this.setPreload(true);
            this.tipoAnexo = anexo;
            this.filtro.anexo = anexo;
            this.$axios
                .post("referencias/listarProcesadoPrestador?page=" + this.pagina + "&cant=" + this.opcionActual, this.filtro)
                .then((res) => {
                    this.total = res.data.last_page;
                    this.datos = res.data.data;
                    this.setPreload(false);
                })
                .catch((e) => {
                    this.setPreload(false);
                    this.$toast.error(e.response.data.error);
                });
        },


        contarProcesadosPrestador() {
            this.$axios.get('referencias/contadorReferenciasProcesadoPrestador').then(res => {
                this.countReferenciaPendientes[0].title = `${res.data[3]}`;
                this.countReferenciaPendientes[1].title = `${res.data[0]}`;
                this.countReferenciaPendientes[2].title = `${res.data[1]}`;
                this.countReferenciaPendientes[3].title = `${res.data[2]}`;
            });
        },

        abrirModalAnexo(items) {
            this.modalAnexo = true;
            this.datoReferencia = items;
        },
        cerrarModalAnexo() {
            this.modalAnexo = false;
            this.contarProcesadosPrestador(this.datoReferencia.tipo_anexo);
            this.listarProcesadoPrestador(this.tipoAnexo)
            this.datoReferencia = {}
        },

        getColor(estado) {
            if (estado == "Pendiente") return "red";
            else return "green";
        },

        limpiar() {
            this.setPreload(true);
            this.filtro.documento = null;
            this.setPreload(false);
            this.listarProcesadoPrestador(this.tipoAnexo)
        },

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
