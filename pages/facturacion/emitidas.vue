<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Facturas emitidas</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <ListarFacturasComponent />
        </v-card-text>
    </v-card>
</template>
<script>
import ListarFacturasComponent from '@/components/facturacion/ListarFacturasComponent.vue';
export default {
    name: "Emitidas",
    components: {
        ListarFacturasComponent
    }
}
</script>