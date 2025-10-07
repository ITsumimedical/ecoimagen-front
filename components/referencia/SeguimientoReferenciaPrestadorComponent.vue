<template>
    <div>

        <v-card class="pa-3 text-body-1" flat>

            <v-row class="mx-2">

                <v-col md="2" lg="2" xl="2" sm="2" cols>
                    <v-text-field dense v-model="filtro.idReferencia" label="Id Referencia" outlined>
                    </v-text-field>
                </v-col>

                <v-col md="4" lg="4" xl="4" sm="4" cols>
                    <v-text-field dense v-model="filtro.cedula" label="Cedula Afiliado" outlined>
                    </v-text-field>
                </v-col>

                <v-col md="2" lg="2" xl="2" sm="2" cols>
                    <v-autocomplete dense :items="anexo" item-text="text" item-value="id" v-model="filtro.anexo"
                        label="Tipo Anexo" outlined>
                    </v-autocomplete>
                </v-col>

                <v-col md="2" lg="2" xl="2" sm="2" cols>
                    <v-autocomplete dense :items="estados" item-text="nombre" item-value="id" v-model="filtro.estado"
                        label="Estado" outlined>
                    </v-autocomplete>
                </v-col>

                <v-col md="2" lg="2" xl="2" sm="6" cols>
                    <v-btn-toggle background-color="white" dark>
                        <v-btn small color="success" @click="listarPendientesPrestadorAnexo()">Filtrar</v-btn>
                        <v-btn small class="ml-2" color="error" @click="limpiar()">Limpiar</v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>

            <v-data-table :headers="headers" :items="datos" class="elevation-1 mt-4" loading-text="cargando..."
                hide-default-footer disable-pagination no-data-text="Sin datos para mostrar" dense>
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

                <!-- Colores del estado -->
                <template v-slot:[`item.created_at`]="{ item }">
                    {{ item.created_at.substring(0, 15) }}
                </template>


                <template v-slot:[`item.tipo_anexo`]="{ item }">
                    {{ item.tipo_anexo }}
                </template>

                <!-- acciones -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="info" class="mr-2" @click="abrirModalAnexo(item)">
                        mdi-chat
                    </v-icon>
                </template>

            </v-data-table>

            <v-row no-gutters>
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="listarPendientesPrestadorAnexo()"></v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="listarPendientesPrestadorAnexo()"></v-select>
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
import chatComponent from "~/components/chat/LayoutChat.vue";
import { mapActions } from "vuex";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('referencia.seguimiento.prestador')) {
            return redirect('/');
        }
    },
    name: 'seguimientoReferenciaPrestador',
    components: {
        chatComponent
    },

    mounted() {
        this.listarPendientesPrestadorAnexo();
    },

    data() {
        return {
            componente: null,
            datos: [],
            opciones: [5, 10, 15, 20, 50, 100],
            opcionActual: 10,
            pagina: 1,
            total: 0,
            datoReferencia: [],
            anexo: [
                { 'id': 2, 'text': 'Informe de la atención de urgencias' },
                { 'id': 3, 'text': 'Solicitud de autorización de servicios y tecnologías en salud' },
                { 'id': 9, 'text': 'Referencia' },
                { 'id': 10, 'text': 'Contrareferencia' }
            ],
            modalAnexo: false,
            filtro: {
                anexo: null,
                estado: null,
                cedula: null,
                idReferencia: null,
            },
            estados: [
                { id: 19, nombre: 'Seguimiento' },
                { id: 10, nombre: ' Pendiente' }
            ],
            headers: [{
                text: "Id",
                value: "id",
                align: "start"
            },
            {
                text: "Anexo",
                value: "tipo_anexo",
                align: 'start'
            },
            {
                text: "Identificación",
                value: "afiliados.numero_documento",
                align: 'start'
            },
            {
                text: "Nombre",
                value: "nombreCompleto",
                align: "left"
            }
                ,
            {
                text: "Registro",
                value: "created_at",
                align: 'center'
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

        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        /*
        ! litar al pendientes anexo
        * @param anexo
        * @return object datos
        * @author Kobatime
        */

        listarPendientesPrestadorAnexo() {
            this.setPreload(true)
            this.$axios.post("referencias/listarPedientesPrestador?page=" + this.pagina + "&cant=" + this.opcionActual, this.filtro)
                .then((res) => {
                    this.total = res.data.last_page;
                    this.datos = res.data.data;
                    this.setPreload(false);
                })
                .catch((e) => {
                    this.setPreload(false);

                });
        },

        abrirModalAnexo(items) {
            this.modalAnexo = true;
            this.datoReferencia = items;
        },
        cerrarModalAnexo() {
            this.modalAnexo = false;
            this.listarPendientesPrestadorAnexo(this.datoReferencia.tipo_anexo);
            this.datoReferencia = {}
        },

        getColor(estado) {
            if (estado == "Pendiente") return "red";
            else return "green";
        },

        limpiar() {
            this.setPreload(true);
            for (const prop of Object.getOwnPropertyNames(this.filtro)) {
                this.filtro[prop] = null;
            }
            this.setPreload(false);
            this.listarPendientesPrestadorAnexo()
        },

    }
}

</script>
