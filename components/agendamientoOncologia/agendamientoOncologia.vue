<template>
    <div>
        <v-row>
            <v-col cols="12" sm="6" md="12">
                <v-row>
                    <v-col>
                        <buscar-afiliado :documentos="documentos" @buscarAfiliado="realizarBusqueda"
                            ref="buscarAfiliado" @input="limpiarComponentes">
                            <template v-slot:acciones>

                            </template>
                        </buscar-afiliado>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-card v-if="usuario">
            <AfiliadoComponent :afiliado="usuario" :modoDetalle="true" :modoEdicion="true"
                :mostrarClasificaciones="true" />

            <v-col>
                <AgendamientoDemanda modulo="enfermeriaOncologia" ref="AgendamientoDemanda" :afiliado="usuario" />
            </v-col>
        </v-card>

    </div>
</template>

<script>
import BuscarAfiliado from '@/components/afiliado/BuscarAfiliadoComponente.vue';
import AfiliadoComponent from '@/components/afiliado/FormularioAfiliadoComponente.vue';
import AgendamientoDemanda from '~/components/demandaInducida/agendamientoDinamicoDemanda.vue'


import {
    buscarAfiliado
} from "@/api/afiliados/afiliados";

export default {

    components: {
        BuscarAfiliado,
        AfiliadoComponent,
        AgendamientoDemanda
    },
    data() {
        return {
            documentos: [],
            afiliados: [],
            usuario: null,
            datosBasicos: true,
            editar: true,

        }
    },


    methods: {
        realizarBusqueda(cedula, tipoDocumento) {
            this.$loadingGetRequest(buscarAfiliado(cedula, tipoDocumento)).then(({
                data
            }) => {
                this.usuario = data
            }).catch(error => {
                this.$toast.error(error.response.data.error);
                this.limpiarComponentes();
            });
        },

        limpiarComponentes() {
            this.usuario = ''
        }

    }
}

</script>
