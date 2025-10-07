<template>

    <v-card elevation="1">
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                        <span>Autorización MIPRES</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
        </v-card-title>

        <v-card-text>
            <v-tabs show-arrows v-model="tab" grow>
                <v-tab key="pendientes">
                    Pendientes Por autorizar
                </v-tab>
                <v-tab key="autorizados">
                    Autorizados
                </v-tab>
            </v-tabs>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text>
            <v-tabs-items v-model="tab">

                <v-tab-item key="pendientes">
                    <listarMipressPendientesComponent/>
                </v-tab-item>

                <v-tab-item key="autorizados">
                    <listarMipressAutorizadosComponent/>
                </v-tab-item>

            </v-tabs-items>
        </v-card-text>

    </v-card>

</template>
<script>
import listarMipressAutorizadosComponent from '~/components/farmacia/autorizacion/listarMipressAutorizadosComponent.vue';
import listarMipressPendientesComponent from '~/components/farmacia/autorizacion/listarMipressPendientesComponent.vue';
export default {
    components: {
        listarMipressAutorizadosComponent,
        listarMipressPendientesComponent,
    },

    data(){
        return{
            tab: "mipress",
        }
    }

}
</script>
