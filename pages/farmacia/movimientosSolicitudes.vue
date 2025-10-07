<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>SOLICITUD DE MOVIMIENTOS</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-container>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-autocomplete @change="cargarComponente" v-model="componenteSeleccionado"
                            label="Tipo transacción*" outlined dense :items="tipoSolicitud" item-text="nombre"
                            return-object></v-autocomplete>
                    </v-col>
                </v-row>
            </v-container>
            <component v-bind:is="componenteActivo" :tipo="tipo"></component>
        </v-card>


    </div>
</template>
<script>
import SolicituddeCompras from "~/components/farmacia/bodegas/movimiento/solicitudCompras";
import Traslado from "~/components/farmacia/bodegas/movimiento/traslado";
import AjustedeEntrada from "~/components/farmacia/bodegas/movimiento/ajusteEntrada";
import AjustedeSalida from "~/components/farmacia/bodegas/movimiento/ajusteSalida";
import IngresoConsignacion from "~/components/farmacia/bodegas/movimiento/consignacion";
import {
    listarTiposSolicitudBodegas
} from "~/api/tipoSolicitudBodegas/tipoSolicitudBodega";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('farmacia.movimientos')) {
            return redirect('/');
        }
    },
    name: "auditoriaSolicitudes",
    components: {
        SolicituddeCompras,
        Traslado,
        AjustedeEntrada,
        AjustedeSalida,
        IngresoConsignacion
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
                    if (s.id === 9 || s.id === 3 || s.id === 4 || s.id === 1 || s.id === 2) {
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
