<template>
    <div>

        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-card>
                    <v-card-title>
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <div class="d-flex align-center">
                                    <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                    <span>SOLICITUDES BODEGAS</span>
                                </div>
                            </v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                        </v-toolbar>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-col cols="12" sm="12" md="12">
                        <v-row>

                            <v-col cols="12" md="12">
                                <v-autocomplete @change="cargarComponente" v-model="componenteSeleccionado"
                                    label="Tipo transacción*" :items="tipoSolicitud" item-text="nombre" dense outlined
                                    return-object></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-card>
                <v-col cols="12" sm="12" md="12">
                 <component v-bind:is="componenteActivo" :tipo="tipo"></component>
               </v-col>

            </v-col>
        </v-row>


    </div>
</template>
<script>
import SolicituddeCompras from "../../components/farmacia/bodegas/solicitudes/solicitudCompras.vue";
import Traslado from "../../components/farmacia/bodegas/solicitudes/traslado.vue";
import AjustedeEntrada from "../../components/farmacia/bodegas/solicitudes/ajusteEntrada.vue";
import AjustedeSalida from "../../components/farmacia/bodegas/solicitudes/ajusteSalida.vue";
import {
    listarTiposSolicitudBodegas
} from "~/api/tipoSolicitudBodegas/tipoSolicitudBodega";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('farmacia.solicitudes')) {
            return redirect('/');
        }
    },
    name: "solicitudesBodegas",
    components: {
        SolicituddeCompras,
        Traslado,
        AjustedeEntrada,
        AjustedeSalida
    },

    mounted() {
        this.listarTiposSolicitudBodegas();
    },
    data: () => ({
        tipo: null,
        componenteActivo: null,
        componenteSeleccionado: null,
        tipoSolicitud: [],
    }),
    methods: {
        listarTiposSolicitudBodegas() {
            this.$loadingGetRequest(listarTiposSolicitudBodegas(0, 0)).then(res => {
                this.tipoSolicitud = res.data.map(s => {
                    if (parseInt(s.estado_id) === 1) {
                        return {
                            id: s.id,
                            nombre: s.nombre,
                            componente: s.nombre.replaceAll(' ', '')
                        }
                    }
                });
            }).catch(e => {
                console.log(e.response)
            })
        },
        cargarComponente() {
            this.tipo = this.componenteSeleccionado.id;
            this.componenteActivo = this.componenteSeleccionado.componente
        }
    }
}

</script>
