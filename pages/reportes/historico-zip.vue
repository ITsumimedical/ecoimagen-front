<template>
    <v-card>

        <v-toolbar flat>
            <v-toolbar-title>
                <div class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                    <span>Generación de consolidado de historias</span>
                </div>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>

        <v-card-text>
            <ZipHistoricoFormComponent />
        </v-card-text>
    </v-card>
</template>
<script>
import ZipHistoricoFormComponent from "@/components/reportes/historico/ZipHistoricoFormComponent.vue";

export default {
    components: {
        ZipHistoricoFormComponent
    }
}

</script>