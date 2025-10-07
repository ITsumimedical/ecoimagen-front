<template>
    <div>
        <v-card flat>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Ingreso Barreras de Acceso</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <FormBarreraAccesoComponente />
        </v-card>
    </div>
</template>
<script>
import FormBarreraAccesoComponente from "~/components/barreraAcceso/ingreso/FormBarreraAccesoComponente.vue";

export default {
    components: {
        FormBarreraAccesoComponente
    },
}
</script>
